
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingStep from '@/components/OnboardingStep';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, UserCog, Bell, Calendar, Users, BarChart } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const Onboarding = () => {
  const { user, completeOnboarding } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    darkMode: false,
    accessibility: false
  });

  const totalSteps = 4;
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeOnboarding();
      navigate('/dashboard');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="py-6 px-8 bg-white shadow-sm">
        <Logo />
      </div>
      
      <div className="flex-grow flex items-center justify-center p-4 sm:p-8">
        {currentStep === 1 && (
          <OnboardingStep
            step={currentStep}
            totalSteps={totalSteps}
            title="Welcome to HospiVibe"
            description={`Welcome, ${user.name}! Let's get you set up as a ${user.role}.`}
            userRole={user.role}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirstStep={true}
            isLastStep={false}
          >
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg animate-fade-in">
                <div className="bg-white p-3 rounded-full shadow-sm">
                  <UserCog className={`h-6 w-6 text-role-${user.role}`} />
                </div>
                <div>
                  <h3 className="font-medium">Your Role: <span className="capitalize">{user.role}</span></h3>
                  <p className="text-gray-500 text-sm mt-1">
                    We've customized your experience based on your role. You'll have access to all the features you need.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Personalized Dashboard",
                    description: "View your key metrics and activities",
                    icon: <BarChart className="h-5 w-5" />,
                    color: `text-role-${user.role}`,
                    bg: `bg-role-${user.role}/10`
                  },
                  {
                    title: "Notifications",
                    description: "Stay updated with important alerts",
                    icon: <Bell className="h-5 w-5" />,
                    color: `text-role-${user.role}`,
                    bg: `bg-role-${user.role}/10`
                  },
                  {
                    title: "Schedule Management",
                    description: "Manage appointments and shifts",
                    icon: <Calendar className="h-5 w-5" />,
                    color: `text-role-${user.role}`,
                    bg: `bg-role-${user.role}/10`
                  },
                  {
                    title: "Team Collaboration",
                    description: "Communicate with your team",
                    icon: <Users className="h-5 w-5" />,
                    color: `text-role-${user.role}`,
                    bg: `bg-role-${user.role}/10`
                  }
                ].map((feature, index) => (
                  <div 
                    key={index} 
                    className={`p-4 border rounded-lg animate-fade-in animation-delay-${(index + 1) * 100}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`${feature.bg} p-2 rounded-md ${feature.color}`}>
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{feature.title}</h4>
                        <p className="text-gray-500 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </OnboardingStep>
        )}
        
        {currentStep === 2 && (
          <OnboardingStep
            step={currentStep}
            totalSteps={totalSteps}
            title="Personalize Your Experience"
            description="Configure your settings to suit your preferences"
            userRole={user.role}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirstStep={false}
            isLastStep={false}
          >
            <div className="space-y-6">
              <div className="animate-fade-in">
                <div className="space-y-4">
                  {[
                    {
                      id: 'notifications',
                      title: 'Push Notifications',
                      description: 'Receive alerts and updates in real-time'
                    },
                    {
                      id: 'emailUpdates',
                      title: 'Email Updates',
                      description: 'Get summaries and reports sent to your email'
                    },
                    {
                      id: 'darkMode',
                      title: 'Dark Mode',
                      description: 'Switch to a darker interface for low-light environments'
                    },
                    {
                      id: 'accessibility',
                      title: 'Accessibility Features',
                      description: 'Enable additional accessibility options'
                    }
                  ].map((setting, index) => (
                    <div 
                      key={setting.id} 
                      className={`flex items-center justify-between p-4 border rounded-lg animate-fade-in animation-delay-${index * 100}`}
                    >
                      <div>
                        <h4 className="font-medium">{setting.title}</h4>
                        <p className="text-gray-500 text-sm">{setting.description}</p>
                      </div>
                      <Switch 
                        id={setting.id}
                        checked={settings[setting.id as keyof typeof settings]}
                        onCheckedChange={() => handleToggle(setting.id as keyof typeof settings)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </OnboardingStep>
        )}
        
        {currentStep === 3 && (
          <OnboardingStep
            step={currentStep}
            totalSteps={totalSteps}
            title="Key Features for Your Role"
            description={`Explore these ${user.role}-specific tools and capabilities`}
            userRole={user.role}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirstStep={false}
            isLastStep={false}
          >
            <div className="space-y-6">
              {user.role === 'admin' && (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg animate-fade-in">
                    <h4 className="font-semibold flex items-center">
                      <Badge className="bg-role-admin mr-2">Admin</Badge>
                      User Management
                    </h4>
                    <p className="text-gray-600 mt-2">Create, edit, and manage user accounts for all hospital staff.</p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="text-sm bg-gray-50 p-2 rounded">Create users</div>
                      <div className="text-sm bg-gray-50 p-2 rounded">Set permissions</div>
                      <div className="text-sm bg-gray-50 p-2 rounded">Reset passwords</div>
                      <div className="text-sm bg-gray-50 p-2 rounded">Audit logs</div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg animate-fade-in animation-delay-100">
                    <h4 className="font-semibold flex items-center">
                      <Badge className="bg-role-admin mr-2">Admin</Badge>
                      Department Configuration
                    </h4>
                    <p className="text-gray-600 mt-2">Set up and manage hospital departments and their resources.</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg animate-fade-in animation-delay-200">
                    <h4 className="font-semibold flex items-center">
                      <Badge className="bg-role-admin mr-2">Admin</Badge>
                      System Settings
                    </h4>
                    <p className="text-gray-600 mt-2">Configure system-wide settings and integrations.</p>
                  </div>
                </div>
              )}
              
              {user.role === 'doctor' && (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg animate-fade-in">
                    <h4 className="font-semibold flex items-center">
                      <Badge className="bg-role-doctor mr-2">Doctor</Badge>
                      Patient Records
                    </h4>
                    <p className="text-gray-600 mt-2">Access and update comprehensive patient medical records.</p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="text-sm bg-gray-50 p-2 rounded">View history</div>
                      <div className="text-sm bg-gray-50 p-2 rounded">Update diagnoses</div>
                      <div className="text-sm bg-gray-50 p-2 rounded">Prescribe medication</div>
                      <div className="text-sm bg-gray-50 p-2 rounded">Record notes</div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg animate-fade-in animation-delay-100">
                    <h4 className="font-semibold flex items-center">
                      <Badge className="bg-role-doctor mr-2">Doctor</Badge>
                      Appointment Schedule
                    </h4>
                    <p className="text-gray-600 mt-2">Manage your appointments and patient consultations.</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg animate-fade-in animation-delay-200">
                    <h4 className="font-semibold flex items-center">
                      <Badge className="bg-role-doctor mr-2">Doctor</Badge>
                      Lab Results
                    </h4>
                    <p className="text-gray-600 mt-2">Review lab test results and diagnostic reports.</p>
                  </div>
                </div>
              )}
              
              {user.role === 'nurse' && (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg animate-fade-in">
                    <h4 className="font-semibold flex items-center">
                      <Badge className="bg-role-nurse mr-2">Nurse</Badge>
                      Patient Monitoring
                    </h4>
                    <p className="text-gray-600 mt-2">Track patient vitals and update their status regularly.</p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="text-sm bg-gray-50 p-2 rounded">Record vitals</div>
                      <div className="text-sm bg-gray-50 p-2 rounded">Monitor patients</div>
                      <div className="text-sm bg-gray-50 p-2 rounded">Update charts</div>
                      <div className="text-sm bg-gray-50 p-2 rounded">Patient alerts</div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg animate-fade-in animation-delay-100">
                    <h4 className="font-semibold flex items-center">
                      <Badge className="bg-role-nurse mr-2">Nurse</Badge>
                      Medication Administration
                    </h4>
                    <p className="text-gray-600 mt-2">Manage and record medication given to patients.</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg animate-fade-in animation-delay-200">
                    <h4 className="font-semibold flex items-center">
                      <Badge className="bg-role-nurse mr-2">Nurse</Badge>
                      Care Plans
                    </h4>
                    <p className="text-gray-600 mt-2">View and implement patient care plans.</p>
                  </div>
                </div>
              )}
              
              {user.role === 'patient' && (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg animate-fade-in">
                    <h4 className="font-semibold flex items-center">
                      <Badge className="bg-role-patient mr-2">Patient</Badge>
                      Appointments
                    </h4>
                    <p className="text-gray-600 mt-2">Schedule and manage your doctor appointments.</p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="text-sm bg-gray-50 p-2 rounded">Book appointments</div>
                      <div className="text-sm bg-gray-50 p-2 rounded">Reschedule</div>
                      <div className="text-sm bg-gray-50 p-2 rounded">Reminders</div>
                      <div className="text-sm bg-gray-50 p-2 rounded">History</div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg animate-fade-in animation-delay-100">
                    <h4 className="font-semibold flex items-center">
                      <Badge className="bg-role-patient mr-2">Patient</Badge>
                      Medical Records
                    </h4>
                    <p className="text-gray-600 mt-2">Access your medical history and test results.</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg animate-fade-in animation-delay-200">
                    <h4 className="font-semibold flex items-center">
                      <Badge className="bg-role-patient mr-2">Patient</Badge>
                      Prescriptions
                    </h4>
                    <p className="text-gray-600 mt-2">View and manage your current medications and refills.</p>
                  </div>
                </div>
              )}
            </div>
          </OnboardingStep>
        )}
        
        {currentStep === 4 && (
          <OnboardingStep
            step={currentStep}
            totalSteps={totalSteps}
            title="You're All Set!"
            description="You're ready to start using HospiVibe"
            userRole={user.role}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirstStep={false}
            isLastStep={true}
          >
            <div className="text-center py-8 space-y-6">
              <div className="inline-block animate-fade-in">
                <div className={`mx-auto rounded-full p-3 bg-role-${user.role}/10 text-role-${user.role}`}>
                  <CheckCircle2 className="h-16 w-16" />
                </div>
              </div>
              
              <div className="max-w-md mx-auto animate-fade-in animation-delay-100">
                <h3 className="text-xl font-medium mb-2">Your account is ready</h3>
                <p className="text-gray-600">
                  You've successfully set up your {user.role} account. You're now ready to explore the dashboard and start using HospiVibe.
                </p>
              </div>
              
              <Button
                className={`mt-6 button-effect bg-role-${user.role} hover:bg-role-${user.role}/90 animate-fade-in animation-delay-200`}
                onClick={handleNext}
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </OnboardingStep>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
