import { InterviewInvitationTemplate } from '../components/EmailTemplate';

interface SendInterviewInvitationParams {
  candidateEmail: string;
  candidateName: string;
  position: string;
  interviewDate: string;
  interviewTime: string;
  duration: number;
  joinLink: string;
  recruiterName: string;
  companyName: string;
}

export class EmailService {
  static async sendInterviewInvitation({
    candidateEmail,
    candidateName,
    position,
    interviewDate,
    interviewTime,
    duration,
    joinLink,
    recruiterName,
    companyName
  }: SendInterviewInvitationParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateEmail,
          candidateName,
          position,
          interviewDate,
          interviewTime,
          duration,
          joinLink,
          recruiterName,
          companyName,
          type: 'invitation'
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Erreur envoi email:', result.error);
        return { success: false, error: result.error || 'Erreur lors de l\'envoi de l\'email' };
      }

      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Erreur service email:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur de connexion au service d\'email' 
      };
    }
  }

  static async sendInterviewReminder({
    candidateEmail,
    candidateName,
    position,
    interviewDate,
    interviewTime,
    joinLink,
    companyName
  }: Omit<SendInterviewInvitationParams, 'duration' | 'recruiterName'>): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateEmail,
          candidateName,
          position,
          interviewDate,
          interviewTime,
          joinLink,
          companyName,
          type: 'reminder'
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Erreur envoi rappel:', result.error);
        return { success: false, error: result.error || 'Erreur lors de l\'envoi du rappel' };
      }

      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Erreur service rappel:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur de connexion au service d\'email' 
      };
    }
  }
}