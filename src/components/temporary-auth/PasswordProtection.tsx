"use client"
import { useToast } from '@/hooks/use-toast';
import React, { useState, useEffect } from 'react';

const CORRECT_PASSWORD = process.env.NEXT_PUBLIC_CORRECT_PASSWORD!;
const AUTH_KEY = process.env.NEXT_PUBLIC_AUTH_KEY!;


interface PasswordProtectionProps {
    children: React.ReactNode;
}

const PasswordProtection: React.FC<PasswordProtectionProps> = ({ children }) => {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingText, setLoadingText] = useState('Checking permissions...');
    const { toast } = useToast()

    useEffect(() => {
        const storedAuth = localStorage.getItem(AUTH_KEY);
        if (storedAuth === 'true') {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (isLoading) {
            const texts = ['Verifying...', 'Almost there...'];
            let index = 0;
            const intervalId = setInterval(() => {
                setLoadingText(texts[index]);
                index = (index + 1) % texts.length;
            }, 2000);

            return () => clearInterval(intervalId);
        }
    }, [isLoading]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === CORRECT_PASSWORD) {
            setIsAuthenticated(true);
            localStorage.setItem(AUTH_KEY, 'true');
            toast({
                title: 'Access Granted',
                description: 'Welcome to Eventure',
                variant: 'success',
                duration: 2000,
            })
        } else {
            toast({
                title: 'Incorrect Password',
                description: 'Please try again',
                variant: 'destructive',
                duration: 1500,
            })
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                    <p className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">{loadingText}</p>
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="p-3 flex items-center justify-center min-h-screen bg-gradient-to-br from-brown-900 to-amber-800">
            <div className="max-w-md w-full p-8 bg-brown-800 bg-opacity-70 backdrop-blur-sm rounded-xl shadow-2xl border border-brown-700">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold text-white mb-2">Eventure</h1>
                    <p className="text-amber-300 text-lg">Beta Access</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-2">Enter Beta Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-brown-700 border border-brown-600 rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-200"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-brown-600 text-white rounded-lg font-semibold shadow-md hover:from-amber-500 hover:to-brown-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 transition duration-200"
                    >
                        Access Beta
                    </button>
                </form>
                <p className="mt-6 text-center  text-sm">Authorized users only. Contact admin for access.</p>
            </div>
        </div>
    );
};

export default PasswordProtection;