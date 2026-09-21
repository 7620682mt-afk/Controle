'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface LoginProps {
  onLogin: () => void;
}

export function LoginView({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message === 'Invalid login credentials') {
          setError('Credenciais inválidas. Verifique seu e-mail e senha.');
        } else {
          setError(authError.message);
        }
      } else if (data.session) {
        localStorage.setItem('stockflow_session', 'active');
        onLogin();
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado ao tentar fazer login.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface-container-lowest p-8 rounded-2xl shadow-xl border border-outline-variant/20"
      >
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-lg mb-2">
            <span className="material-symbols-outlined text-[32px]">inventory</span>
          </div>
          <h1 className="text-[24px] font-bold text-on-surface">StockFlow ERP</h1>
          <p className="text-[14px] text-outline text-center">Entre com suas credenciais para acessar o painel de operações.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">E-mail Corporativo</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
              <input 
                type="email"
                required
                className="w-full h-12 pl-10 pr-4 bg-surface-container-low rounded-xl border border-outline-variant/30 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="ex: admin@stockflow.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Senha</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
              <input 
                type="password"
                required
                className="w-full h-12 pl-10 pr-4 bg-surface-container-low rounded-xl border border-outline-variant/30 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-error-container/20 border border-error/20 p-3 rounded-lg flex items-center gap-2 text-error text-[13px] font-medium"
              >
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            disabled={isLoading}
            className="h-12 w-full bg-primary text-on-primary rounded-xl font-bold text-[15px] shadow-lg hover:bg-primary-container active:scale-95 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Acessar Sistema
                <span className="material-symbols-outlined text-[20px]">login</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-outline-variant/10 text-center">
          <p className="text-[12px] text-outline">
            Dificuldades no acesso ou esqueceu sua senha? <br />
            <a href="#" className="text-primary font-bold hover:underline">Contate o administrador do sistema</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
