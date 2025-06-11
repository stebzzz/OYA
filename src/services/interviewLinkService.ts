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
  private static readonly STORAGE_KEY = 'oya_interview_links';

  private static getStoredLinks(): Map<string, InterviewLink> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return new Map();
      
      const data = JSON.parse(stored);
      const links = new Map<string, InterviewLink>();
      
      for (const [token, linkData] of Object.entries(data)) {
        const link = linkData as any;
        links.set(token, {
          ...link,
          expiresAt: new Date(link.expiresAt),
          createdAt: new Date(link.createdAt)
        });
      }
      
      return links;
    } catch (error) {
      console.error('Erreur lors du chargement des liens:', error);
      return new Map();
    }
  }

  private static saveLinks(links: Map<string, InterviewLink>): void {
    try {
      const data: Record<string, any> = {};
      for (const [token, linkData] of links.entries()) {
        data[token] = {
          ...linkData,
          expiresAt: linkData.expiresAt.toISOString(),
          createdAt: linkData.createdAt.toISOString()
        };
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des liens:', error);
    }
  }

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

    const links = this.getStoredLinks();
    links.set(token, linkData);
    this.saveLinks(links);
    
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/interview/join/${token}`;
    
    return { link, token };
  }

  static validateToken(token: string): { valid: boolean; linkData?: InterviewLink; error?: string } {
    const links = this.getStoredLinks();
    const linkData = links.get(token);
    
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
    const links = this.getStoredLinks();
    const linkData = links.get(token);
    if (linkData) {
      linkData.used = true;
      links.set(token, linkData);
      this.saveLinks(links);
      return true;
    }
    return false;
  }

  static getActiveLinks(): InterviewLink[] {
    const links = this.getStoredLinks();
    return Array.from(links.values())
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
    const links = this.getStoredLinks();
    const deleted = links.delete(token);
    if (deleted) {
      this.saveLinks(links);
    }
    return deleted;
  }

  static cleanupExpiredLinks(): number {
    const links = this.getStoredLinks();
    const now = new Date();
    let cleaned = 0;
    
    for (const [token, linkData] of links.entries()) {
      if (linkData.expiresAt < now) {
        links.delete(token);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      this.saveLinks(links);
    }
    
    return cleaned;
  }
}