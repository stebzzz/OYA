import { create } from 'zustand';
import { auth } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

interface AuthState {
  user: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const errorCode = (error as any).code;
      let errorMessage = "Une erreur s'est produite lors de la connexion.";

      // Traduire les messages d'erreur Firebase en français
      switch (errorCode) {
        case 'auth/invalid-email':
          errorMessage = "L'adresse email est mal formatée.";
          break;
        case 'auth/user-disabled':
          errorMessage = "Ce compte utilisateur a été désactivé.";
          break;
        case 'auth/user-not-found':
          errorMessage = "Aucun compte ne correspond à cette adresse email.";
          break;
        case 'auth/wrong-password':
          errorMessage = "Le mot de passe est incorrect.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Trop de tentatives de connexion. Veuillez réessayer plus tard.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Problème de connexion réseau. Vérifiez votre connexion internet.";
          break;
      }

      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const errorCode = (error as any).code;
      let errorMessage = "Une erreur s'est produite lors de l'inscription.";

      // Traduire les messages d'erreur Firebase en français
      switch (errorCode) {
        case 'auth/email-already-in-use':
          errorMessage = "Cette adresse email est déjà utilisée par un autre compte.";
          break;
        case 'auth/invalid-email':
          errorMessage = "L'adresse email est mal formatée.";
          break;
        case 'auth/operation-not-allowed':
          errorMessage = "L'inscription par email/mot de passe n'est pas activée.";
          break;
        case 'auth/weak-password':
          errorMessage = "Le mot de passe est trop faible. Utilisez au moins 6 caractères.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Problème de connexion réseau. Vérifiez votre connexion internet.";
          break;
      }

      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      await firebaseSignOut(auth);
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  }
}));

// Set up auth state listener
onAuthStateChanged(auth, (user) => {
  useAuthStore.setState({ user, loading: false });
});