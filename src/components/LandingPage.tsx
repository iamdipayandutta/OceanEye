import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Waves, 
  Users, 
  MessageSquare, 
  MapPin, 
  ArrowRight, 
  Eye, 
  Globe,
  Shield,
  Smartphone,
  BarChart3,
  LogIn
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";

interface LandingPageProps {
  onNavigateToDashboard: () => void;
  onNavigateToHazardReport?: () => void;
}

const LandingPage = ({ onNavigateToDashboard, onNavigateToHazardReport }: LandingPageProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleReportHazard = () => {
    console.log('Report Hazard button clicked!');
    // Try direct navigation first
    navigate('/citizenhazardreport');
  };

  const handleViewMaps = () => {
    console.log('View Hazard Maps button clicked!');
    // Navigate to the dedicated dashboard route
    navigate('/dashboard');
  };
  
  const features = [
    {
      icon: Users,
      title: "Citizen Reports",
      description: "Geotagged hazards with photos & descriptions from coastal communities worldwide.",
      color: "gradient-ocean"
    },
    {
      icon: MessageSquare,
      title: "Social Media Signals",
      description: "Live hazard-related posts & trends from Twitter, Instagram, and local platforms.",
      color: "gradient-surface"
    },
    {
      icon: MapPin,
      title: "Hotspot Detection",
      description: "AI-powered clustering & alerts to identify emerging ocean hazard patterns.",
      color: "gradient-coral"
    }
  ];

  const stats = [
    { label: "Active Reports", value: "12,847", icon: Eye },
    { label: "Monitoring Zones", value: "156", icon: Globe },
    { label: "Partner Agencies", value: "43", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg gradient-ocean">
              <Waves className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              OceanEye
            </span>
          </div>
          <div className="flex items-center space-x-3">
            {!isAuthenticated && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAuthModal(true)}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login / Sign Up
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-depth opacity-5 -z-10"></div>
        <div className="container px-4 py-24 md:py-32 relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 bg-accent/10 text-accent hover:bg-accent/20">
              Powered by INCOIS & Citizen Science
            </Badge>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              <span className="wave-animation inline-block">🌊</span>{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary-glow bg-clip-text text-transparent">
                OceanEye
              </span>
            </h1>
            
            <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto">
              See the ocean through citizen eyes — real-time hazard reporting & monitoring 
              for safer coastal communities worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-20">
              <button 
                className="px-6 py-3 text-lg bg-orange-500 text-white rounded-lg hover:bg-orange-600 cursor-pointer flex items-center gap-2"
                onClick={handleReportHazard}
                type="button"
              >
                <Smartphone className="h-5 w-5" />
                Report a Hazard
                <ArrowRight className="h-5 w-5" />
              </button>
              <button 
                className="px-6 py-3 text-lg border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white cursor-pointer flex items-center gap-2"
                onClick={handleViewMaps}
                type="button"
              >
                <BarChart3 className="h-5 w-5" />
                View Hazard Maps
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full gradient-surface">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Comprehensive Ocean Monitoring
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Combining citizen science, AI analysis, and real-time data to protect coastal communities 
              from ocean hazards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover-scale transition-smooth">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-6">
            Ready to Monitor Ocean Hazards?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Access real-time ocean hazard maps and contribute to community safety 
            through citizen reporting and professional monitoring tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={onNavigateToDashboard}
              className="gradient-ocean text-white shadow-ocean hover-scale"
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              View Hazard Maps
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => window.location.href = '/citizendashboard'}
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-smooth"
            >
              <Users className="mr-2 h-5 w-5" />
              Citizen Portal
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded gradient-ocean">
                  <Waves className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold">OceanEye</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Powered by Indian National Centre for Ocean Information Services (INCOIS)
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-smooth">Dashboard</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Mobile App</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">API Access</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-smooth">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Training</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>oceaneye@incois.gov.in</li>
                <li>+91-40-2378-5000</li>
                <li>Hyderabad, India</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 OceanEye - INCOIS. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
};

export default LandingPage;