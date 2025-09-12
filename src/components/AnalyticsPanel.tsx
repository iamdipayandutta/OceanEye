import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp,
  Users,
  Trophy,
  MapPin,
  Clock,
  Download,
  Eye,
  CheckCircle
} from "lucide-react";

const AnalyticsPanel = () => {
  const trendingHazards = [
    { type: "High Waves", count: 75, change: "+12%", color: "text-destructive" },
    { type: "Flooding", count: 60, change: "+8%", color: "text-orange-500" },
    { type: "Marine Debris", count: 35, change: "-5%", color: "text-yellow-500" },
    { type: "Cyclone", count: 20, change: "+15%", color: "text-purple-500" },
  ];

  const regionalData = [
    { region: "Tamil Nadu", count: 45, percentage: 35 },
    { region: "Kerala", count: 32, percentage: 25 },
    { region: "Karnataka", count: 28, percentage: 22 },
    { region: "Andhra Pradesh", count: 23, percentage: 18 },
  ];

  const topContributors = [
    { name: "Coastal Station Alpha", reports: 127, verified: 98, score: "A+" },
    { name: "Dr. Marine Singh", reports: 89, verified: 85, score: "A" },
    { name: "Fisher Community Net", reports: 76, verified: 62, score: "B+" },
    { name: "Coast Guard Patrol", reports: 54, verified: 54, score: "A+" },
  ];

  const timeData = [
    { period: "Last 24h", reports: 23, verified: 18 },
    { period: "Last 7d", reports: 156, verified: 134 },
    { period: "Last 30d", reports: 687, verified: 545 },
  ];

  return (
    <div className="space-y-6">
      {/* Trending Hazards */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <CardTitle>Trending Hazards</CardTitle>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>Last 24 hours activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trendingHazards.map((hazard, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium">{hazard.type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-16 bg-muted rounded-full">
                      <div 
                        className="h-2 bg-gradient-to-r from-accent to-primary rounded-full"
                        style={{ width: `${(hazard.count / 75) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{hazard.count}</span>
                  </div>
                  <Badge variant="outline" className={hazard.color}>
                    {hazard.change}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Tabs */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="h-5 w-5 mr-2" />
            Detailed Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="regional" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="regional">Regional</TabsTrigger>
              <TabsTrigger value="time">Time Trends</TabsTrigger>
              <TabsTrigger value="contributors">Contributors</TabsTrigger>
            </TabsList>
            
            <TabsContent value="regional" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Breakdown by coastal state</span>
                </div>
                {regionalData.map((region, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{region.region}</span>
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-20 bg-muted rounded-full">
                        <div 
                          className="h-2 gradient-ocean rounded-full"
                          style={{ width: `${region.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-8">{region.count}</span>
                      <span className="text-xs text-muted-foreground w-8">{region.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="time" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Hazard reports over time</span>
                </div>
                {timeData.map((period, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-sm font-medium">{period.period}</span>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{period.reports}</div>
                        <div className="text-xs text-muted-foreground">Reports</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-500">{period.verified}</div>
                        <div className="text-xs text-muted-foreground">Verified</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-accent">
                          {Math.round((period.verified / period.reports) * 100)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Rate</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="contributors" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Top reporting contributors</span>
                </div>
                {topContributors.map((contributor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                        ${index === 0 ? 'gradient-coral text-white' : 
                          index === 1 ? 'gradient-surface text-primary' : 
                          'bg-muted text-muted-foreground'}`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{contributor.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {contributor.reports} reports • {contributor.verified} verified
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={`${
                          contributor.score === 'A+' ? 'text-green-600 border-green-600' :
                          contributor.score === 'A' ? 'text-blue-600 border-blue-600' :
                          'text-yellow-600 border-yellow-600'
                        }`}
                      >
                        {contributor.score}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPanel;