/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import { Layout } from './components/Layout';
import { LogIn, CheckCircle2 } from 'lucide-react';

function AppContent() {
  const { user, loading, signIn } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] p-6">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-blue-500/10 p-12 text-center border border-gray-100">
          <div className="h-20 w-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-blue-500/30">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-4">TaskFlow</h1>
          <p className="text-gray-500 text-lg mb-10 leading-relaxed">
            Organize your life, focus on what matters, and achieve more every day.
          </p>
          <button 
            onClick={signIn}
            className="w-full flex items-center justify-center gap-4 bg-white border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 text-gray-700 font-bold py-4 px-6 rounded-2xl transition-all active:scale-95 group"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
            <span>Continue with Google</span>
          </button>
          <p className="mt-8 text-xs text-gray-400 font-medium">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    );
  }

  return (
    <TaskProvider>
      <Layout />
    </TaskProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
