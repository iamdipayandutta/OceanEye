import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Camera,
  MapPin,
  AlertTriangle,
  Upload,
  Eye,
  Clock,
  Waves,
  Wind,
  Mountain,
  Trash2,
  CheckCircle,
  XCircle,
  Bell,
  Home,
  Plus,
  TrendingUp,
  Activity,
  FileText,
  Image,
  Video,
  Send,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import Navigation from "./Navigation";

interface CitizenDashboardProps {
  onNavigateToLanding: () => void;
}

const CitizenDashboard = ({ onNavigateToLanding }: CitizenDashboardProps) => {
  const myReports = [
    {
      id: 1,
      type: "High Waves",
      location: "Marina Beach, Chennai",
      severity: "high",
      status: "verified",
      time: "2 days ago",
      description: "Unusually high waves observed during evening"
    },
    {
      id: 2,
      type: "Marine Debris",
      location: "Kovalam Beach, Kerala",
      severity: "medium",
      status: "pending",
      time: "1 week ago",
      description: "Large amount of plastic waste washed ashore"
    },
    {
      id: 3,
      type: "Flooding",
      location: "Kochi Backwaters",
      severity: "low",
      status: "verified",
      time: "2 weeks ago",
      description: "Minor flooding in low-lying areas"
    }
  ];

  const nearbyAlerts = [
    {
      id: 1,
      type: "Cyclone Warning",
      location: "East Coast - Tamil Nadu",
      severity: "high",
      time: "1 hour ago",
      description: "Cyclone approaching, strong winds expected"
    },
    {
      id: 2,
      type: "High Wave Alert",
      location: "Goa Coast",
      severity: "medium",
      time: "6 hours ago",
      description: "Wave heights exceeding 3 meters"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-orange-500 text-white";
      case "low": return "bg-yellow-500 text-black";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending": return <Clock className="h-4 w-4 text-orange-500" />;
      case "rejected": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Dashboard Header */}
      <div className="border-b bg-gradient-to-r from-ocean-50 to-aqua-400/10">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onNavigateToLanding}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <div className="border-l h-6"></div>
              <div>
                <h1 className="text-2xl font-bold">Citizen Dashboard</h1>
                <p className="text-muted-foreground">Report hazards and stay informed about ocean safety</p>
              </div>
            </div>
            <Button 
              onClick={() => window.location.href = '/citizenhazardreport'}
              className="gradient-coral text-white shadow-ocean hover-scale"
            >
              <Plus className="h-4 w-4 mr-2" />
              Report Hazard
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full gradient-ocean">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-primary">3</div>
              <div className="text-sm text-muted-foreground">My Reports</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full gradient-surface">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-accent">2</div>
              <div className="text-sm text-muted-foreground">Active Alerts</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full gradient-coral">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-500">2</div>
              <div className="text-sm text-muted-foreground">Verified</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-yellow-500">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-orange-500">15</div>
              <div className="text-sm text-muted-foreground">Points Earned</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Reports */}
          <div>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  My Reports
                </CardTitle>
                <CardDescription>Track the status of your submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myReports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{report.type}</span>
                        <Badge className={getSeverityColor(report.severity)}>
                          {report.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{report.location}</p>
                      <p className="text-xs text-muted-foreground">{report.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{report.time}</span>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(report.status)}
                          <span className="text-xs capitalize">{report.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Nearby Alerts */}
          <div>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-accent" />
                  Nearby Alerts
                </CardTitle>
                <CardDescription>Official warnings in your area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nearbyAlerts.map((alert) => (
                    <div key={alert.id} className="border-l-4 border-accent pl-4 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{alert.type}</span>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.location}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Safety Tips */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="h-5 w-5 mr-2 text-green-500" />
                  Ocean Safety Tips
                </CardTitle>
                <CardDescription>Stay safe around coastal areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                    <Waves className="h-6 w-6 text-blue-500 mt-1" />
                    <div>
                      <h4 className="font-medium text-sm mb-1">High Waves</h4>
                      <p className="text-xs text-muted-foreground">
                        Stay away from rocky areas and avoid swimming during rough weather
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                    <Wind className="h-6 w-6 text-purple-500 mt-1" />
                    <div>
                      <h4 className="font-medium text-sm mb-1">Storms</h4>
                      <p className="text-xs text-muted-foreground">
                        Monitor weather updates and follow evacuation orders if issued
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                    <AlertTriangle className="h-6 w-6 text-orange-500 mt-1" />
                    <div>
                      <h4 className="font-medium text-sm mb-1">Emergency</h4>
                      <p className="text-xs text-muted-foreground">
                        Call emergency services immediately for life-threatening situations
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;