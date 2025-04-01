import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, UserCheck, Users, Bell, Pill, FileText, Activity, BarChart4 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCheck, FileEdit } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const Dashboard = () => {
  const { user, isAuthenticated, onboardingComplete } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isAddPatientDialogOpen, setIsAddPatientDialogOpen] = useState(false);
  const [isPatientDialogOpen, setIsPatientDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [newPatient, setNewPatient] = useState({
    name: '',
    room: '',
    status: 'Stable',
    priority: 'Normal',
    notes: ''
  });
  const [monitoredPatients, setMonitoredPatients] = useState<any[]>([]);
  const [shiftStats, setShiftStats] = useState({
    totalPatients: 0,
    patientsAttending: 0,
    notesTaken: 0,
    medicationsAdministered: 0
  });
  const [shiftNotes, setShiftNotes] = useState<any[]>([]);
  
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
  
  useEffect(() => {
    if (user?.role === 'nurse') {
      fetchMonitoredPatients();
      fetchShiftStats();
    }
  }, [user]);
  
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

  const fetchMonitoredPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      console.log("Fetching patients with token:", token.substring(0, 10) + "...");

      const response = await fetch('http://127.0.0.1:5000/api/nurse/patients', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("Patient response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error('Failed to fetch patients');
      }
      
      const data = await response.json();
      console.log("Patients data:", data);
      setMonitoredPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Error",
        description: "Failed to fetch patients data",
        variant: "destructive"
      });
    }
  };

  const fetchShiftStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      console.log("Fetching shift stats with token:", token.substring(0, 10) + "...");

      const response = await fetch('http://127.0.0.1:5000/api/nurse/shift-stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("Shift stats response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error('Failed to fetch shift stats');
      }
      
      const data = await response.json();
      console.log("Shift stats data:", data);
      setShiftStats(data.stats);
      setShiftNotes(data.notes);
    } catch (error) {
      console.error('Error fetching shift stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch shift statistics",
        variant: "destructive"
      });
    }
  };

  const handlePatientClick = (patient: any) => {
    setSelectedPatient(patient);
    setIsPatientDialogOpen(true);
  };

  const handleAddPatient = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Validate form data
      if (!newPatient.name.trim()) {
        toast({
          title: "Error",
          description: "Patient name is required",
          variant: "destructive"
        });
        return;
      }

      if (!newPatient.room.trim()) {
        toast({
          title: "Error",
          description: "Room number is required",
          variant: "destructive"
        });
        return;
      }

      console.log("Sending patient data:", JSON.stringify(newPatient));

      const response = await fetch('http://127.0.0.1:5000/api/nurse/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPatient)
      });

      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.error || 'Failed to add patient');
      }

      const data = await response.json();
      console.log("Success response:", data);

      toast({
        title: "Success",
        description: "Patient added successfully"
      });

      setIsAddPatientDialogOpen(false);
      setNewPatient({
        name: '',
        room: '',
        status: 'Stable',
        priority: 'Normal',
        notes: ''
      });
      
      // Update the patients list with the new patient
      setMonitoredPatients(prev => [...prev, data]);
      
      // Refresh data
      fetchMonitoredPatients();
      fetchShiftStats();
    } catch (error) {
      console.error('Error adding patient:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add patient",
        variant: "destructive"
      });
    }
  };

  const handleUpdatePatient = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`http://127.0.0.1:5000/api/nurse/patients/${selectedPatient._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(selectedPatient)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error updating patient:", errorText);
        throw new Error('Failed to update patient');
      }

      toast({
        title: "Success",
        description: "Patient updated successfully"
      });

      setIsPatientDialogOpen(false);
      fetchMonitoredPatients();
      fetchShiftStats();
    } catch (error) {
      console.error('Error updating patient:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update patient",
        variant: "destructive"
      });
    }
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
                <DoctorAppointments />
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in animation-delay-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Patient Overview</CardTitle>
                <CardDescription>Your current patient statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <AppointmentStats />
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in animation-delay-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Recent Patient Notes</CardTitle>
                <CardDescription>Latest updates and records</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentPatientNotes />
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
                <div className="flex justify-end mb-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsAddPatientDialogOpen(true)}
                    className="gap-2"
                  >
                    <UserCheck className="h-4 w-4" />
                    Add Patient
                  </Button>
                </div>
                <div className="space-y-4">
                  {monitoredPatients.map((patient) => (
                    <div 
                      key={patient._id} 
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer border"
                      onClick={() => handlePatientClick(patient)}
                    >
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
                    <div className="text-sm font-medium">Total Patients</div>
                    <div className="font-bold">{shiftStats.totalPatients}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Patients Attending</div>
                    <div className="font-bold">{shiftStats.patientsAttending}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Notes Taken</div>
                    <div className="font-bold">{shiftStats.notesTaken}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Medications Administered</div>
                    <div className="font-bold">{shiftStats.medicationsAdministered}</div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="font-medium mb-2">Recent Notes</div>
                    <div className="space-y-2">
                      {shiftNotes.map((note, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          <div className="flex justify-between items-start">
                            <span className="font-medium">{note.patientName}</span>
                            <span className="text-xs text-gray-500">{note.time}</span>
                          </div>
                          <p className="mt-1">{note.content}</p>
                        </div>
                      ))}
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
                  <AppointmentsPreview />
                  
                  <Button 
                    className="w-full mt-2 bg-hospital-500 hover:bg-hospital-600"
                    onClick={() => navigate('/schedule-appointment')}
                  >
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

      {/* Add Patient Dialog */}
      <Dialog open={isAddPatientDialogOpen} onOpenChange={setIsAddPatientDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Patient Name</Label>
              <Input
                id="name"
                value={newPatient.name}
                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                placeholder="Enter patient name"
              />
            </div>
            <div>
              <Label htmlFor="room">Room Number</Label>
              <Input
                id="room"
                value={newPatient.room}
                onChange={(e) => setNewPatient({ ...newPatient, room: e.target.value })}
                placeholder="Enter room number"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={newPatient.status} onValueChange={(value) => setNewPatient({ ...newPatient, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Stable">Stable</SelectItem>
                  <SelectItem value="Needs Attention">Needs Attention</SelectItem>
                  <SelectItem value="Improving">Improving</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={newPatient.priority} onValueChange={(value) => setNewPatient({ ...newPatient, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPatientDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPatient}>
              Add Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Patient Details Dialog */}
      <Dialog open={isPatientDialogOpen} onOpenChange={setIsPatientDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Patient Name</Label>
                  <Input
                    id="edit-name"
                    value={selectedPatient.name}
                    onChange={(e) => setSelectedPatient({ ...selectedPatient, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-room">Room Number</Label>
                  <Input
                    id="edit-room"
                    value={selectedPatient.room}
                    onChange={(e) => setSelectedPatient({ ...selectedPatient, room: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select 
                    value={selectedPatient.status} 
                    onValueChange={(value) => setSelectedPatient({ ...selectedPatient, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Stable">Stable</SelectItem>
                      <SelectItem value="Needs Attention">Needs Attention</SelectItem>
                      <SelectItem value="Improving">Improving</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select 
                    value={selectedPatient.priority} 
                    onValueChange={(value) => setSelectedPatient({ ...selectedPatient, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Nurse Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter notes about the patient..."
                  value={selectedPatient.notes || ""}
                  onChange={(e) => setSelectedPatient({ ...selectedPatient, notes: e.target.value })}
                  className="h-32"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPatientDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePatient}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const AppointmentsPreview = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch('http://127.0.0.1:5000/api/appointments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const data = await response.json();
        
        // Sort appointments by date (most recent first)
        data.sort((a: any, b: any) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        
        // Take only the first 2 appointments
        setAppointments(data.slice(0, 2));
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load appointments",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [toast]);

  if (isLoading) {
    return <div className="text-center py-2">Loading appointments...</div>;
  }

  if (appointments.length === 0) {
    return <div className="text-center py-2 text-gray-500">No upcoming appointments</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      {appointments.map((appointment) => (
        <div key={appointment._id} className="p-3 border rounded-md">
          <div className="flex justify-between">
            <div className="font-medium">{appointment.doctor?.name || 'Doctor'}</div>
            <div className="text-sm text-hospital-600">
              {new Date(appointment.date).toLocaleDateString()}
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-1">{appointment.reason}</div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              {appointment.time}
            </div>
            <Badge className={getStatusColor(appointment.status)} variant="outline">
              {appointment.status || 'Unknown'}
            </Badge>
          </div>
          {appointment.status?.toLowerCase() === 'scheduled' && (
            <div className="mt-3 flex space-x-2">
              <Button variant="outline" size="sm" className="text-xs">Reschedule</Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs text-red-500 hover:text-red-600"
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                      throw new Error('Authentication token not found');
                    }

                    const response = await fetch(`http://127.0.0.1:5000/api/appointments/${appointment._id}`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify({ status: 'cancelled' })
                    });

                    if (!response.ok) {
                      throw new Error('Failed to cancel appointment');
                    }

                    toast({
                      title: "Success",
                      description: "Appointment cancelled successfully"
                    });
                    
                    // Refresh the page to show updated appointments
                    window.location.reload();
                  } catch (error) {
                    toast({
                      title: "Error",
                      description: "Failed to cancel appointment",
                      variant: "destructive"
                    });
                  }
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

