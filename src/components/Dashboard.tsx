import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { 
  CalendarIcon,
  Filter,
  MapPin,
  AlertTriangle,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Waves,
  Wind,
  Zap,
  Mountain,
  Trash2,
  Settings2,
  BarChart3,
  ArrowLeft,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "./Navigation";
import MapView from "./MapView";
import AnalyticsPanel from "./AnalyticsPanel";

interface DashboardProps {
  onNavigateToLanding: () => void;
  onOpenAdmin?: () => void;
  onNavigateToHazardReport?: () => void;
}

const Dashboard = ({ onNavigateToLanding, onOpenAdmin, onNavigateToHazardReport }: DashboardProps) => {
  const { user, isAuthenticated } = useAuth();
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedHazard, setSelectedHazard] = useState<string>("all");
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);

  const hazardTypes = [
    { id: "all", label: "All Hazards", icon: AlertTriangle, color: "text-muted-foreground" },
    { id: "flood", label: "Flood", icon: Waves, color: "text-blue-500" },
    { id: "cyclone", label: "Cyclone", icon: Wind, color: "text-purple-500" },
    { id: "high-wave", label: "High Wave", icon: Mountain, color: "text-cyan-500" },
    { id: "tide", label: "Extreme Tide", icon: TrendingUp, color: "text-green-500" },
    { id: "debris", label: "Marine Debris", icon: Trash2, color: "text-orange-500" },
  ];

  const recentReports = [
    {
      id: 1,
      type: "High Wave",
      location: "Chennai Coast",
      severity: "high",
      verified: true,
      time: "2 hours ago",
      reporter: "Local Fisherman"
    },
    {
      id: 2,
      type: "Flood",
      location: "Kochi Backwaters",
      severity: "medium",
      verified: false,
      time: "4 hours ago",
      reporter: "Citizen User"
    },
    {
      id: 3,
      type: "Marine Debris",
      location: "Goa Beach",
      severity: "low",
      verified: true,
      time: "6 hours ago",
      reporter: "Coast Guard"
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-orange-500 text-white";
      case "low": return "bg-yellow-500 text-black";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onOpenAdmin={onOpenAdmin} />
      
      {/* Dashboard Header */}
      <div className="border-b bg-muted/30">
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
                Back to Landing
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-2xl font-bold">Ocean Hazard Maps</h1>
                <p className="text-muted-foreground">Real-time ocean hazard visualization and monitoring</p>
              </div>
            </div>
            {isAuthenticated ? (
              <Button variant="outline" size="sm">
                <Settings2 className="h-4 w-4 mr-2" />
                Configure Alerts
              </Button>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                className="gradient-ocean text-white"
                onClick={() => onNavigateToHazardReport && onNavigateToHazardReport()}
              >
                <FileText className="h-4 w-4 mr-2" />
                Report Hazard
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container py-6">
        {/* Top Section: Filters & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters & Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Date Range */}
                <div className="space-y-2">
                  <Label>Time Period</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "text-left font-normal",
                            !dateFrom && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="h-4 w-4" />
                          {dateFrom ? format(dateFrom, "MMM dd") : "From"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateFrom}
                          onSelect={setDateFrom}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "text-left font-normal",
                            !dateTo && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="h-4 w-4" />
                          {dateTo ? format(dateTo, "MMM dd") : "To"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateTo}
                          onSelect={setDateTo}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Hazard Type */}
                <div className="space-y-2">
                  <Label>Hazard Type</Label>
                  <Select value={selectedHazard} onValueChange={setSelectedHazard}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select hazard type" />
                    </SelectTrigger>
                    <SelectContent>
                      {hazardTypes.map((hazard) => (
                        <SelectItem key={hazard.id} value={hazard.id}>
                          <div className="flex items-center">
                            <hazard.icon className={cn("h-4 w-4 mr-2", hazard.color)} />
                            {hazard.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Verification Status */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="verified-only">Verified Only</Label>
                  <Switch
                    id="verified-only"
                    checked={verifiedOnly}
                    onCheckedChange={setVerifiedOnly}
                  />
                </div>

                <Button className="w-full gradient-ocean text-white">
                  Apply Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Map - Expanded */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              <MapView className="border-accent/20" />
              {/* Uncomment below to use enhanced map */}
              {/* <EnhancedMapView className="border-accent/20" /> */}
            </div>
          </div>
        </div>

        {/* Bottom Section: Analytics & Data */}
        <div className="space-y-6">
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-accent" />
              Real-time Metrics & Analytics
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Trending Hazards */}
              <div className="lg:col-span-1">
                <AnalyticsPanel />
              </div>

              {/* Recent Reports */}
              <div className="lg:col-span-1">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center text-base">
                      <Clock className="h-4 w-4 mr-2" />
                      Recent Reports
                    </CardTitle>
                    <CardDescription>Last 24 hours activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentReports.map((report) => (
                        <div key={report.id} className="flex items-start space-x-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex-shrink-0 mt-1">
                            <div className={cn("w-3 h-3 rounded-full", 
                              report.severity === 'high' ? 'bg-red-500' :
                              report.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'
                            )}></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm truncate">{report.type}</span>
                              {report.verified && (
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{report.location}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground">{report.time}</span>
                              <Badge className={cn("text-xs", getSeverityColor(report.severity))}>
                                {report.severity}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      <FileText className="h-4 w-4 mr-2" />
                      View All Reports
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;