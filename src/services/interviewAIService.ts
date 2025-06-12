interface TranscriptionSegment {
  timestamp: number;
  speaker: 'interviewer' | 'candidate';
  text: string;
  confidence: number;
}

interface EmotionAnalysis {
  timestamp: number;
  emotion: string;
  confidence: number;
  valence: number; // -1 (négatif) à 1 (positif)
  arousal: number; // 0 (calme) à 1 (excité)
}

interface InterviewAnalysis {
  overallScore: number;
  communication: number;
  technicalSkills: number;
  motivation: number;
  culturalFit: number;
  keyInsights: string[];
  recommendations: string[];
  transcription: string;
  transcriptionSegments: TranscriptionSegment[];
  emotions: EmotionAnalysis[];
  summary: string;
  keyMoments: { timestamp: number; description: string; importance: number }[];
  skillsAssessment: { skill: string; level: number; evidence: string[] }[];
}

interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface PerplexityResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

class InterviewAIService {
  private apiKey = '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';
  private apiUrl = 'https://api.perplexity.ai/chat/completions';
  private recognition: SpeechRecognition | null = null;
  private isTranscribing = false;
  private transcriptionSegments: TranscriptionSegment[] = [];
  private currentSpeaker: 'interviewer' | 'candidate' = 'candidate';

