
import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import './Index.css';
import { 
  ArrowRight, 
  Check, 
  Clock, 
  CalendarClock, 
  ClipboardList, 
  BarChart3, 
  MessageSquare, 
  Star, 
  Zap, 
  ShieldCheck, 
  Users, 
  User,
  Sparkles,
  Heart,
  BadgeCheck,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <NavBar transparent />
      
      <main className="flex-grow">
        {/* Hero Section with enhanced aesthetics */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-hospital-100/80 via-white to-hospital-50/90 -z-10"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-hospital-200 rounded-full opacity-30 blur-3xl blur-circle"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-hospital-300 rounded-full opacity-30 blur-3xl blur-circle"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-1/3 right-[10%] w-20 h-20 bg-hospital-100 rounded-full opacity-20 blur-circle"></div>
          <div className="absolute bottom-1/4 left-[30%] w-16 h-16 bg-hospital-200 rounded-full opacity-20 blur-circle"></div>
          
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="animate-bounce">
                  <Logo size="lg" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text bg-gradient-to-r from-hospital-800 via-hospital-600 to-hospital-500 bg-clip-text text-transparent animate-fade-in">
                Modern Hospital Management
              </h1>
              <p className="text-xl text-gray-600 mb-8 animate-fade-in animation-delay-100 leading-relaxed">
                Streamline your healthcare operations with our intuitive and comprehensive hospital management system.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in animation-delay-200">
                <Link to="/signup">
                  <Button className="bg-hospital-600 hover:bg-hospital-700 button-effect button-glow text-lg py-6 px-8 transition-all duration-300 shadow-lg hover:shadow-hospital-400/50 rounded-xl">
                    Get Started
                    <ArrowRight className="ml-2 animate-pulse-subtle" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="button-effect text-lg py-6 px-8 border-2 border-hospital-400 hover:bg-hospital-50 hover:border-hospital-600 transition-all duration-300 rounded-xl">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Decorative floating elements */}
          <div className="absolute top-1/4 left-[10%] animate-float delay-100">
            <div className="w-10 h-10 rounded-full bg-hospital-200 opacity-60"></div>
          </div>
          <div className="absolute top-2/3 right-[15%] animate-float delay-300">
            <div className="w-6 h-6 rounded-full bg-hospital-300 opacity-70"></div>
          </div>
          <div className="absolute bottom-1/4 left-[20%] animate-float delay-500">
            <div className="w-8 h-8 rounded-full bg-hospital-400 opacity-50"></div>
          </div>
        </section>
        
        {/* Features Section with improved aesthetics */}
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-hospital-50/80 skew-x-12 -translate-x-20 transform origin-top-right"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-1 rounded-full text-hospital-600 font-medium text-sm bg-hospital-100 mb-4">
                Role-Based Design
              </div>
              <br></br>
              <h2 className="inline-block text-3xl md:text-4xl font-bold mb-4 relative">
                Designed for Everyone
                <span className="absolute -top-5 -right-5">
                  <Sparkles className="h-7 w-7 text-hospital-500 animate-pulse" />
                </span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Our system provides role-specific tools and interfaces for administrators, doctors, nurses, and patients.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 stagger-animation">
              {[
                {
                  title: 'Administrators',
                  description: 'Manage staff, departments, and overall hospital operations',
                  color: 'bg-role-admin/10 text-role-admin',
                  borderColor: 'border-role-admin/30',
                  icon: <Users className="h-8 w-8" />,
                  delay: 0
                },
                {
                  title: 'Doctors',
                  description: 'Access patient records, manage appointments, and track treatments',
                  color: 'bg-role-doctor/10 text-role-doctor',
                  borderColor: 'border-role-doctor/30',
                  icon: <ClipboardList className="h-8 w-8" />,
                  delay: 100
                },
                {
                  title: 'Nurses',
                  description: 'Monitor patient status, administer medication, and update records',
                  color: 'bg-role-nurse/10 text-role-nurse',
                  borderColor: 'border-role-nurse/30',
                  icon: <Heart className="h-8 w-8" />,
                  delay: 200
                },
                {
                  title: 'Patients',
                  description: 'Schedule appointments, view prescriptions, and access medical history',
                  color: 'bg-role-patient/10 text-role-patient',
                  borderColor: 'border-role-patient/30',
                  icon: <User className="h-8 w-8" />,
                  delay: 300
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className={`p-6 rounded-xl feature-card animate-fade-in border ${feature.borderColor} hover:shadow-lg transition-all duration-500 hover:border-hospital-400 group`}
                  style={{animationDelay: `${feature.delay}ms`}}
                >
                  <div className={`rounded-full w-16 h-16 flex items-center justify-center mb-6 ${feature.color} transition-all duration-300 group-hover:scale-110`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-hospital-700 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Key Features Section with animated cards */}
        <section className="py-24 bg-gradient-to-br from-hospital-50 to-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNCQkRCRkYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block bg-hospital-100 text-hospital-600 px-4 py-1 rounded-full text-sm font-semibold mb-3 animate-bounce">All-in-One Solution</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Everything you need to manage your healthcare facility efficiently
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-animation">
              {[
                {
                  icon: <Zap className="h-12 w-12" />,
                  title: "Fast & Efficient",
                  description: "Streamlined workflows that save time and reduce administrative burden",
                  color: "bg-blue-50 text-blue-600"
                },
                {
                  icon: <ShieldCheck className="h-12 w-12" />,
                  title: "Secure & Compliant",
                  description: "HIPAA-compliant security with role-based access controls",
                  color: "bg-green-50 text-green-600"
                },
                {
                  icon: <BarChart3 className="h-12 w-12" />,
                  title: "Insightful Analytics",
                  description: "Real-time dashboards and reports for data-driven decisions",
                  color: "bg-purple-50 text-purple-600"
                },
                {
                  icon: <CalendarClock className="h-12 w-12" />,
                  title: "Smart Scheduling",
                  description: "Intelligent appointment management with automated reminders",
                  color: "bg-orange-50 text-orange-600"
                },
                {
                  icon: <ClipboardList className="h-12 w-12" />,
                  title: "Digital Records",
                  description: "Comprehensive electronic health records management",
                  color: "bg-pink-50 text-pink-600"
                },
                {
                  icon: <Users className="h-12 w-12" />,
                  title: "Team Collaboration",
                  description: "Seamless communication between departments and staff",
                  color: "bg-indigo-50 text-indigo-600"
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-xl border hover:shadow-xl transition-all duration-500 backdrop-blur-sm bg-white/70 hover:bg-white/90 animate-fade-in feature-card transform hover:-translate-y-2"
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  <div className={`p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4 ${feature.color} transition-all duration-300 hover:scale-110`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section with animated steps */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-hospital-50 to-white"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block bg-hospital-100 text-hospital-600 px-4 py-1 rounded-full text-sm font-semibold mb-3 animate-fade-in">Simple Process</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Our simple process to transform your healthcare management
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {/* Connecting Line with animation */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-hospital-200 -translate-y-1/2 z-0">
                <div className="absolute top-0 left-0 h-full w-1/4 bg-hospital-500 animate-pulse-subtle"></div>
              </div>
              
              {[
                {
                  icon: <User className="h-8 w-8" />,
                  title: "Create Account",
                  description: "Sign up and select your role within the healthcare system"
                },
                {
                  icon: <Check className="h-8 w-8" />,
                  title: "Complete Profile",
                  description: "Fill in your details and customize your dashboard"
                },
                {
                  icon: <Clock className="h-8 w-8" />,
                  title: "Start Managing",
                  description: "Begin using the tools specific to your role"
                },
                {
                  icon: <BadgeCheck className="h-8 w-8" />,
                  title: "Track Progress",
                  description: "Monitor metrics and improve operations"
                }
              ].map((step, index) => (
                <div 
                  key={index}
                  className="relative z-10 flex flex-col items-center group"
                >
                  <div className="bg-white rounded-full p-4 border-4 border-hospital-500 mb-4 transition-all duration-300 group-hover:scale-110 shadow-md">
                    <div className="bg-hospital-100 text-hospital-700 rounded-full p-3 group-hover:bg-hospital-200 transition-all duration-300">
                      {step.icon}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-hospital-100 animate-fade-in group-hover:border-hospital-300 transition-all duration-300 transform group-hover:-translate-y-2 feature-card" 
                       style={{animationDelay: `${index * 200}ms`}}>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  <div className="absolute -top-2 -right-2 animate-pulse-subtle">
                    <div className="bg-hospital-600 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold text-lg shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section with enhanced styling */}
        <section className="py-24 bg-gradient-to-br from-hospital-50 to-hospital-100/80 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRkZGRkYiIGZpbGwtb3BhY2l0eT0iMC4yIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block bg-white text-hospital-600 px-4 py-1 rounded-full text-sm font-semibold mb-3 shadow-sm animate-fade-in">Success Stories</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Join thousands of healthcare professionals who trust HospiVibe
              </p>
            </div>
            
            <div className="max-w-6xl mx-auto">
              <Carousel className="w-full">
                <CarouselContent>
                  {[
                    {
                      quote: "HospiVibe has completely transformed how our hospital operates. The intuitive interface has made training new staff much easier.",
                      author: "Dr. Sarah Johnson",
                      role: "Chief Medical Officer",
                      rating: 5
                    },
                    {
                      quote: "As a nurse, I appreciate how the system streamlines our daily tasks. I can spend more time with patients and less time on paperwork.",
                      author: "Michael Chen",
                      role: "Head Nurse, Pediatrics",
                      rating: 5
                    },
                    {
                      quote: "The analytics dashboard helps me make data-driven decisions for our hospital. It's been invaluable for resource allocation.",
                      author: "Amanda Rodriguez",
                      role: "Hospital Administrator",
                      rating: 4
                    },
                    {
                      quote: "I love being able to schedule appointments and view my medical history online. Makes healthcare so much more accessible.",
                      author: "James Wilson",
                      role: "Patient",
                      rating: 5
                    }
                  ].map((testimonial, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                      <Card className="border-0 shadow-xl backdrop-blur-sm bg-white/80 hover:bg-white/95 transition-all duration-300 transform hover:-translate-y-2 feature-card">
                        <CardContent className="p-6">
                          <div className="flex gap-1 mb-4 animate-pulse-subtle">
                            {Array.from({ length: testimonial.rating }).map((_, i) => (
                              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                          <div className="flex items-center">
                            <div className="bg-hospital-200 rounded-full h-12 w-12 flex items-center justify-center text-hospital-700 font-bold">
                              {testimonial.author.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <p className="font-semibold">{testimonial.author}</p>
                              <p className="text-sm text-gray-500">{testimonial.role}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center gap-4 mt-8">
                  <CarouselPrevious className="relative transform-none bg-white/90 backdrop-blur-sm hover:bg-hospital-100 border border-hospital-200">
                    <ChevronLeft className="h-5 w-5 text-hospital-700" />
                  </CarouselPrevious>
                  <CarouselNext className="relative transform-none bg-white/90 backdrop-blur-sm hover:bg-hospital-100 border border-hospital-200">
                    <ChevronRight className="h-5 w-5 text-hospital-700" />
                  </CarouselNext>
                </div>
              </Carousel>
            </div>
          </div>
        </section>
        
        {/* CTA Section with enhanced design */}
        <section className="py-24 bg-gradient-to-br from-hospital-600 to-hospital-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRkZGRkYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-hospital-500 rounded-full mix-blend-overlay blur-3xl opacity-30 blur-circle"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-hospital-400 rounded-full mix-blend-overlay blur-3xl opacity-30 blur-circle"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in">Ready to Transform Your Healthcare Management?</h2>
              <p className="text-hospital-100 mb-8 text-lg animate-fade-in animation-delay-100">
                Join thousands of healthcare professionals who are already using HospiVibe to streamline their operations.
              </p>
              <Link to="/signup" className="animate-fade-in animation-delay-200 inline-block">
                <Button className="bg-white text-hospital-700 hover:bg-hospital-50 button-effect button-glow text-lg py-6 px-8 shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl">
                  Create Your Account
                  <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer with subtle animation */}
      <footer className="bg-gray-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRkZGRkYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 animate-fade-in">
              <Logo withText={true} />
              <p className="mt-2 text-gray-400">Modern hospital management system</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors transform hover:scale-105 hover-lift">About</Link>
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors transform hover:scale-105 hover-lift">Contact</Link>
              <a href="#" className="text-gray-300 hover:text-white transition-colors transform hover:scale-105 hover-lift">Privacy</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors transform hover:scale-105 hover-lift">Terms</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 animate-fade-in animation-delay-300">
            <p>&copy; {new Date().getFullYear()} HospiVibe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
