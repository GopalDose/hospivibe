import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthForm, { AuthFormData } from '@/components/AuthForm';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const SignUp = () => {
  const { signup, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSignUp = async (formData: AuthFormData) => {
    try {
      setError(null);
      await signup(
        formData.name || '',
        formData.email,
        formData.password,
        formData.role
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: errorMessage,
      });
    }
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
              type="signup"
              onSubmit={handleSignUp}
              isLoading={isLoading}
              error={error}
            />
            
            <div className="text-center mt-6 animate-fade-in animation-delay-400">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-hospital-600 hover:text-hospital-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-hospital-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-hospital-600/20 to-hospital-800/40"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-12">
          <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-md">Join HospiVibe Today</h2>
          <p className="text-white/90 text-lg max-w-md drop-shadow-md">
            Create your account to experience streamlined healthcare management designed for your role
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;