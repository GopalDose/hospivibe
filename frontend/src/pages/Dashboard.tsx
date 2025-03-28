
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, UserCheck, Users, Bell, Pill, FileText, Activity, BarChart4 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { user, isAuthenticated, onboardingComplete } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!onboardingComplete) {
      navigate('/onboarding');
      return;
    }
    
    // Welcome toast
    toast({
      title: `Welcome, ${user?.name}!`,
      description: "You've successfully logged into your dashboard.",
    });
  }, [isAuthenticated, navigate, onboardingComplete, toast, user]);
  
  if (!user) return null;
  
  const getRoleColor = (role: string) => {
    return `bg-role-${role} text-white`;
  };
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                {getGreeting()}, {user.name}
              </h1>
              <p className="text-gray-500 mt-1">
                Here's what's happening in your <Badge className={getRoleColor(user.role)}>{user.role}</Badge> dashboard
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Today</span>
              </Button>
              <Button className={`gap-2 bg-role-${user.role} hover:bg-role-${user.role}/90`}>
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Admin Dashboard */}
        {user.role === 'admin' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="animate-fade-in">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Staff Overview</CardTitle>
                <CardDescription>Total staff members and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4 bg-role-admin/10 p-3 rounded-full">
                      <Users className="h-6 w-6 text-role-admin" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">248</div>
                      <div className="text-sm text-gray-500">Active Staff</div>
                    </div>
                  </div>
                  <div className="text-green-500 text-sm font-medium">+12 this month</div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50 py-2 rounded-md">
                    <div className="font-semibold">54</div>
                    <div className="text-xs text-gray-500">Doctors</div>
                  </div>
                  <div className="bg-gray-50 py-2 rounded-md">
                    <div className="font-semibold">112</div>
                    <div className="text-xs text-gray-500">Nurses</div>
                  </div>
                  <div className="bg-gray-50 py-2 rounded-md">
                    <div className="font-semibold">82</div>
                    <div className="text-xs text-gray-500">Other</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in animation-delay-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Department Status</CardTitle>
                <CardDescription>Capacity and utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Emergency', 'Surgery', 'Pediatrics', 'Cardiology'].map((dept, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="font-medium">{dept}</div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-hospital-500 rounded-full" 
                            style={{ width: `${Math.floor(Math.random() * 60) + 40}%` }} 
                          />
                        </div>
                        <span className="text-sm text-gray-500">
                          {Math.floor(Math.random() * 30) + 10}/{Math.floor(Math.random() * 20) + 30}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in animation-delay-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">System Health</CardTitle>
                <CardDescription>Performance and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="mr-4 bg-green-100 p-2 rounded-full">
                      <Activity className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">All Systems Operational</div>
                      <div className="text-xs text-gray-500">Last checked: 5 minutes ago</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Database', status: 'Healthy', color: 'bg-green-500' },
                    { name: 'API Services', status: 'Healthy', color: 'bg-green-500' },
                    { name: 'Storage', status: 'Warning', color: 'bg-yellow-500' },
                    { name: 'Authentication', status: 'Healthy', color: 'bg-green-500' }
                  ].map((service, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="text-sm">{service.name}</div>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full ${service.color} mr-2`} />
                        <span className="text-xs">{service.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in animation-delay-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Recent Activities</CardTitle>
                <CardDescription>System events and logs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'User Created', details: 'New doctor account', time: '15m ago' },
                    { action: 'Role Modified', details: 'Updated permissions', time: '1h ago' },
                    { action: 'Department Added', details: 'New Neurology wing', time: '3h ago' },
                    { action: 'System Update', details: 'Security patches', time: '1d ago' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="h-2 w-2 mt-2 rounded-full bg-hospital-500" />
                      <div>
                        <div className="font-medium text-sm">{activity.action}</div>
                        <div className="text-xs text-gray-500">{activity.details}</div>
                        <div className="text-xs text-gray-400 mt-1">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Doctor Dashboard */}
        {user.role === 'doctor' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="animate-fade-in">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Today's Appointments</CardTitle>
                <CardDescription>Scheduled patient consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Sarah Johnson', time: '9:30 AM', status: 'Completed' },
                    { name: 'James Wilson', time: '11:00 AM', status: 'In Progress' },
                    { name: 'Emma Davis', time: '2:15 PM', status: 'Upcoming' },
                    { name: 'Michael Brown', time: '3:45 PM', status: 'Upcoming' }
                  ].map((appointment, index) => (
                    <div key={index} className="flex items-start justify-between p-2 hover:bg-gray-50 rounded-md">
                      <div className="flex items-start space-x-3">
                        <div className={`mt-1 h-2 w-2 rounded-full ${
                          appointment.status === 'Completed' ? 'bg-green-500' :
                          appointment.status === 'In Progress' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                        <div>
                          <div className="font-medium">{appointment.name}</div>
                          <div className="text-xs text-gray-500 flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" /> {appointment.time}
                          </div>
                        </div>
                      </div>
                      <Badge 
                        className={
                          appointment.status === 'Completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                          appointment.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : 
                          'bg-blue-100 text-blue-800 hover:bg-blue-100'
                        }
                        variant="outline"
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in animation-delay-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Patient Overview</CardTitle>
                <CardDescription>Your current patient statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Total Patients</div>
                    <div className="text-2xl font-bold">158</div>
                    <div className="text-xs text-green-500 mt-1">+3 this week</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Appointments</div>
                    <div className="text-2xl font-bold">36</div>
                    <div className="text-xs text-gray-500 mt-1">Next 7 days</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Follow-ups</div>
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-xs text-gray-500 mt-1">Pending</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Lab Results</div>
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-xs text-red-500 mt-1">Needs review</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in animation-delay-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Recent Patient Notes</CardTitle>
                <CardDescription>Latest updates and records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { patient: 'Emma Davis', note: 'Blood pressure stabilizing after medication adjustment', time: '1h ago' },
                    { patient: 'James Wilson', note: 'CT scan results reviewed, follow-up scheduled', time: '3h ago' },
                    { patient: 'Sarah Johnson', note: 'Post-op recovery progressing well, pain managed', time: '5h ago' }
                  ].map((note, index) => (
                    <div key={index} className="p-3 border rounded-md hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="font-medium">{note.patient}</div>
                        <div className="text-xs text-gray-500">{note.time}</div>
                      </div>
                      <div className="mt-1 text-sm text-gray-600">{note.note}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Nurse Dashboard */}
        {user.role === 'nurse' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="animate-fade-in">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Patient Monitoring</CardTitle>
                <CardDescription>Current patient status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Robert Chen', room: '302A', status: 'Stable', priority: 'Normal' },
                    { name: 'Amelia Garcia', room: '315B', status: 'Needs Attention', priority: 'High' },
                    { name: 'Thomas Wilson', room: '307A', status: 'Stable', priority: 'Normal' },
                    { name: 'Olivia Martin', room: '310B', status: 'Improving', priority: 'Low' }
                  ].map((patient, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-3">
                        <div className={`h-2 w-2 rounded-full ${
                          patient.priority === 'High' ? 'bg-red-500' :
                          patient.priority === 'Normal' ? 'bg-blue-500' : 'bg-green-500'
                        }`} />
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-xs text-gray-500">Room {patient.room}</div>
                        </div>
                      </div>
                      <Badge 
                        className={
                          patient.status === 'Needs Attention' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                          patient.status === 'Stable' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : 
                          'bg-green-100 text-green-800 hover:bg-green-100'
                        }
                        variant="outline"
                      >
                        {patient.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in animation-delay-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Medication Schedule</CardTitle>
                <CardDescription>Upcoming medication administration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { patient: 'Amelia Garcia', medication: 'Antibiotics - 500mg', time: '10:30 AM' },
                    { patient: 'Robert Chen', medication: 'Pain Management - 250mg', time: '11:00 AM' },
                    { patient: 'Thomas Wilson', medication: 'IV Fluids', time: '11:30 AM' },
                    { patient: 'Olivia Martin', medication: 'Anti-inflammatory - 200mg', time: '12:00 PM' }
                  ].map((med, index) => (
                    <div key={index} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md">
                      <div className="bg-role-nurse/10 p-2 rounded-full mt-1">
                        <Pill className="h-4 w-4 text-role-nurse" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div className="font-medium">{med.patient}</div>
                          <div className="text-xs bg-gray-100 px-2 py-1 rounded">{med.time}</div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{med.medication}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in animation-delay-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Shift Summary</CardTitle>
                <CardDescription>Today's activities and handover notes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Patients Attended</div>
                    <div className="font-bold">12</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Medications Administered</div>
                    <div className="font-bold">28</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Vitals Recorded</div>
                    <div className="font-bold">36</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Notes Updated</div>
                    <div className="font-bold">15</div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="font-medium mb-2">Handover Notes</div>
                    <div className="text-sm text-gray-600">
                      <p>Room 315B: Patient experiencing increased pain, doctor notified.</p>
                      <p className="mt-2">Room 307A: New medication started, monitor for side effects.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Patient Dashboard */}
        {user.role === 'patient' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="animate-fade-in">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Upcoming Appointments</CardTitle>
                <CardDescription>Scheduled doctor visits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { doctor: 'Dr. Jennifer Smith', specialty: 'Cardiology', date: 'Tomorrow', time: '10:30 AM' },
                    { doctor: 'Dr. Michael Johnson', specialty: 'General Checkup', date: 'Nov 15', time: '2:00 PM' }
                  ].map((appointment, index) => (
                    <div key={index} className="p-3 border rounded-md">
                      <div className="flex justify-between">
                        <div className="font-medium">{appointment.doctor}</div>
                        <div className="text-sm text-hospital-600">{appointment.date}</div>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{appointment.specialty}</div>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {appointment.time}
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <Button variant="outline" size="sm" className="text-xs">Reschedule</Button>
                        <Button variant="outline" size="sm" className="text-xs text-red-500 hover:text-red-600">Cancel</Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button className="w-full mt-2 bg-hospital-500 hover:bg-hospital-600">
                    Schedule New Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in animation-delay-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Current Medications</CardTitle>
                <CardDescription>Your prescribed medications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', refill: '10 days left' },
                    { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', refill: '15 days left' },
                    { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', refill: '5 days left' }
                  ].map((med, index) => (
                    <div key={index} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md">
                      <div className="bg-role-patient/10 p-2 rounded-full mt-1">
                        <Pill className="h-4 w-4 text-role-patient" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div className="font-medium">{med.name}</div>
                          <div className="text-xs bg-gray-100 px-2 py-1 rounded">{med.dosage}</div>
                        </div>
                        <div className="flex justify-between mt-1">
                          <div className="text-sm text-gray-600">{med.frequency}</div>
                          <div className="text-xs text-orange-500">{med.refill}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full mt-2">
                    Request Refill
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in animation-delay-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Recent Test Results</CardTitle>
                <CardDescription>Latest lab reports and diagnostics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: 'Blood Work', date: 'Oct 28', status: 'Completed' },
                    { type: 'Cholesterol Panel', date: 'Oct 28', status: 'Completed' },
                    { type: 'ECG', date: 'Oct 15', status: 'Completed' }
                  ].map((test, index) => (
                    <div key={index} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md">
                      <div className="bg-role-patient/10 p-2 rounded-full mt-1">
                        <FileText className="h-4 w-4 text-role-patient" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div className="font-medium">{test.type}</div>
                          <div className="text-xs text-gray-500">{test.date}</div>
                        </div>
                        <div className="mt-1 flex items-center">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100" variant="outline">
                            {test.status}
                          </Badge>
                          <Button variant="link" className="text-xs p-0 h-auto ml-2">
                            View Report
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4 mt-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Upcoming Tests</div>
                      <div className="text-xs text-hospital-600">View All</div>
                    </div>
                    
                    <div className="mt-2 p-2 bg-gray-50 rounded-md">
                      <div className="font-medium">Annual Physical</div>
                      <div className="text-sm text-gray-500">Scheduled for Nov 20</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
