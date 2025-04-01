import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Doctor {
  _id: string;
  name: string;
  email: string;
}

interface ScheduleAppointmentFormProps {
  onAppointmentScheduled: () => void;
}

const ScheduleAppointmentForm: React.FC<ScheduleAppointmentFormProps> = ({ onAppointmentScheduled }) => {
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    doctor_id: '',
    date: '',
    time: '',
    reason: ''
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication required');

        const response = await fetch('http://127.0.0.1:5000/api/users?role=doctor', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }

        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load doctors list",
          variant: "destructive"
        });
      }
    };

    fetchDoctors();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await fetch('http://127.0.0.1:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to schedule appointment');
      }

      toast({
        title: "Success",
        description: "Appointment scheduled successfully"
      });
      
      // Reset form
      setFormData({
        doctor_id: '',
        date: '',
        time: '',
        reason: ''
      });
      
      // Notify parent component
      onAppointmentScheduled();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="doctor">Doctor</Label>
        <Select onValueChange={handleSelectChange('doctor_id')} value={formData.doctor_id}>
          <SelectTrigger>
            <SelectValue placeholder="Select doctor" />
          </SelectTrigger>
          <SelectContent>
            {doctors.map((doctor) => (
              <SelectItem key={doctor._id} value={doctor._id}>
                {doctor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          min={new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      <div>
        <Label htmlFor="time">Time</Label>
        <Select onValueChange={handleSelectChange('time')} value={formData.time}>
          <SelectTrigger>
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="09:00">09:00 AM</SelectItem>
            <SelectItem value="10:30">10:30 AM</SelectItem>
            <SelectItem value="14:00">02:00 PM</SelectItem>
            <SelectItem value="15:45">03:45 PM</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="reason">Reason for Visit</Label>
        <Input
          type="text"
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleInputChange}
          placeholder="e.g., Annual checkup, persistent cough"
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Scheduling...' : 'Schedule Appointment'}
      </Button>
    </form>
  );
};

export default ScheduleAppointmentForm; 