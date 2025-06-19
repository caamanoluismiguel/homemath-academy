'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { auth } from './firebase';
import { User, Child } from './types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  children: Child[];
  selectedChild: Child | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  addChild: (childData: Omit<Child, 'id' | 'userId'>) => Promise<void>;
  updateChild: (child: Child) => Promise<void>;
  selectChild: (childId: string) => void;
  refreshChildren: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children: providerChildren }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        // User is signed in, fetch user data from our database
        try {
          const response = await fetch('/api/auth/user', {
            headers: {
              'Authorization': `Bearer ${await firebaseUser.getIdToken()}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            setChildren(data.user.children || []);
            
            // Auto-select first child if available
            if (data.user.children && data.user.children.length > 0) {
              setSelectedChild(data.user.children[0]);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        // User is signed out
        setUser(null);
        setChildren([]);
        setSelectedChild(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // User data will be set by the onAuthStateChanged listener
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user in our database
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await userCredential.user.getIdToken()}`
        },
        body: JSON.stringify({ email, name }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user profile');
      }

      // User data will be set by the onAuthStateChanged listener
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // User data will be cleared by the onAuthStateChanged listener
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const addChild = async (childData: Omit<Child, 'id' | 'userId'>) => {
    if (!user || !firebaseUser) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/children', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await firebaseUser.getIdToken()}`
        },
        body: JSON.stringify({ ...childData, userId: user.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to add child');
      }

      const data = await response.json();
      const newChildren = [...children, data.child];
      setChildren(newChildren);
      
      // Auto-select if first child
      if (children.length === 0) {
        setSelectedChild(data.child);
      }
    } catch (error) {
      console.error('Add child error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateChild = async (child: Child) => {
    if (!firebaseUser) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/children/${child.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await firebaseUser.getIdToken()}`
        },
        body: JSON.stringify(child),
      });

      if (!response.ok) {
        throw new Error('Failed to update child');
      }

      const data = await response.json();
      setChildren(prev => prev.map(c => c.id === child.id ? data.child : c));
      
      if (selectedChild?.id === child.id) {
        setSelectedChild(data.child);
      }
    } catch (error) {
      console.error('Update child error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const selectChild = (childId: string) => {
    const child = children.find(c => c.id === childId);
    setSelectedChild(child || null);
  };

  const refreshChildren = async () => {
    if (!user || !firebaseUser) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/children?userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${await firebaseUser.getIdToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch children');
      }

      const data = await response.json();
      setChildren(data.children);
    } catch (error) {
      console.error('Refresh children error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      firebaseUser,
      children,
      selectedChild,
      login,
      register,
      logout,
      addChild,
      updateChild,
      selectChild,
      refreshChildren,
      isLoading,
    }}>
      {providerChildren}
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

