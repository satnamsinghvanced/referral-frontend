type Coordinate = [number, number];

export interface MapboxAnnotation {
  distance: number[];
}

export interface MapboxAdmin {
  iso_3166_1_alpha3: string;
  iso_3166_1: string;
}

export interface MapboxLeg {
  via_waypoints: any[];
  annotation: MapboxAnnotation;
  admins: MapboxAdmin[];
  weight: number;
  duration: number;
  distance: number;
  steps: any[];
  summary: string;
}

export interface MapboxRoute {
  weight_name: string;
  weight: number;
  duration: number;
  distance: number;
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
