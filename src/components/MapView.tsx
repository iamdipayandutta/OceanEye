import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  MapPin, 
  Layers, 
  Eye,
  Camera,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  Maximize2,
  MapIcon,
  Activity,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

// Fix for default markers in React Leaflet
const createCustomIcon = (severity: string) => {
  const color = severity === 'high' ? '#ef4444' : 
                severity === 'medium' ? '#f97316' : '#eab308';
  
  return L.divIcon({
    html: `<div class="custom-marker-${severity}"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    className: 'custom-marker-container',
  });
};

const HeatmapLayer = ({ reports }: { reports: any[] }) => {
  const map = useMap();
  
  useEffect(() => {
    // Simple heatmap effect using circle overlays
    const circles: L.Circle[] = [];
    
    reports.forEach(report => {
      const circle = L.circle([report.lat, report.lng], {
        color: report.severity === 'high' ? '#ef4444' : 
               report.severity === 'medium' ? '#f97316' : '#eab308',
        fillColor: report.severity === 'high' ? '#ef4444' : 
                   report.severity === 'medium' ? '#f97316' : '#eab308',
        fillOpacity: 0.1,
        radius: report.severity === 'high' ? 5000 : 
                report.severity === 'medium' ? 3000 : 2000,
        weight: 1,
      }).addTo(map);
      
      circles.push(circle);
    });

    return () => {
      circles.forEach(circle => map.removeLayer(circle));
    };
  }, [map, reports]);

  return null;
};

const MapControls = () => {
  const map = useMap();
  
  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();
  const handleReset = () => map.setView([15.2993, 74.1240], 6);
  
  return (
    <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm rounded-lg shadow-card z-[1000]">
      <div className="flex flex-col">
        <Button variant="ghost" size="sm" onClick={handleZoomIn} className="rounded-none rounded-t-lg">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleZoomOut} className="rounded-none border-t">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleReset} className="rounded-none rounded-b-lg border-t">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

interface MapViewProps {
  className?: string;
}

const MapView = ({ className }: MapViewProps) => {
  const [mapMode, setMapMode] = useState<"clusters" | "heatmap">("clusters");
  const [showLiveIndicator, setShowLiveIndicator] = useState(true);
  const [selectedReport, setSelectedReport] = useState<number | null>(null);

  const mockReports = [
    {
      id: 1,
      type: "High Wave",
      severity: "high",
      lat: 13.0827, // Chennai Coast
      lng: 80.2707,
      status: "verified",
      time: "2h ago",
      reporter: "Coastal Station Alpha",
      description: "Waves reaching 4-5 meters height observed",
      images: 3,
      hasVideo: true
    },
    {
      id: 2,
      type: "Flooding",
      severity: "medium", 
      lat: 9.9312, // Kochi
      lng: 76.2673,
      status: "pending",
      time: "4h ago",
      reporter: "Local Fisherman",
      description: "Water levels rising in fishing harbor area",
      images: 2,
      hasVideo: false
    },
    {
      id: 3,
      type: "Marine Debris",
      severity: "low",
      lat: 15.2993, // Goa
      lng: 74.1240,
      status: "verified",
      time: "6h ago", 
      reporter: "Coast Guard Patrol",
      description: "Large debris field spotted offshore",
      images: 4,
      hasVideo: true
    },
    {
      id: 4,
      type: "Cyclone",
      severity: "high",
      lat: 19.0760, // Mumbai Coast
      lng: 72.8777,
      status: "false",
      time: "8h ago",
      reporter: "Weather Station",
      description: "Strong winds and storm activity detected",
      images: 1,
      hasVideo: false
    },
    {
      id: 5,
      type: "Extreme Tide",
      severity: "medium",
      lat: 22.5726, // Kolkata
      lng: 88.3639,
      status: "verified",
      time: "1h ago",
      reporter: "Port Authority",
      description: "Unusually high tide levels observed",
      images: 2,
      hasVideo: false
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-destructive";
      case "medium": return "bg-orange-500";
      case "low": return "bg-yellow-500";
      default: return "bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified": return <CheckCircle className="h-3 w-3 text-green-500" />;
      case "pending": return <Clock className="h-3 w-3 text-orange-500" />;
      case "false": return <XCircle className="h-3 w-3 text-red-500" />;
      default: return <AlertTriangle className="h-3 w-3 text-muted-foreground" />;
    }
  };

  return (
    <Card className={cn("shadow-card", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <div>
              <CardTitle>Interactive Hazard Map</CardTitle>
              <CardDescription>Real-time ocean hazard visualization</CardDescription>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Live Indicator */}
            {showLiveIndicator && (
              <div className="flex items-center space-x-2 text-green-500">
                <Activity className="h-4 w-4 animate-pulse" />
                <span className="text-sm font-medium">Live Updating</span>
              </div>
            )}
            
            {/* Map Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Label htmlFor="map-mode" className="text-sm">Heatmap</Label>
              <Switch
                id="map-mode"
                checked={mapMode === "heatmap"}
                onCheckedChange={(checked) => setMapMode(checked ? "heatmap" : "clusters")}
              />
            </div>
            
            <Button variant="outline" size="sm">
              <Layers className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="h-[500px] relative">
          {/* Real Interactive Map */}
          <MapContainer
            center={[15.2993, 74.1240]} // Center on India's west coast
            zoom={6}
            style={{ height: '100%', width: '100%' }}
            className="rounded-b-lg"
            zoomControl={false} // We'll use custom controls
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Custom Map Controls */}
            <MapControls />
            
            {/* Heatmap Layer */}
            {mapMode === "heatmap" && <HeatmapLayer reports={mockReports} />}
            
            {/* Report Markers with Clustering */}
            {mapMode === "clusters" && (
              <MarkerClusterGroup
                chunkedLoading
                maxClusterRadius={50}
                showCoverageOnHover={false}
                iconCreateFunction={(cluster) => {
                  const count = cluster.getChildCount();
                  const markers = cluster.getAllChildMarkers();
                  
                  // Determine cluster severity based on highest severity in cluster
                  const hasHigh = markers.some((marker: any) => marker.options.severity === 'high');
                  const hasMedium = markers.some((marker: any) => marker.options.severity === 'medium');
                  
                  const severity = hasHigh ? 'high' : hasMedium ? 'medium' : 'low';
                  const color = severity === 'high' ? '#ef4444' : 
                                severity === 'medium' ? '#f97316' : '#eab308';
                  
                  return L.divIcon({
                    html: `<div style="background-color: ${color}; width: 40px; height: 40px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${count}</div>`,
                    className: 'custom-cluster-marker',
                    iconSize: [40, 40],
                  });
                }}
              >
                {mockReports.map((report) => (
                  <Marker
                    key={report.id}
                    position={[report.lat, report.lng]}
                    icon={createCustomIcon(report.severity)}
                    eventHandlers={{
                      click: () => setSelectedReport(selectedReport === report.id ? null : report.id),
                    }}
                    // @ts-ignore - Adding custom property for clustering
                    severity={report.severity}
                  >
                    <Popup>
                      <div className="p-2">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getSeverityColor(report.severity) + " text-white"}>
                            {report.severity.toUpperCase()}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(report.status)}
                            <span className="text-sm capitalize">{report.status}</span>
                          </div>
                        </div>
                        <h3 className="font-semibold">{report.type}</h3>
                        <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                        <div className="text-xs text-gray-500">
                          {report.time} • {report.reporter}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            )}
          </MapContainer>
          
          {/* Report Details Popup Overlay */}
          {selectedReport && (
            <div className="absolute top-4 left-4 w-80 z-[1000]">
              {(() => {
                const report = mockReports.find(r => r.id === selectedReport);
                if (!report) return null;
                
                return (
                  <Card className="shadow-ocean border-accent/20">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className={getSeverityColor(report.severity) + " text-white"}>
                            {report.severity.toUpperCase()}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(report.status)}
                            <span className="text-sm capitalize">{report.status}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedReport(null)}
                        >
                          ×
                        </Button>
                      </div>
                      <CardTitle className="text-lg">{report.type}</CardTitle>
                      <CardDescription>{report.time} • {report.reporter}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {report.description}
                      </p>
                      
                      {/* Media Preview */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Camera className="h-4 w-4" />
                          <span>{report.images} photos</span>
                        </div>
                        
                        {report.hasVideo && (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Play className="h-4 w-4" />
                            <span>Video available</span>
                          </div>
                        )}
                        
                        <Button variant="outline" size="sm">
                          <Maximize2 className="h-4 w-4 mr-1" />
                          View Media
                        </Button>
                      </div>
                      
                      {/* Verification Actions */}
                      {report.status === "pending" && (
                        <div className="flex space-x-2 pt-2">
                          <Button size="sm" className="gradient-ocean text-white flex-1">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Verify
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })()}
            </div>
          )}
          
          {/* Map Legend */}
          <div className="absolute bottom-4 right-4 bg-card/95 backdrop-blur-sm rounded-lg p-3 shadow-card z-[1000]">
            <h4 className="font-semibold text-sm mb-2">Severity Levels</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
                <span>High Risk</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span>Medium Risk</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Low Risk</span>
              </div>
            </div>
          </div>
          
          {/* Map Mode Indicator */}
          <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg p-2 shadow-card z-[1000]">
            <div className="flex items-center space-x-2 text-sm">
              <MapIcon className="h-4 w-4" />
              <span className="capitalize">{mapMode} View</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapView;