// Enhanced Map Features for OceanEye Platform
// Based on INCOIS requirements and missing functionality

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Layers, 
  Filter,
  Calendar,
  Search,
  Download,
  Share2,
  Bell,
  Satellite,
  Wind,
  Waves,
  Thermometer,
  Eye,
  EyeOff,
  RefreshCw,
  Fullscreen
} from "lucide-react";

// Enhanced Map Layer Management
export const MapLayerControl = () => {
  const [activeLayers, setActiveLayers] = useState({
    reports: true,
    heatmap: false,
    weather: false,
    tides: false,
    currents: false,
    satellite: false,
    administrative: false,
    bathymetry: false
  });

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Layers className="h-4 w-4 mr-2" />
          Map Layers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.entries(activeLayers).map(([layer, active]) => (
          <div key={layer} className="flex items-center justify-between">
            <Label className="capitalize">{layer.replace(/([A-Z])/g, ' $1')}</Label>
            <Switch
              checked={active}
              onCheckedChange={() => toggleLayer(layer as keyof typeof activeLayers)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Advanced Filtering System
export const AdvancedMapFilters = () => {
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    hazardTypes: [],
    severity: 'all',
    verificationStatus: 'all',
    source: 'all',
    radius: 50,
    confidence: 0.5
  });

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date Range */}
        <div className="space-y-2">
          <Label>Date Range</Label>
          <div className="flex space-x-2">
            <Input 
              type="date" 
              placeholder="Start Date"
              value={filters.dateRange.start}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, start: e.target.value }
              }))}
            />
            <Input 
              type="date" 
              placeholder="End Date"
              value={filters.dateRange.end}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, end: e.target.value }
              }))}
            />
          </div>
        </div>

        {/* Hazard Types */}
        <div className="space-y-2">
          <Label>Hazard Types</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select hazard types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tsunami">Tsunami</SelectItem>
              <SelectItem value="high-waves">High Waves</SelectItem>
              <SelectItem value="storm-surge">Storm Surge</SelectItem>
              <SelectItem value="coastal-flooding">Coastal Flooding</SelectItem>
              <SelectItem value="unusual-currents">Unusual Currents</SelectItem>
              <SelectItem value="marine-debris">Marine Debris</SelectItem>
              <SelectItem value="water-discoloration">Water Discoloration</SelectItem>
              <SelectItem value="unusual-marine-life">Unusual Marine Life</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Severity Level */}
        <div className="space-y-2">
          <Label>Severity Level</Label>
          <Select value={filters.severity} onValueChange={(value) => setFilters(prev => ({ ...prev, severity: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="low">Low Risk</SelectItem>
              <SelectItem value="medium">Medium Risk</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Verification Status */}
        <div className="space-y-2">
          <Label>Verification Status</Label>
          <Select value={filters.verificationStatus} onValueChange={(value) => setFilters(prev => ({ ...prev, verificationStatus: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="verified">Verified Only</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
              <SelectItem value="under-review">Under Review</SelectItem>
              <SelectItem value="disputed">Disputed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Radius */}
        <div className="space-y-2">
          <Label>Search Radius (km)</Label>
          <Input 
            type="number" 
            min="1" 
            max="500" 
            value={filters.radius}
            onChange={(e) => setFilters(prev => ({ ...prev, radius: parseInt(e.target.value) }))}
          />
        </div>

        <div className="flex space-x-2">
          <Button className="flex-1">Apply Filters</Button>
          <Button variant="outline" onClick={() => setFilters({
            dateRange: { start: '', end: '' },
            hazardTypes: [],
            severity: 'all',
            verificationStatus: 'all',
            source: 'all',
            radius: 50,
            confidence: 0.5
          })}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Real-time Data Integration
export const RealTimeDataPanel = () => {
  const [realTimeData, setRealTimeData] = useState({
    weatherAlerts: 3,
    tideWarnings: 1,
    newReports: 12,
    verifiedIncidents: 5
  });

  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Simulate real-time data updates
        setRealTimeData(prev => ({
          ...prev,
          newReports: prev.newReports + Math.floor(Math.random() * 3)
        }));
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  return (
    <Card className="w-72">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Real-time Data
          </div>
          <Switch 
            checked={autoRefresh}
            onCheckedChange={setAutoRefresh}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="flex items-center justify-center mb-1">
              <Waves className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{realTimeData.weatherAlerts}</div>
            <div className="text-xs text-blue-600">Weather Alerts</div>
          </div>
          
          <div className="text-center p-2 bg-orange-50 rounded">
            <div className="flex items-center justify-center mb-1">
              <Wind className="h-4 w-4 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{realTimeData.tideWarnings}</div>
            <div className="text-xs text-orange-600">Tide Warnings</div>
          </div>
          
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="flex items-center justify-center mb-1">
              <Bell className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{realTimeData.newReports}</div>
            <div className="text-xs text-green-600">New Reports</div>
          </div>
          
          <div className="text-center p-2 bg-purple-50 rounded">
            <div className="flex items-center justify-center mb-1">
              <Eye className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{realTimeData.verifiedIncidents}</div>
            <div className="text-xs text-purple-600">Verified</div>
          </div>
        </div>

        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            <Share2 className="h-4 w-4 mr-2" />
            Share View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Weather and Environmental Data Integration
export const WeatherDataOverlay = () => {
  const [weatherData, setWeatherData] = useState({
    windSpeed: 15,
    windDirection: 'SW',
    waveHeight: 2.1,
    tideLevel: 1.8,
    temperature: 28,
    visibility: 8.5
  });

  return (
    <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm">
          <Wind className="h-3 w-3 text-blue-500" />
          <span>Wind: {weatherData.windSpeed} km/h {weatherData.windDirection}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Waves className="h-3 w-3 text-blue-600" />
          <span>Waves: {weatherData.waveHeight}m</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Thermometer className="h-3 w-3 text-red-500" />
          <span>Temp: {weatherData.temperature}°C</span>
        </div>
      </div>
    </div>
  );
};

export default {
  MapLayerControl,
  AdvancedMapFilters,
  RealTimeDataPanel,
  WeatherDataOverlay
};