  constructor() {
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'fr-FR';
      this.recognition.maxAlternatives = 1;

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            const segment: TranscriptionSegment = {
              timestamp: Date.now(),
              speaker: this.currentSpeaker,
              text: result[0].transcript,
              confidence: result[0].confidence
            };
            this.transcriptionSegments.push(segment);
            this.onTranscriptionUpdate?.(segment);
          }
        }
      };

      this.recognition.onerror = (event) => {
        console.error('Erreur de reconnaissance vocale:', event.error);
      };
    }
  }

  private onTranscriptionUpdate?: (segment: TranscriptionSegment) => void;

  startTranscription(onUpdate?: (segment: TranscriptionSegment) => void) {
    if (!this.recognition) {
      throw new Error('Reconnaissance vocale non supportée par ce navigateur');
    }

    this.onTranscriptionUpdate = onUpdate;
    this.isTranscribing = true;
    this.transcriptionSegments = [];
    this.recognition.start();
    console.log('🎤 Transcription démarrée');
  }

  stopTranscription() {
    if (this.recognition && this.isTranscribing) {
      this.recognition.stop();
      this.isTranscribing = false;
      console.log('🛑 Transcription arrêtée');
    }
  }

  setSpeaker(speaker: 'interviewer' | 'candidate') {
    this.currentSpeaker = speaker;
  }

  getTranscriptionSegments(): TranscriptionSegment[] {
    return [...this.transcriptionSegments];
  }

  getFullTranscription(): string {
    return this.transcriptionSegments
      .map(segment => `[${segment.speaker}]: ${segment.text}`)
      .join('\n');
  }

  async analyzeInterview(data: {
    candidateName: string;
    position: string;
    transcriptionSegments: TranscriptionSegment[];
    duration: number;
  }): Promise<InterviewAnalysis> {
    try {
      console.log('🧠 Analyse IA de l\'entretien en cours...');
      
      const fullTranscription = data.transcriptionSegments
        .map(segment => `[${segment.speaker}]: ${segment.text}`)
        .join('\n');

      const systemPrompt = `Tu es un expert RH et psychologue du travail spécialisé dans l'analyse d'entretiens d'embauche. 
Analyse cet entretien et fournis une évaluation complète au format JSON strict.

Critères d'évaluation :
- Communication (clarté, structure, écoute)
- Compétences techniques (expertise métier)
- Motivation (engagement, projet professionnel)
- Adéquation culturelle (valeurs, comportement)

Format de réponse JSON requis :
{
  "overallScore": number (0-100),
  "communication": number (0-100),
  "technicalSkills": number (0-100),
  "motivation": number (0-100),
  "culturalFit": number (0-100),
  "keyInsights": ["insight1", "insight2", "insight3"],
  "recommendations": ["rec1", "rec2", "rec3"],
  "summary": "Résumé détaillé de l'entretien",
  "keyMoments": [{"timestamp": number, "description": "string", "importance": number}],
  "skillsAssessment": [{"skill": "string", "level": number, "evidence": ["string"]}]
}`;

      const userPrompt = `Candidat: ${data.candidateName}
Poste: ${data.position}
Durée: ${data.duration} minutes

Transcription de l'entretien:
${fullTranscription}

Analyse cet entretien selon les critères définis.`;

      const response = await this.makeAPICall([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);

      const analysis = this.parseJSONResponse(response);
      
      // Ajouter la transcription complète
      const result: InterviewAnalysis = {
        ...analysis,
        transcription: fullTranscription,
        transcriptionSegments: data.transcriptionSegments,
        emotions: this.analyzeEmotions(data.transcriptionSegments)
      };

      console.log('✅ Analyse IA terminée');
      return result;
    } catch (error) {
      console.error('Erreur analyse IA:', error);
      return this.getFallbackAnalysis(data);
    }
  }

  async generateInterviewSummary(transcription: string, candidateName: string, position: string): Promise<string> {
    try {
      const systemPrompt = `Tu es un expert RH. Génère un résumé professionnel et structuré de cet entretien d'embauche.
Le résumé doit inclure :
- Points forts du candidat
- Points d'attention
- Recommandations
- Conclusion

Style : professionnel, objectif, constructif.`;

      const userPrompt = `Candidat: ${candidateName}
Poste: ${position}

Transcription:
${transcription}

Génère un résumé structuré de cet entretien.`;

      const response = await this.makeAPICall([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);

      return response;
    } catch (error) {
      console.error('Erreur génération résumé:', error);
      return `Résumé de l'entretien avec ${candidateName} pour le poste de ${position}.\n\nLa transcription automatique a été enregistrée et peut être consultée dans les détails de l'entretien.`;
    }
  }

  private analyzeEmotions(segments: TranscriptionSegment[]): EmotionAnalysis[] {
    // Analyse basique des émotions basée sur les mots-clés
    const emotions: EmotionAnalysis[] = [];
    
    segments.forEach(segment => {
      const text = segment.text.toLowerCase();
      let emotion = 'neutre';
      let valence = 0;
      let arousal = 0.5;
      let confidence = 0.6;

      // Mots positifs
      if (text.includes('excellent') || text.includes('parfait') || text.includes('génial') || 
          text.includes('passionné') || text.includes('enthousiaste')) {
        emotion = 'enthousiaste';
        valence = 0.8;
        arousal = 0.7;
        confidence = 0.8;
      }
      // Mots de confiance
      else if (text.includes('sûr') || text.includes('certain') || text.includes('confiant') ||
               text.includes('maîtrise') || text.includes('expérience')) {
        emotion = 'confiant';
        valence = 0.6;
        arousal = 0.6;
        confidence = 0.7;
      }
      // Mots d'hésitation
      else if (text.includes('euh') || text.includes('hmm') || text.includes('peut-être') ||
               text.includes('je pense') || text.includes('probablement')) {
        emotion = 'hésitant';
        valence = -0.2;
        arousal = 0.4;
        confidence = 0.6;
      }
      // Mots de stress
      else if (text.includes('difficile') || text.includes('compliqué') || text.includes('problème') ||
               text.includes('inquiet') || text.includes('nerveux')) {
        emotion = 'stressé';
        valence = -0.5;
        arousal = 0.8;
        confidence = 0.7;
      }

      if (emotion !== 'neutre') {
        emotions.push({
          timestamp: segment.timestamp,
          emotion,
          confidence,
          valence,
          arousal
        });
      }
    });

    return emotions;
  }

  private async makeAPICall(messages: PerplexityMessage[]): Promise<string> {
    console.log('🌐 Appel API Perplexity avec', messages.length, 'messages');
    
    try {
      const requestBody = {
        model: 'sonar-pro',
        messages: messages,
        temperature: 0.1,
        max_tokens: 2000
      };
      
      console.log('📤 Requête API:', {
        url: this.apiUrl,
        model: requestBody.model,
        messagesCount: messages.length,
        hasApiKey: !!this.apiKey
      });
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Réponse API status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur API détaillée:', {
          status: response.status,
          statusText: response.statusText,
          errorBody: errorText
        });
        throw new Error(`Erreur API Perplexity: ${response.status} - ${response.statusText}. Détails: ${errorText}`);
      }

      const data: PerplexityResponse = await response.json();
      console.log('✅ Réponse API reçue:', {
        hasChoices: !!data.choices,
        choicesLength: data.choices?.length,
        hasContent: !!data.choices?.[0]?.message?.content
      });
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Réponse API invalide: structure inattendue');
      }
      
      return data.choices[0].message.content;
    } catch (error) {
      console.error('❌ Erreur dans makeAPICall:', error);
      throw error;
    }
  }

  private parseJSONResponse(content: string): any {
    try {
      const cleanedContent = content
        .replace(/```json\n?|\n?```/g, '')
        .replace(/^\s*[\r\n]/gm, '')
        .trim();
      
      return JSON.parse(cleanedContent);
    } catch (error) {
      console.error('Erreur parsing JSON:', error, 'Content:', content);
      throw new Error('Réponse IA invalide');
    }
  }

  private getFallbackAnalysis(data: {
    candidateName: string;
    position: string;
    transcriptionSegments: TranscriptionSegment[];
    duration: number;
  }): InterviewAnalysis {
    const wordCount = data.transcriptionSegments.reduce((count, segment) => 
      count + segment.text.split(' ').length, 0
    );
    
    const candidateSegments = data.transcriptionSegments.filter(s => s.speaker === 'candidate');
    const avgConfidence = candidateSegments.reduce((sum, s) => sum + s.confidence, 0) / candidateSegments.length;

    return {
      overallScore: Math.min(90, 60 + Math.floor(avgConfidence * 30)),
      communication: Math.min(95, 65 + Math.floor(avgConfidence * 25)),
      technicalSkills: 70,
      motivation: Math.min(90, 60 + Math.floor(wordCount / 50)),
      culturalFit: 75,
      keyInsights: [
        'Analyse basée sur la transcription automatique',
        `${candidateSegments.length} interventions du candidat`,
        `Confiance moyenne de transcription: ${Math.round(avgConfidence * 100)}%`
      ],
      recommendations: [
        'Réviser la transcription pour une analyse plus précise',
        'Compléter avec des notes manuelles',
        'Organiser un entretien de suivi si nécessaire'
      ],
      transcription: data.transcriptionSegments
        .map(segment => `[${segment.speaker}]: ${segment.text}`)
        .join('\n'),
      transcriptionSegments: data.transcriptionSegments,
      emotions: this.analyzeEmotions(data.transcriptionSegments),
      summary: `Entretien avec ${data.candidateName} pour le poste de ${data.position}. Durée: ${data.duration} minutes. Transcription automatique disponible.`,
      keyMoments: [],
      skillsAssessment: []
    };
  }
}

export const interviewAIService = new InterviewAIService();
export type { InterviewAnalysis, TranscriptionSegment, EmotionAnalysis };