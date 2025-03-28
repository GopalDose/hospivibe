
import React from 'react';
import { UserRole } from '@/context/AuthContext';
import { Shield, User, Users, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoleSelectorProps {
  selectedRole: UserRole | null;
  onSelectRole: (role: UserRole) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onSelectRole }) => {
  const roles: { id: UserRole; title: string; description: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'admin',
      title: 'Administrator',
      description: 'System management and configuration',
      icon: <Shield className="h-8 w-8" />,
      color: 'role-admin'
    },
    {
      id: 'doctor',
      title: 'Doctor',
      description: 'Patient care and medical records',
      icon: <Stethoscope className="h-8 w-8" />,
      color: 'role-doctor'
    },
    {
      id: 'nurse',
      title: 'Nurse',
      description: 'Patient support and care assistance',
      icon: <Users className="h-8 w-8" />,
      color: 'role-nurse'
    },
    {
      id: 'patient',
      title: 'Patient',
      description: 'Schedule appointments and view records',
      icon: <User className="h-8 w-8" />,
      color: 'role-patient'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
      {roles.map((role, index) => (
        <div
          key={role.id}
          className={cn(
            'role-card group animate-fade-in',
            `animation-delay-${(index + 1) * 100}`,
            selectedRole === role.id ? 'selected ring-hospital-500' : 'hover:border-hospital-300'
          )}
          onClick={() => onSelectRole(role.id)}
        >
          <div className="absolute top-2 right-2">
            {selectedRole === role.id && (
              <div className="h-3 w-3 rounded-full bg-hospital-500 animate-pulse" />
            )}
          </div>
          
          <div className="flex items-start space-x-4">
            <div 
              className={cn(
                "p-3 rounded-lg transition-colors", 
                `text-${role.color}`,
                selectedRole === role.id 
                  ? `bg-${role.color}/10` 
                  : `bg-${role.color}/5 group-hover:bg-${role.color}/10`
              )}
            >
              {role.icon}
            </div>
            
            <div>
              <h3 className={cn(
                "font-medium transition-colors",
                selectedRole === role.id ? `text-${role.color}` : "text-gray-700 group-hover:text-gray-900"
              )}>
                {role.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{role.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoleSelector;
