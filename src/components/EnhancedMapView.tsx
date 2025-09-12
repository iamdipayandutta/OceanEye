import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  MapPin, 
  Layers, 
  Filter,
  Search,
  Download,
  Share2,
  RefreshCw,
  Calendar,
  Thermometer,
  Wind,
  Waves,
  AlertTriangle,
  Eye,
  Settings,
  Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polyline } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import * as turf from '@turf/turf';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

// Enhanced data types
interface EnhancedReport {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  lat: number;
  lng: number;
  status: 'verified' | 'unverified' | 'under-review' | 'disputed';
  timestamp: Date;
  reporter: string;
  description: string;
  images: number;
  hasVideo: boolean;
  confidence: number;
  weatherConditions?: {
    windSpeed: number;
    waveHeight: number;
    temperature: number;
    visibility: number;
  };
  socialMediaMentions?: number;
  officialAlert?: boolean;
}

interface WeatherData {
  windSpeed: number;
  windDirection: string;
  waveHeight: number;
  tideLevel: number;
  temperature: number;
  visibility: number;
  timestamp: Date;
}

interface MapFilters {
  dateRange: { start: string; end: string };
  hazardTypes: string[];
  severity: string;
  verificationStatus: string;
  confidenceThreshold: number;
  radius: number;
  showWeatherData: boolean;
  showPredictive: boolean;
}

