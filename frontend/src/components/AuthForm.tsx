
import React, { useState } from 'react';
import { UserRole } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import RoleSelector from '@/components/RoleSelector';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'signup';
  onSubmit: (data: AuthFormData) => void;
  isLoading: boolean;
}

export interface AuthFormData {
  name?: string;
  email: string;
  password: string;
  role: UserRole;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, isLoading }) => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    name: '',
    email: '',
    password: '',
    role: 'patient'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (role: UserRole) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (type === 'signup' && !formData.name) {
      toast({
        title: "Validation Error",
        description: "Please enter your name",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-scale-in shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {type === 'login' ? 'Sign In' : 'Create Account'}
        </CardTitle>
        <CardDescription>
          {type === 'login' 
            ? 'Enter your credentials to access your account' 
            : 'Fill in the information to create your account'}
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {type === 'signup' && (
            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="name">Full Name</Label>
              <div className="form-input-effect relative">
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="transition-all duration-200 focus:border-hospital-500 focus:ring-hospital-500"
                  autoComplete="name"
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2 animate-fade-in animation-delay-100">
            <Label htmlFor="email">Email</Label>
            <div className="form-input-effect relative">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="transition-all duration-200 focus:border-hospital-500 focus:ring-hospital-500"
                autoComplete="email"
              />
            </div>
          </div>
          
          <div className="space-y-2 animate-fade-in animation-delay-200">
            <Label htmlFor="password">Password</Label>
            <div className="form-input-effect relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="pr-10 transition-all duration-200 focus:border-hospital-500 focus:ring-hospital-500"
                autoComplete={type === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <div className="space-y-3 pt-2 animate-fade-in animation-delay-300">
            <Label>Select Your Role</Label>
            <RoleSelector 
              selectedRole={formData.role} 
              onSelectRole={handleRoleSelect} 
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full button-effect bg-hospital-600 hover:bg-hospital-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {type === 'login' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              <>
                {type === 'login' ? 'Sign In' : 'Create Account'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AuthForm;
