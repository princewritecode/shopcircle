import React, { useState } from 'react';
import { X, Lock, User as UserIcon, LogIn, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { addToast } from '../store/toastSlice';
import { axiosClient } from '../api/axiosClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);

  // DummyJSON sample user credentials: emilys / emilyspass
  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    dispatch(loginStart());
    try {
      const response = await axiosClient.post('/auth/login', {
        username,
        password,
        expiresInMins: 60,
      });

      dispatch(loginSuccess(response.data));
      dispatch(addToast({ message: `Welcome back, ${response.data.firstName}!`, type: 'success' }));
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid username or password';
      dispatch(loginFailure(msg));
      dispatch(addToast({ message: msg, type: 'error' }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl z-10 text-white space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2 font-bold text-base">
            <LogIn className="w-5 h-5 text-white" />
            <span>Sign In to ShopCircle</span>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-400 space-y-1">
          <p className="font-semibold text-zinc-300">DummyJSON Demo Auth Credentials:</p>
          <p className="font-mono">Username: <strong className="text-white">emilys</strong> &nbsp;|&nbsp; Password: <strong className="text-white">emilyspass</strong></p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-900 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1">Username</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-white focus:border-white outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-white focus:border-white outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-zinc-200 text-black font-extrabold py-3 rounded-xl uppercase tracking-wider text-xs shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
