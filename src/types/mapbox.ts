type Coordinate = [number, number];

export interface MapboxAnnotation {
  distance: number[]; // Array of distances for each path segment
}

export interface MapboxAdmin {
  iso_3166_1_alpha3: string; // e.g., "USA"
  iso_3166_1: string; // e.g., "US"
}

export interface MapboxLeg {
  via_waypoints: any[];
  annotation: MapboxAnnotation;
  admins: MapboxAdmin[];
  weight: number;
  duration: number; // Duration in seconds
  distance: number; // Distance in meters
  steps: any[]; // Since steps=false, this will be empty
  summary: string;
}

export interface MapboxRoute {
  weight_name: string;
  weight: number;
  duration: number; // Total duration in seconds for the route
  distance: number; // Total distance in meters for the route
  legs: MapboxLeg[];
  geometry: {
    coordinates: Coordinate[];
    type: "LineString";
  };
  waypoints: any;
}

export interface MapboxWaypoint {
  distance: number;
  name: string;
  location: Coordinate;
}

export interface MapboxDirectionsResponse {
  routes: MapboxRoute[];
  waypoints: MapboxWaypoint[];
  code: "Ok" | string;
  uuid: string;
}

export interface DirectionsParams {
  coordinates: string;
}