// Real-time data hook (simulated)
const useRealTimeData = () => {
  const [reports, setReports] = useState<EnhancedReport[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate WebSocket connection
    setIsConnected(true);
    
    // Mock initial data
    const mockReports: EnhancedReport[] = [
      {
        id: '1',
        type: 'High Wave',
        severity: 'high',
        lat: 13.0827,
        lng: 80.2707,
        status: 'verified',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        reporter: 'Coastal Station Alpha',
        description: 'Waves reaching 4-5 meters height observed',
        images: 3,
        hasVideo: true,
        confidence: 0.92,
        weatherConditions: {
          windSpeed: 25,
          waveHeight: 4.2,
          temperature: 28,
          visibility: 6.5
        },
        socialMediaMentions: 15,
        officialAlert: true
      },
      {
        id: '2',
        type: 'Storm Surge',
        severity: 'critical',
        lat: 17.6868,
        lng: 83.2185,
        status: 'verified',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        reporter: 'INCOIS Official',
        description: 'Critical storm surge warning - immediate evacuation recommended',
        images: 0,
        hasVideo: false,
        confidence: 0.98,
        weatherConditions: {
          windSpeed: 45,
          waveHeight: 6.8,
          temperature: 26,
          visibility: 3.2
        },
        socialMediaMentions: 42,
        officialAlert: true
      },
      {
        id: '3',
        type: 'Coastal Flooding',
        severity: 'medium',
        lat: 9.9312,
        lng: 76.2673,
        status: 'under-review',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        reporter: 'Citizen Reporter',
        description: 'Water levels rising in coastal areas',
        images: 2,
        hasVideo: true,
        confidence: 0.75,
        weatherConditions: {
          windSpeed: 18,
          waveHeight: 2.1,
          temperature: 29,
          visibility: 8.5
        },
        socialMediaMentions: 8,
        officialAlert: false
      }
    ];

    setReports(mockReports);
    
    // Mock weather data
    setWeatherData({
      windSpeed: 22,
      windDirection: 'SW',
      waveHeight: 2.8,
      tideLevel: 1.6,
      temperature: 28,
      visibility: 7.2,
      timestamp: new Date()
    });

    // Simulate periodic updates
    const interval = setInterval(() => {
      // Add random new report occasionally
      if (Math.random() > 0.9) {
        const newReport: EnhancedReport = {
          id: Date.now().toString(),
          type: ['High Wave', 'Coastal Flooding', 'Unusual Currents'][Math.floor(Math.random() * 3)],
          severity: (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)],
          lat: 12 + Math.random() * 8,
          lng: 75 + Math.random() * 10,
          status: 'unverified',
          timestamp: new Date(),
          reporter: 'Citizen Reporter',
          description: 'New hazard report',
          images: Math.floor(Math.random() * 4),
          hasVideo: Math.random() > 0.7,
          confidence: 0.3 + Math.random() * 0.5,
          socialMediaMentions: Math.floor(Math.random() * 20),
          officialAlert: false
        };
        
        setReports(prev => [newReport, ...prev]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return { reports, weatherData, isConnected };
};

// Hotspot detection using Turf.js
const detectHotspots = (reports: EnhancedReport[], radiusKm: number = 10) => {
  if (reports.length < 2) return [];

  const points = reports.map(report => 
    turf.point([report.lng, report.lat], { 
      id: report.id, 
      severity: report.severity,
      confidence: report.confidence 
    })
  );

  const clusters: any[] = [];
  const processed = new Set();

  points.forEach((point, index) => {
    if (processed.has(index)) return;

    const nearbyPoints = points.filter((otherPoint, otherIndex) => {
      if (index === otherIndex || processed.has(otherIndex)) return false;
      const distance = turf.distance(point, otherPoint, { units: 'kilometers' });
      return distance <= radiusKm;
    });

    if (nearbyPoints.length >= 1) { // Including the point itself
      const allPoints = [point, ...nearbyPoints];
      const centerPoint = turf.center(turf.featureCollection(allPoints));
      
      // Calculate cluster score based on severity and confidence
      const score = allPoints.reduce((sum, p) => {
        const severityWeight = { low: 1, medium: 2, high: 3, critical: 4 }[p.properties.severity] || 1;
        return sum + (severityWeight * p.properties.confidence);
      }, 0);

      clusters.push({
        center: centerPoint.geometry.coordinates,
        points: allPoints,
        score,
        radius: radiusKm * 1000 // Convert to meters for Leaflet
      });

      // Mark as processed
      allPoints.forEach(p => {
        const idx = points.findIndex(point => point.properties.id === p.properties.id);
        if (idx !== -1) processed.add(idx);
      });
    }
  });

  return clusters;
};

// Enhanced Map Component
interface EnhancedMapViewProps {
  className?: string;
}

const EnhancedMapView = ({ className }: EnhancedMapViewProps) => {
  const { reports, weatherData, isConnected } = useRealTimeData();
  const [filters, setFilters] = useState<MapFilters>({
    dateRange: { start: '', end: '' },
    hazardTypes: [],
    severity: 'all',
    verificationStatus: 'all',
    confidenceThreshold: 0.5,
    radius: 50,
    showWeatherData: true,
    showPredictive: false
  });
  
  const [mapMode, setMapMode] = useState<'clusters' | 'heatmap' | 'hotspots'>('clusters');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  // Filter reports based on current filters
  const filteredReports = reports.filter(report => {
    if (filters.severity !== 'all' && report.severity !== filters.severity) return false;
    if (filters.verificationStatus !== 'all' && report.status !== filters.verificationStatus) return false;
    if (report.confidence < filters.confidenceThreshold) return false;
    
    // Date range filter
    if (filters.dateRange.start) {
      const startDate = new Date(filters.dateRange.start);
      if (report.timestamp < startDate) return false;
    }
    if (filters.dateRange.end) {
      const endDate = new Date(filters.dateRange.end);
      if (report.timestamp > endDate) return false;
    }
    
    return true;
  });

  // Detect hotspots
  const hotspots = detectHotspots(filteredReports, filters.radius);

  const handleExportData = useCallback(() => {
    const dataToExport = {
      reports: filteredReports,
      weatherData,
      hotspots,
      exportTime: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oceaneye-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [filteredReports, weatherData, hotspots]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Enhanced Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Filters Card */}
        <Card className="lg:col-span-1">
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
              <div className="space-y-2">
                <Input 
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, start: e.target.value }
                  }))}
                />
                <Input 
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, end: e.target.value }
                  }))}
                />
              </div>
            </div>

            {/* Severity Filter */}
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

            {/* Confidence Threshold */}
            <div className="space-y-2">
              <Label>Confidence Threshold: {Math.round(filters.confidenceThreshold * 100)}%</Label>
              <Slider
                value={[filters.confidenceThreshold]}
                onValueChange={([value]) => setFilters(prev => ({ ...prev, confidenceThreshold: value }))}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Map Mode */}
            <div className="space-y-2">
              <Label>Visualization Mode</Label>
              <Select value={mapMode} onValueChange={(value: any) => setMapMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clusters">Cluster View</SelectItem>
                  <SelectItem value="heatmap">Heatmap View</SelectItem>
                  <SelectItem value="hotspots">Hotspot Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleExportData} size="sm" className="flex-1">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Map */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Enhanced Ocean Hazard Map
                {isConnected && (
                  <Badge variant="outline" className="ml-2 text-green-600 border-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-1 animate-pulse"></div>
                    Live
                  </Badge>
                )}
              </CardTitle>
              
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{filteredReports.length} Reports</Badge>
                <Badge variant="secondary">{hotspots.length} Hotspots</Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="h-[600px] relative">
              <MapContainer
                center={[15.2993, 74.1240]}
                zoom={6}
                style={{ height: '100%', width: '100%' }}
                className="rounded-b-lg"
                zoomControl={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Report Markers */}
                {mapMode === 'clusters' && (
                  <MarkerClusterGroup chunkedLoading>
                    {filteredReports.map((report) => (
                      <Marker
                        key={report.id}
                        position={[report.lat, report.lng]}
                        eventHandlers={{
                          click: () => setSelectedReport(report.id),
                        }}
                      >
                        <Popup>
                          <div className="p-2 max-w-xs">
                            <div className="flex items-center justify-between mb-2">
                              <Badge 
                                variant={report.severity === 'critical' ? 'destructive' : 'secondary'}
                                className={cn(
                                  report.severity === 'high' && 'bg-red-100 text-red-800',
                                  report.severity === 'medium' && 'bg-orange-100 text-orange-800',
                                  report.severity === 'low' && 'bg-yellow-100 text-yellow-800'
                                )}
                              >
                                {report.severity.toUpperCase()}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {report.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            
                            <h4 className="font-semibold text-sm mb-1">{report.type}</h4>
                            <p className="text-xs text-muted-foreground mb-2">{report.description}</p>
                            
                            <div className="flex items-center justify-between text-xs">
                              <span>Confidence: {Math.round(report.confidence * 100)}%</span>
                              {report.officialAlert && (
                                <Badge variant="destructive" className="text-xs">
                                  Official Alert
                                </Badge>
                              )}
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MarkerClusterGroup>
                )}

                {/* Hotspot Visualization */}
                {mapMode === 'hotspots' && hotspots.map((hotspot, index) => (
                  <Circle
                    key={index}
                    center={[hotspot.center[1], hotspot.center[0]]}
                    radius={hotspot.radius}
                    pathOptions={{
                      color: hotspot.score > 10 ? '#ef4444' : hotspot.score > 5 ? '#f97316' : '#eab308',
                      fillColor: hotspot.score > 10 ? '#ef4444' : hotspot.score > 5 ? '#f97316' : '#eab308',
                      fillOpacity: 0.2,
                      weight: 2,
                    }}
                  />
                ))}
              </MapContainer>

              {/* Weather Data Overlay */}
              {filters.showWeatherData && weatherData && (
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
              )}

              {/* Map Legend */}
              <div className="absolute bottom-4 right-4 bg-card/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
                <div className="space-y-2 text-xs">
                  <div className="font-semibold">Severity Levels</div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>Low Risk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span>Medium Risk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>High Risk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-800"></div>
                    <span>Critical</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedMapView;
