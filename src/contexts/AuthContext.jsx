import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        /* Check active session on mount */
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user);
                setUserType(session.user.user_metadata?.user_type || localStorage.getItem('userType'));
            }
            setLoading(false);
        });

        /* Listen for auth state changes */
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(session.user);
                setUserType(session.user.user_metadata?.user_type || localStorage.getItem('userType'));
            } else {
                setUser(null);
                setUserType(null);
                localStorage.removeItem('userType');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    /**
     * Sign up with email/password and store userType in metadata
     */
    async function signUp(email, password, type) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { user_type: type }
            }
        });
        if (error) throw error;
        setUserType(type);
        localStorage.setItem('userType', type);
        return data;
    }

    /**
     * Sign in with email/password
     */
    async function signIn(email, password, type) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        setUserType(type || data.user?.user_metadata?.user_type);
        localStorage.setItem('userType', type || data.user?.user_metadata?.user_type);
        return data;
    }

    /**
     * Sign out
     */
    async function signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
        setUserType(null);
        localStorage.removeItem('userType');
    }

    /**
     * Enroll in MFA (Google Authenticator TOTP)
     * Returns QR code URI for scanning
     */
    async function enrollMFA() {
        const { data, error } = await supabase.auth.mfa.enroll({
            factorType: 'totp',
            friendlyName: 'Google Authenticator'
        });
        if (error) throw error;
        return data; // Contains totp.qr_code and totp.uri
    }

    /**
     * Verify MFA challenge with TOTP code
     */
    async function verifyMFA(factorId, code) {
        const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
            factorId
        });
        if (challengeError) throw challengeError;

        const { data, error } = await supabase.auth.mfa.verify({
            factorId,
            challengeId: challenge.id,
            code
        });
        if (error) throw error;
        return data;
    }

    /**
     * Get current session token for API calls
     */
    async function getAccessToken() {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token;
    }

    const value = {
        user,
        userType,
        loading,
        signUp,
        signIn,
        signOut,
        enrollMFA,
        verifyMFA,
        getAccessToken
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
