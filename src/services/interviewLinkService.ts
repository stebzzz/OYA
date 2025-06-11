interface InterviewLink {
  sessionId: string;
  candidateId: string;
  expiresAt: Date;
  createdAt: Date;
}

export class InterviewLinkService {
  static generateInvitationLink(sessionId: string, candidateId: string): { link: string; token: string } {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours
    const createdAt = new Date();
    
    // Encoder les données directement dans le token
    const linkData = {
      sessionId,
      candidateId,
      expiresAt: expiresAt.getTime(),
      createdAt: createdAt.getTime()
    };
    
    // Encoder en base64 pour créer le token
    const token = btoa(JSON.stringify(linkData))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/interview/join/${token}`;
    
    return { link, token };
  }

  static validateToken(token: string): { valid: boolean; linkData?: InterviewLink; error?: string } {
    try {
      // Décoder le token
      const paddedToken = token + '='.repeat((4 - token.length % 4) % 4);
      const decodedToken = paddedToken
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      
      const data = JSON.parse(atob(decodedToken));
      
      const linkData: InterviewLink = {
        sessionId: data.sessionId,
        candidateId: data.candidateId,
        expiresAt: new Date(data.expiresAt),
        createdAt: new Date(data.createdAt)
      };
      
      // Vérifier l'expiration
      if (linkData.expiresAt < new Date()) {
        return { valid: false, error: 'Ce lien d\'invitation a expiré' };
      }
      
      return { valid: true, linkData };
    } catch (error) {
      return { valid: false, error: 'Lien invalide ou corrompu' };
    }
  }

  static markAsUsed(token: string): boolean {
    // Plus besoin de marquer comme utilisé car pas de persistance
    return true;
  }

  static getActiveLinks(): InterviewLink[] {
    // Plus de stockage, donc retourner un tableau vide
    return [];
  }

  static revokeLink(token: string): boolean {
    // Plus de stockage, donc toujours retourner true
    return true;
  }

  static cleanupExpiredLinks(): number {
    // Plus de nettoyage nécessaire car pas de stockage
    return 0;
  }
}