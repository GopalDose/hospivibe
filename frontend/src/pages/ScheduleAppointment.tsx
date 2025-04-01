import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScheduleAppointmentForm from '@/components/ScheduleAppointmentForm';
import AppointmentsList from '@/components/AppointmentsList';
import NavBar from '@/components/NavBar';

const ScheduleAppointment: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('schedule');

  // Redirect if not a patient
  if (!user || user.role !== 'patient') {
    return (
      <div>
        <NavBar />
        <div className="container mx-auto py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-red-500">
                Access Denied: Only patients can schedule appointments
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="schedule">Schedule New Appointment</TabsTrigger>
                <TabsTrigger value="list">My Appointments</TabsTrigger>
              </TabsList>
              <TabsContent value="schedule">
                <ScheduleAppointmentForm onAppointmentScheduled={() => setActiveTab('list')} />
              </TabsContent>
              <TabsContent value="list">
                <AppointmentsList />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScheduleAppointment;