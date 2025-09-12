import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Settings,
  Users,
  FileText,
  Bell,
  BarChart3,
  UserPlus,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Upload,
  AlertTriangle,
  Trash2,
  Edit,
  Search,
  ArrowLeft
} from "lucide-react";
import Navigation from "./Navigation";

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel = ({ onBack }: AdminPanelProps) => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  const mockUsers = [
    { id: 1, name: "Dr. Sarah Chen", email: "sarah@oceaneye.gov", role: "analyst", status: "active", reports: 45, lastActive: "2h ago" },
    { id: 2, name: "Mumbai Coast Guard", email: "mumbai@coastguard.in", role: "admin", status: "active", reports: 123, lastActive: "30m ago" },
    { id: 3, name: "Local Fisher Network", email: "fishers@kerala.gov", role: "citizen", status: "active", reports: 28, lastActive: "1d ago" },
    { id: 4, name: "Weather Station Alpha", email: "weather@incois.gov", role: "analyst", status: "inactive", reports: 89, lastActive: "5d ago" },
  ];

  const mockReports = [
    { id: 1, type: "High Wave", location: "Chennai", severity: "high", status: "pending", reporter: "Coast Station", time: "2h ago" },
    { id: 2, type: "Flooding", location: "Kochi", severity: "medium", status: "verified", reporter: "Local Citizen", time: "4h ago" },
    { id: 3, type: "Debris", location: "Goa", severity: "low", status: "verified", reporter: "Tourist", time: "6h ago" },
    { id: 4, type: "Cyclone", location: "Vizag", severity: "high", status: "false", reporter: "Weather Bot", time: "8h ago" },
  ];

  const mockAlerts = [
    { id: 1, rule: "High Wave Cluster", condition: "5+ reports in 10km", status: "active", triggered: 3 },
    { id: 2, rule: "Flooding Emergency", condition: "3+ severe floods in 1h", status: "active", triggered: 0 },
    { id: 3, rule: "Cyclone Alert", condition: "Cyclone + 50+ social posts", status: "paused", triggered: 1 },
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin": return "gradient-coral text-white";
      case "analyst": return "gradient-surface text-primary";
      case "citizen": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-green-500 text-white";
      case "pending": return "bg-orange-500 text-white";
      case "false": return "bg-red-500 text-white";
      case "active": return "bg-green-500 text-white";
      case "inactive": return "bg-gray-500 text-white";
      case "paused": return "bg-yellow-500 text-black";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Admin Header */}
      <div className="border-b bg-muted/30">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="border-l h-6"></div>
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <Shield className="h-6 w-6 mr-2 text-accent" />
                  Admin Panel
                </h1>
                <p className="text-muted-foreground">System administration and management</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button size="sm" className="gradient-ocean text-white">
                <Upload className="h-4 w-4 mr-2" />
                Backup System
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Reports</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="shadow-card">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">2,847</div>
                  <div className="text-sm text-muted-foreground">Total Reports</div>
                  <div className="text-xs text-green-500 mt-1">+12% this week</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-accent mb-2">156</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                  <div className="text-xs text-green-500 mt-1">+8% this week</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">23</div>
                  <div className="text-sm text-muted-foreground">Pending Reviews</div>
                  <div className="text-xs text-red-500 mt-1">Needs attention</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-500 mb-2">89%</div>
                  <div className="text-sm text-muted-foreground">System Uptime</div>
                  <div className="text-xs text-green-500 mt-1">All systems normal</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Recent System Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium text-sm">Report verified by Dr. Chen</div>
                        <div className="text-xs text-muted-foreground">2 minutes ago</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                      <UserPlus className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium text-sm">New analyst registered</div>
                        <div className="text-xs text-muted-foreground">15 minutes ago</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      <div>
                        <div className="font-medium text-sm">Alert rule triggered</div>
                        <div className="text-xs text-muted-foreground">1 hour ago</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database Connection</span>
                      <Badge className="bg-green-500 text-white">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Response Time</span>
                      <Badge className="bg-green-500 text-white">125ms</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Social Media Feed</span>
                      <Badge className="bg-yellow-500 text-black">Delayed</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Map Services</span>
                      <Badge className="bg-green-500 text-white">Online</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search reports..." 
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="false">False Reports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="gradient-ocean text-white">
                <Download className="h-4 w-4 mr-2" />
                Export Reports
              </Button>
            </div>

            <Card className="shadow-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.type}</TableCell>
                      <TableCell>{report.location}</TableCell>
                      <TableCell>
                        <Badge className={
                          report.severity === 'high' ? 'bg-red-500 text-white' :
                          report.severity === 'medium' ? 'bg-orange-500 text-white' :
                          'bg-yellow-500 text-black'
                        }>
                          {report.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(report.status)}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.reporter}</TableCell>
                      <TableCell>{report.time}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search users..." 
                    className="pl-10 w-64"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                    <SelectItem value="citizen">Citizen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="gradient-ocean text-white">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>

            <Card className="shadow-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reports</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.reports}</TableCell>
                      <TableCell>{user.lastActive}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            {user.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Alert Rules Management</h3>
              <Button className="gradient-ocean text-white">
                <Bell className="h-4 w-4 mr-2" />
                Create Alert Rule
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Active Alert Rules</CardTitle>
                  <CardDescription>Automated monitoring and notification rules</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{alert.rule}</div>
                          <div className="text-xs text-muted-foreground">{alert.condition}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Triggered {alert.triggered} times today
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusBadgeColor(alert.status)}>
                            {alert.status}
                          </Badge>
                          <Switch checked={alert.status === 'active'} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Create Custom Alert</CardTitle>
                  <CardDescription>Set up new monitoring rules</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="alert-name">Alert Name</Label>
                    <Input id="alert-name" placeholder="e.g., Cyclone Emergency Alert" />
                  </div>
                  
                  <div>
                    <Label htmlFor="alert-condition">Trigger Condition</Label>
                    <Textarea 
                      id="alert-condition" 
                      placeholder="e.g., When cyclone reports > 5 in 20km radius within 1 hour"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="alert-recipients">Notification Recipients</Label>
                    <Input id="alert-recipients" placeholder="admin@oceaneye.gov, emergency@gov.in" />
                  </div>

                  <Button className="w-full gradient-ocean text-white">
                    Create Alert Rule
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>System Configuration</CardTitle>
                  <CardDescription>Core system settings and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-verify">Auto-verify trusted sources</Label>
                    <Switch id="auto-verify" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="social-monitoring">Enable social media monitoring</Label>
                    <Switch id="social-monitoring" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="public-access">Allow public map access</Label>
                    <Switch id="public-access" defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="backup-frequency">Backup Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Every Hour</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>API & Integration Settings</CardTitle>
                  <CardDescription>External service configurations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="map-provider">Map Provider</Label>
                    <Select defaultValue="leaflet">
                      <SelectTrigger>
                        <SelectValue placeholder="Select map provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="leaflet">OpenStreetMap (Leaflet)</SelectItem>
                        <SelectItem value="mapbox">Mapbox</SelectItem>
                        <SelectItem value="google">Google Maps</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weather-api">Weather API Integration</Label>
                    <div className="flex space-x-2">
                      <Input id="weather-api" placeholder="API Key" type="password" />
                      <Button variant="outline">Test</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sms-service">SMS Service Provider</Label>
                    <Select defaultValue="twilio">
                      <SelectTrigger>
                        <SelectValue placeholder="Select SMS provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twilio">Twilio</SelectItem>
                        <SelectItem value="aws">AWS SNS</SelectItem>
                        <SelectItem value="local">Local Gateway</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full gradient-ocean text-white">
                    Save Configuration
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;