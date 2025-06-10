import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Fonction pour traduire les codes d'erreur Firebase
const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'Aucun utilisateur trouvé avec cette adresse email.';
    case 'auth/wrong-password':
      return 'Mot de passe incorrect.';
    case 'auth/invalid-email':
      return 'Adresse email invalide.';
    case 'auth/user-disabled':
      return 'Ce compte utilisateur a été désactivé.';
    case 'auth/email-already-in-use':
      return 'Cette adresse email est déjà utilisée.';
    case 'auth/weak-password':
      return 'Le mot de passe doit contenir au moins 6 caractères.';
    case 'auth/invalid-credential':
      return 'Identifiants invalides. Vérifiez votre email et mot de passe.';
    case 'auth/too-many-requests':
      return 'Trop de tentatives de connexion. Veuillez réessayer plus tard.';
    default:
      return 'Une erreur est survenue lors de l\'authentification.';
  }
};

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      // Relancer l'erreur pour que le composant puisse la gérer
      throw new Error(getErrorMessage(error.code));
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName });
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      throw new Error(getErrorMessage(error.code));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Erreur de déconnexion:', error);
      throw new Error('Erreur lors de la déconnexion.');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};