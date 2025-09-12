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
  ArrowLeft,
  Smartphone,
  Globe,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import Navigation from "./Navigation";

interface CitizenHazardReportProps {
  onNavigateBack?: () => void;
}

const CitizenHazardReport = ({ onNavigateBack }: CitizenHazardReportProps) => {
  const [selectedHazard, setSelectedHazard] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [severity, setSeverity] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hazardTypes = [
    { id: "flood", label: "Flooding", icon: Waves, color: "text-blue-500", description: "Coastal or inland flooding" },
    { id: "cyclone", label: "Cyclone/Storm", icon: Wind, color: "text-purple-500", description: "Strong winds and storms" },
    { id: "high-wave", label: "High Waves", icon: Mountain, color: "text-cyan-500", description: "Dangerous wave conditions" },
    { id: "tide", label: "Extreme Tide", icon: TrendingUp, color: "text-green-500", description: "Unusual tidal patterns" },
    { id: "debris", label: "Marine Debris", icon: Trash2, color: "text-orange-500", description: "Ocean pollution and waste" },
  ];

  const handleSubmitReport = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Handle report submission logic here
    console.log("Submitting report:", {
      hazard: selectedHazard,
      location,
      description,
      severity,
      anonymous: isAnonymous
    });
    
    // Show success message and reset form
    alert("Report submitted successfully! Thank you for helping keep our community safe.");
    
    // Reset form
    setSelectedHazard("");
    setLocation("");
    setDescription("");
    setSeverity("");
    setIsAnonymous(false);
    setIsSubmitting(false);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      }, (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get current location. Please enter manually.");
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const isFormValid = selectedHazard && location && severity && description;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-coral-50 to-orange-400/10">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onNavigateBack ? onNavigateBack() : window.history.back()}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="border-l h-6"></div>
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-2 text-accent" />
                  Report Ocean Hazard
                </h1>
                <p className="text-muted-foreground">Help protect your community by reporting ocean hazards</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Secure & Confidential</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Report Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-ocean border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Smartphone className="h-5 w-5 mr-2 text-accent" />
                    Hazard Report Form
                  </CardTitle>
                  <CardDescription>
                    Please provide detailed information about the ocean hazard you observed. 
                    Your report helps emergency management professionals respond effectively.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Hazard Type Selection */}
                  <div className="space-y-3">
                    <Label htmlFor="hazard-type" className="text-base font-semibold">
                      What type of hazard did you observe? *
                    </Label>
                    <Select value={selectedHazard} onValueChange={setSelectedHazard}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select the type of hazard you observed" />
                      </SelectTrigger>
                      <SelectContent>
                        {hazardTypes.map((hazard) => (
                          <SelectItem key={hazard.id} value={hazard.id} className="py-3">
                            <div className="flex items-center space-x-3">
                              <hazard.icon className={cn("h-5 w-5", hazard.color)} />
                              <div>
                                <div className="font-medium">{hazard.label}</div>
                                <div className="text-sm text-muted-foreground">{hazard.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location */}
                  <div className="space-y-3">
                    <Label htmlFor="location" className="text-base font-semibold">
                      Where did you observe this hazard? *
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        id="location"
                        placeholder="Enter specific location, address, or coordinates"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="flex-1 h-12"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={getCurrentLocation}
                        className="h-12 px-4"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Use GPS
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Be as specific as possible. Include landmarks, street names, or GPS coordinates.
                    </p>
                  </div>

                  {/* Severity Level */}
                  <div className="space-y-3">
                    <Label htmlFor="severity" className="text-base font-semibold">
                      How severe is this hazard? *
                    </Label>
                    <Select value={severity} onValueChange={setSeverity}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Assess the severity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low" className="py-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div>
                              <div className="font-medium">Low Severity</div>
                              <div className="text-sm text-muted-foreground">Minor concern, no immediate danger</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="medium" className="py-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                            <div>
                              <div className="font-medium">Medium Severity</div>
                              <div className="text-sm text-muted-foreground">Significant risk, requires attention</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="high" className="py-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div>
                              <div className="font-medium">High Severity</div>
                              <div className="text-sm text-muted-foreground">Immediate threat, urgent response needed</div>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-base font-semibold">
                      Describe what you observed *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Please provide detailed information:
• What exactly did you see?
• When did it happen?
• Current conditions?
• Any impacts observed?
• Number of people affected?"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={6}
                      className="resize-none"
                    />
                    <p className="text-sm text-muted-foreground">
                      Minimum 20 characters. The more detail you provide, the better emergency responders can assess the situation.
                    </p>
                  </div>

                  {/* Media Upload */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Add Photos or Videos (Optional)</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button variant="outline" className="h-24 flex-col space-y-2 border-dashed">
                        <Camera className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm font-medium">Take Photo</span>
                        <span className="text-xs text-muted-foreground">Camera</span>
                      </Button>
                      <Button variant="outline" className="h-24 flex-col space-y-2 border-dashed">
                        <Video className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm font-medium">Record Video</span>
                        <span className="text-xs text-muted-foreground">Max 30 seconds</span>
                      </Button>
                    </div>
                  </div>

                  {/* Privacy Option */}
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="anonymous" className="text-sm font-medium cursor-pointer">
                          Submit report anonymously
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Your personal information will not be shared with your report
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="anonymous"
                      checked={isAnonymous}
                      onCheckedChange={setIsAnonymous}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      onClick={handleSubmitReport}
                      disabled={!isFormValid || isSubmitting}
                      className="w-full h-12 text-base gradient-coral text-white shadow-ocean hover-scale"
                    >
                      {isSubmitting ? (
                        <>
                          <Activity className="h-4 w-4 mr-2 animate-spin" />
                          Submitting Report...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Hazard Report
                        </>
                      )}
                    </Button>
                    {!isFormValid && (
                      <p className="text-sm text-muted-foreground text-center mt-2">
                        Please fill in all required fields to submit your report
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Emergency Notice */}
              <Card className="border-red-200 bg-red-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-red-600 flex items-center text-lg">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Emergency?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-700 mb-3">
                    If this is a life-threatening emergency, call emergency services immediately.
                  </p>
                  <Button variant="destructive" className="w-full">
                    <Bell className="h-4 w-4 mr-2" />
                    Call Emergency Services
                  </Button>
                </CardContent>
              </Card>

              {/* Reporting Guidelines */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <FileText className="h-5 w-5 mr-2 text-accent" />
                    Reporting Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Be specific about location and time</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Include photos or videos if safe to do so</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Describe current conditions and impacts</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Report immediately for urgent situations</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Globe className="h-5 w-5 mr-2 text-accent" />
                    Need Help?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-medium">INCOIS Emergency Line</div>
                      <div className="text-muted-foreground">+91-40-2378-5000</div>
                    </div>
                    <div>
                      <div className="font-medium">Email Support</div>
                      <div className="text-muted-foreground">oceaneye@incois.gov.in</div>
                    </div>
                    <div>
                      <div className="font-medium">Report Status</div>
                      <div className="text-muted-foreground">Check your dashboard for updates</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenHazardReport;