import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, MessageCircle, Chrome } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (provider: 'facebook' | 'discord' | 'google') => {
    setIsLoading(true);
    try {
      await login(provider);
      toast.success(`Successfully logged in with ${provider}!`);
      navigate('/');
    } catch (error) {
      toast.error(`Failed to login with ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome to Shop</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            {/* Facebook Login */}
            <button
              onClick={() => handleLogin('facebook')}
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Facebook size={20} className="mr-2" />
              Continue with Facebook
            </button>

            {/* Discord Login */}
            <button
              onClick={() => handleLogin('discord')}
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <MessageCircle size={20} className="mr-2" />
              Continue with Discord
            </button>

            {/* Google Login */}
            <button
              onClick={() => handleLogin('google')}
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Chrome size={20} className="mr-2" />
              Continue with Google
            </button>
          </div>

          {isLoading && (
            <div className="mt-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-sm text-gray-600">Signing you in...</p>
            </div>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Demo Mode - No real authentication
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 