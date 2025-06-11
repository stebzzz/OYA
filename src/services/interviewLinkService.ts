interface InterviewLink {
  id: string;
  sessionId: string;
  candidateId: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

export class InterviewLinkService {
  private static links: Map<string, InterviewLink> = new Map();

  static generateInvitationLink(sessionId: string, candidateId: string): { link: string; token: string } {
    const token = this.generateSecureToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours
    
    const linkData: InterviewLink = {
      id: `link-${Date.now()}`,
      sessionId,
      candidateId,
      token,
      expiresAt,
      used: false,
      createdAt: new Date()
    };

    this.links.set(token, linkData);
    
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/interview/join/${token}`;
    
    return { link, token };
  }

  static validateToken(token: string): { valid: boolean; linkData?: InterviewLink; error?: string } {
    const linkData = this.links.get(token);
    
    if (!linkData) {
      return { valid: false, error: 'Lien invalide ou expiré' };
    }

    if (linkData.expiresAt < new Date()) {
      return { valid: false, error: 'Ce lien d\'invitation a expiré' };
    }

    if (linkData.used) {
      return { valid: false, error: 'Ce lien a déjà été utilisé' };
    }

    return { valid: true, linkData };
  }

  static markAsUsed(token: string): boolean {
    const linkData = this.links.get(token);
    if (linkData) {
      linkData.used = true;
      this.links.set(token, linkData);
      return true;
    }
    return false;
  }

  static getActiveLinks(): InterviewLink[] {
    return Array.from(this.links.values())
      .filter(link => !link.used && link.expiresAt > new Date())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  private static generateSecureToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 32;
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static revokeLink(token: string): boolean {
    return this.links.delete(token);
  }

  static cleanupExpiredLinks(): number {
    const now = new Date();
    let cleaned = 0;
    
    for (const [token, linkData] of this.links.entries()) {
      if (linkData.expiresAt < now) {
        this.links.delete(token);
        cleaned++;
      }
    }
    
    return cleaned;
  }
}