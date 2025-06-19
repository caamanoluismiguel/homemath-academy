'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  subscription?: 'active' | 'inactive' | 'trial' | 'free' | 'basic' | 'family';
}

interface Child {
  id: string;
  name: string;
  birthDate?: string;
  preferredGrade: string;
  preferredLang: string;
}

interface AuthContextType {
  user: User | null;
  children: Child[];
  selectedChild: Child | null;
  isLoading: boolean;
  login: (email: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  selectChild: (childId: string) => void;
  addChild: (childData: Omit<Child, 'id'>) => Promise<void>;
  setSelectedChild: (child: Child | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userChildren, setUserChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('demo_user');
    const savedChildren = localStorage.getItem('demo_children');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedChildren) {
      setUserChildren(JSON.parse(savedChildren));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, name: string) => {
    setIsLoading(true);
    
    // Simulate login process
    const demoUser: User = {
      id: 'demo-user-' + Date.now(),
      email,
      name,
      subscription: 'trial'
    };
    
    // Save to localStorage for demo purposes
    localStorage.setItem('demo_user', JSON.stringify(demoUser));
    setUser(demoUser);
    setIsLoading(false);
  };

  const logout = async () => {
    localStorage.removeItem('demo_user');
    localStorage.removeItem('demo_children');
    setUser(null);
    setUserChildren([]);
    setSelectedChild(null);
  };

  const selectChild = (childId: string) => {
    const child = userChildren.find(c => c.id === childId);
    if (child) {
      setSelectedChild(child);
    }
  };

  const addChild = async (childData: Omit<Child, 'id'>) => {
    const newChild: Child = {
      ...childData,
      id: 'child-' + Date.now()
    };
    
    const updatedChildren = [...userChildren, newChild];
    setUserChildren(updatedChildren);
    localStorage.setItem('demo_children', JSON.stringify(updatedChildren));
    
    // Auto-select the newly added child
    setSelectedChild(newChild);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      children: userChildren,
      selectedChild, 
      isLoading, 
      login, 
      logout, 
      selectChild,
      addChild,
      setSelectedChild 
    }}>
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

