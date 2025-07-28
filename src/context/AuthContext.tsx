import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from 'react';
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth as firebaseAuth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  reloadUser: () => Promise<void>; // added reloadUser
  signIn: (
    email: string,
    password: string,
    authProvider: 'supabase' | 'firebase'
  ) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name: string,
    role: string,
    authProvider: 'supabase' | 'firebase',
    additionalData?: Record<string, any>
  ) => Promise<void>;
  signOut: (authProvider: 'supabase' | 'firebase') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Firebase Auth Listener
    const unsubscribeFirebase = onAuthStateChanged(
      firebaseAuth,
      async (currentUser: FirebaseUser | null) => {
        if (!mountedRef.current) return;

        if (currentUser) {
          try {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            const data = userDoc.exists() ? userDoc.data() : {};
            const role = (data?.role as string) || 'user';

            const firebaseUser: User = {
              id: currentUser.uid,
              email: currentUser.email || '',
              name: currentUser.displayName || '',
              role,
              created_at: (data?.created_at as string) || new Date().toISOString(),
              emailVerified: currentUser.emailVerified, // add this
              ...data,
            };

            setUser(firebaseUser);
            setIsAdmin(role === 'admin');
            setIsAuthenticated(true);
          } catch (error) {
            console.error('Error fetching Firebase user data:', error);
            setUser(null);
            setIsAdmin(false);
            setIsAuthenticated(false);
          }
        } else {
          setUser(null);
          setIsAdmin(false);
          setIsAuthenticated(false);
        }

        setLoading(false);
      }
    );

    // Supabase Auth Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mountedRef.current) return;

        if (session?.user) {
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (error) throw error;

            if (profile) {
              setUser(profile as User);
              setIsAdmin(profile.role === 'admin');
              setIsAuthenticated(true);
            }
          } catch (error) {
            console.error('Error fetching Supabase user data:', error);
            setUser(null);
            setIsAdmin(false);
            setIsAuthenticated(false);
          }
        } else {
          setUser(null);
          setIsAdmin(false);
          setIsAuthenticated(false);
        }

        setLoading(false);
      }
    );

    return () => {
      unsubscribeFirebase();
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // Reload Firebase user to refresh emailVerified etc.
  const reloadUser = async () => {
    if (firebaseAuth.currentUser) {
      await firebaseAuth.currentUser.reload();
      const currentUser = firebaseAuth.currentUser;
      if (!currentUser) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const data = userDoc.exists() ? userDoc.data() : {};
        const role = (data?.role as string) || 'user';

        const firebaseUser: User = {
          id: currentUser.uid,
          email: currentUser.email || '',
          name: currentUser.displayName || '',
          role,
          created_at: (data?.created_at as string) || new Date().toISOString(),
          emailVerified: currentUser.emailVerified,
          ...data,
        };

        setUser(firebaseUser);
        setIsAdmin(role === 'admin');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error reloading Firebase user data:', error);
        setUser(null);
        setIsAdmin(false);
        setIsAuthenticated(false);
      }
    }
  };

  // Sign In
  const signIn = async (
    email: string,
    password: string,
    authProvider: 'supabase' | 'firebase'
  ) => {
    setLoading(true);
    try {
      if (authProvider === 'supabase') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        await signInWithEmailAndPassword(firebaseAuth, email, password);
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign Up
  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: string,
    authProvider: 'supabase' | 'firebase',
    additionalData: Record<string, any> = {}
  ) => {
    setLoading(true);
    try {
      if (authProvider === 'supabase') {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        if (data?.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                email,
                name,
                role,
                created_at: new Date().toISOString(),
                ...additionalData,
              },
            ]);
          if (profileError) throw profileError;
        }
      } else {
        const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        const firebaseUser = userCredential.user;

        await setDoc(doc(db, 'users', firebaseUser.uid), {
          uid: firebaseUser.uid,
          email,
          name,
          role,
          created_at: new Date().toISOString(),
          ...additionalData,
        });
      }
    } catch (error) {
      console.error('Sign-up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign Out
  const signOut = async (authProvider: 'supabase' | 'firebase') => {
    setLoading(true);
    try {
      if (authProvider === 'supabase') {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      } else {
        await firebaseSignOut(firebaseAuth);
      }

      setUser(null);
      setIsAdmin(false);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isAuthenticated,
        reloadUser, // added here
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
