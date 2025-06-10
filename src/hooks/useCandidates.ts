import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  position: string;
  experience: string;
  location: string;
  salary: string;
  score: number;
  status: 'To Contact' | 'Contacted' | 'Interview' | 'Qualified' | 'Rejected' | 'Hired';
  avatar?: string;
  phone?: string;
  skills: string[];
  notes: string;
  source: string;
  createdAt: any;
  updatedAt: any;
  userId: string;
}

export const useCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'candidates'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const candidatesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Candidate[];
      
      // Sort by createdAt in JavaScript instead of using Firestore orderBy
      const sortedCandidates = candidatesData.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      });
      
      setCandidates(sortedCandidates);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  const addCandidate = async (candidateData: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!currentUser) return;

    try {
      await addDoc(collection(db, 'candidates'), {
        ...candidateData,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding candidate:', error);
      throw error;
    }
  };

  const updateCandidate = async (id: string, updates: Partial<Candidate>) => {
    try {
      const candidateRef = doc(db, 'candidates', id);
      await updateDoc(candidateRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating candidate:', error);
      throw error;
    }
  };

  const deleteCandidate = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'candidates', id));
    } catch (error) {
      console.error('Error deleting candidate:', error);
      throw error;
    }
  };

  return {
    candidates,
    loading,
    addCandidate,
    updateCandidate,
    deleteCandidate
  };
};