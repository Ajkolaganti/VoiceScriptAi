'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  AuthError as FirebaseAuthError
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { getAuthError, AuthError } from '@/lib/auth-errors';

interface UserProfile {
  uid: string;
  email: string;
  subscription: 'free' | 'basic';
  credits: number;
  maxFileDuration: number; // in minutes
  createdAt: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthError | null>;
  signUp: (email: string, password: string) => Promise<AuthError | null>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthError | null>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  checkCredits: (duration: number) => Promise<{ canUse: boolean; remaining: number; message: string }>;
  deductCredits: (duration: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await loadUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadUserProfile = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as UserProfile);
      } else {
        // Create new user profile
        const newProfile: UserProfile = {
          uid,
          email: user?.email || '',
          subscription: 'free',
          credits: 10, // 10 free credits for new users
          maxFileDuration: 1, // 1 minute for free tier
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, 'users', uid), newProfile);
        setUserProfile(newProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const signIn = async (email: string, password: string): Promise<AuthError | null> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return null;
    } catch (error: any) {
      const firebaseError = error as FirebaseAuthError;
      return getAuthError(firebaseError.code);
    }
  };

  const signUp = async (email: string, password: string): Promise<AuthError | null> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await loadUserProfile(result.user.uid);
      return null;
    } catch (error: any) {
      const firebaseError = error as FirebaseAuthError;
      return getAuthError(firebaseError.code);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Logout error:', error);
      // Even if logout fails, we should clear the local state
      setUser(null);
      setUserProfile(null);
    }
  };

  const resetPassword = async (email: string): Promise<AuthError | null> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return null;
    } catch (error: any) {
      const firebaseError = error as FirebaseAuthError;
      return getAuthError(firebaseError.code);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      await updateDoc(doc(db, 'users', user.uid), updates);
      setUserProfile(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const checkCredits = async (duration: number): Promise<{ canUse: boolean; remaining: number; message: string }> => {
    if (!userProfile) {
      return { canUse: false, remaining: 0, message: 'Please sign in to use the service' };
    }

    // Check file duration limit
    if (duration > userProfile.maxFileDuration) {
      return { 
        canUse: false, 
        remaining: userProfile.credits, 
        message: `File duration (${duration.toFixed(1)} minutes) exceeds your plan limit (${userProfile.maxFileDuration} minutes). Please upgrade your plan.`
      };
    }

    const creditsNeeded = Math.ceil(duration); // 1 credit per minute, rounded up
    const canUse = userProfile.credits >= creditsNeeded;

    return {
      canUse,
      remaining: userProfile.credits,
      message: canUse 
        ? `You have ${userProfile.credits} credits remaining. This transcription will cost ${creditsNeeded} credits.`
        : `Insufficient credits. You need ${creditsNeeded} credits but have ${userProfile.credits}. Please purchase more credits.`
    };
  };

  const deductCredits = async (duration: number) => {
    if (!userProfile) return;
    
    const creditsNeeded = Math.ceil(duration); // 1 credit per minute, rounded up
    const newCredits = Math.max(0, userProfile.credits - creditsNeeded);
    
    await updateUserProfile({
      credits: newCredits
    });
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    logout,
    resetPassword,
    updateUserProfile,
    checkCredits,
    deductCredits,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 