
import React from 'react';
import { Link } from 'react-router-dom';
import AuthForm, { AuthFormData } from '@/components/AuthForm';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const { login, isLoading } = useAuth();

  const handleLogin = async (formData: AuthFormData) => {
    await login(formData.email, formData.password, formData.role);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8">
        <div className="mb-8">
          <Link to="/" className="inline-block">
            <Logo />
          </Link>
        </div>
        
        <div className="flex-grow flex flex-col justify-center items-center">
          <div className="w-full max-w-md">
            <AuthForm
              type="login"
              onSubmit={handleLogin}
              isLoading={isLoading}
            />
            
            <div className="text-center mt-6 animate-fade-in animation-delay-400">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-hospital-600 hover:text-hospital-700 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-hospital-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-hospital-500/20 to-hospital-700/40"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-12">
          <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-md">Welcome Back to HospiVibe</h2>
          <p className="text-white/90 text-lg max-w-md drop-shadow-md">
            Your comprehensive solution for modern healthcare management
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