const DoctorAppointments = () => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [doctorNotes, setDoctorNotes] = useState("");
  const [status, setStatus] = useState("");
  const [filterType, setFilterType] = useState<'today' | 'upcoming' | 'all'>('all');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch('http://127.0.0.1:5000/api/appointments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const data = await response.json();
        console.log("Fetched appointments:", data);
        
        // Store all appointments
        setAppointments(data);
        
        // Filter for all appointments by default
        filterAppointmentsByDate('all', data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load appointments",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [toast]);

  const filterAppointmentsByDate = (type: 'today' | 'upcoming' | 'all', data = appointments) => {
    setFilterType(type);
    
    // Format today's date as YYYY-MM-DD for comparison
    const today = new Date().toISOString().split('T')[0];
    console.log('Today is:', today);
    
    if (type === 'today') {
      // Only show appointments for today
      const todayAppointments = data.filter(appointment => {
        console.log('Comparing date:', appointment.date, 'to today:', today, 'Match?', appointment.date === today);
        return appointment.date === today;
      });
      
      setFilteredAppointments(todayAppointments);
    } 
    else if (type === 'upcoming') {
      // Show future appointments
      const upcomingAppointments = data.filter(appointment => {
        return appointment.date >= today;
      }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setFilteredAppointments(upcomingAppointments);
    }
    else {
      // Show all appointments sorted by date
      const sorted = [...data].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setFilteredAppointments(sorted);
    }
  };

  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setDoctorNotes(appointment.doctor_notes || "");
    setStatus(appointment.status || "scheduled");
    setIsDialogOpen(true);
  };

  const handleSaveNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`http://127.0.0.1:5000/api/appointments/${selectedAppointment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          status: status,
          doctor_notes: doctorNotes 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update appointment');
      }

      toast({
        title: "Success",
        description: "Appointment updated successfully"
      });
      
      // Update the appointment in the local state
      const updatedAppointment = {
        ...selectedAppointment,
        status: status,
        doctor_notes: doctorNotes
      };
      
      const updatedAppointments = appointments.map(apt => 
        apt._id === selectedAppointment._id ? updatedAppointment : apt
      );
      
      setAppointments(updatedAppointments);
      filterAppointmentsByDate(filterType, updatedAppointments);
      
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading appointments...</div>;
  }

  if (filteredAppointments.length === 0 && appointments.length === 0) {
    return <div className="text-center py-4">No appointments found</div>;
  }

  if (filteredAppointments.length === 0 && filterType === 'today') {
    return (
      <div className="text-center py-4">
        <div>No appointments scheduled for today</div>
        <Button 
          variant="link" 
          className="mt-2"
          onClick={() => filterAppointmentsByDate('all')}
        >
          View all appointments
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-medium">
          {filterType === 'today' ? "Today's appointments" : 
           filterType === 'upcoming' ? "Upcoming appointments" : 
           "All appointments"}
        </div>
        <div className="flex gap-2">
          <Select 
            value={filterType} 
            onValueChange={(value: 'today' | 'upcoming' | 'all') => filterAppointmentsByDate(value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="all">All appointments</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <div 
              key={appointment._id} 
              className="flex items-start justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer border"
              onClick={() => handleAppointmentClick(appointment)}
            >
              <div className="flex items-start space-x-3">
                <div className={`mt-1 h-2 w-2 rounded-full ${
                  appointment.status === 'completed' ? 'bg-green-500' :
                  appointment.status === 'in progress' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <div>
                  <div className="font-medium">{appointment.patient?.name || 'Patient'}</div>
                  <div className="text-xs text-gray-500 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" /> {appointment.time}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(appointment.date).toLocaleDateString()}
                  </div>
                  {appointment.reason && (
                    <div className="text-xs text-gray-500 mt-1 max-w-[200px] truncate">
                      {appointment.reason}
                    </div>
                  )}
                </div>
              </div>
              <Badge 
                className={getStatusColor(appointment.status)}
                variant="outline"
              >
                {appointment.status || 'Scheduled'}
              </Badge>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            No appointments found for the selected filter
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Patient</p>
                  <p className="font-medium">{selectedAppointment.patient?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-medium">
                    {new Date(selectedAppointment.date).toLocaleDateString()} at {selectedAppointment.time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reason</p>
                  <p className="font-medium">{selectedAppointment.reason}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="in progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Doctor's Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter notes about the patient..."
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  className="h-32"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNotes}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const AppointmentStats = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    appointmentsToday: 0,
    followUps: 0,
    labResults: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch('http://127.0.0.1:5000/api/appointments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const data = await response.json();
        
        // Calculate stats
        const today = new Date().toISOString().split('T')[0];
        const uniquePatients = new Set(data.map((apt: any) => apt.patient_id));
        const todaysAppointments = data.filter((apt: any) => apt.date === today);
        
        setStats({
          totalPatients: uniquePatients.size,
          appointmentsToday: todaysAppointments.length,
          followUps: data.filter((apt: any) => 
            apt.status === 'completed' && !apt.doctor_notes
          ).length,
          labResults: Math.floor(Math.random() * 10) // Mocked for now
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <div className="text-center py-4">Loading statistics...</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-sm text-gray-500 mb-1">Total Patients</div>
        <div className="text-2xl font-bold">{stats.totalPatients}</div>
        <div className="text-xs text-green-500 mt-1">+3 this week</div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-sm text-gray-500 mb-1">Today's Appointments</div>
        <div className="text-2xl font-bold">{stats.appointmentsToday}</div>
        <div className="text-xs text-gray-500 mt-1">Scheduled</div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-sm text-gray-500 mb-1">Follow-ups</div>
        <div className="text-2xl font-bold">{stats.followUps}</div>
        <div className="text-xs text-gray-500 mt-1">Pending</div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-sm text-gray-500 mb-1">Lab Results</div>
        <div className="text-2xl font-bold">{stats.labResults}</div>
        <div className="text-xs text-red-500 mt-1">Needs review</div>
      </div>
    </div>
  );
};

const RecentPatientNotes = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointmentsWithNotes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch('http://127.0.0.1:5000/api/appointments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const data = await response.json();
        
        // Filter appointments with doctor notes
        const appointmentsWithNotes = data
          .filter((apt: any) => apt.doctor_notes)
          .sort((a: any, b: any) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
          .slice(0, 3); // Get only the 3 most recent
        
        setAppointments(appointmentsWithNotes);
      } catch (error) {
        console.error("Error fetching appointments with notes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointmentsWithNotes();
  }, []);

  if (isLoading) {
    return <div className="text-center py-4">Loading patient notes...</div>;
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No patient notes found. Add notes during appointments.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment._id} className="p-3 border rounded-md hover:bg-gray-50">
          <div className="flex justify-between items-start">
            <div className="font-medium">{appointment.patient?.name}</div>
            <div className="text-xs text-gray-500">
              {new Date(appointment.created_at).toLocaleString(undefined, { 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
          <div className="mt-1 text-sm text-gray-600 line-clamp-2">{appointment.doctor_notes}</div>
          <div className="mt-2 flex items-center gap-2">
            <Badge 
              className={
                appointment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                'bg-blue-100 text-blue-800'
              } 
              variant="outline"
            >
              {appointment.status}
            </Badge>
            <div className="text-xs text-gray-500">{appointment.reason}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
