import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState, useCallback } from "react"; // Added useCallback for safety

// Assuming VITE_MAPBOX_API_KEY is correctly set in your environment
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

// --- UTILITY FUNCTIONS ---

const formatDistance = (distance: number) => {
  const km = distance / 1000;
  const miles = km * 0.621371;
  return miles.toFixed(1);
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const remainingSecondsAfterHours = seconds % 3600;
  const minutes = Math.floor(remainingSecondsAfterHours / 60);
  const remainingSeconds = Math.round(remainingSecondsAfterHours % 60);

  const parts = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }

  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }

  if (hours === 0 && minutes === 0) {
    parts.push(`${remainingSeconds}s`);
  } else if (remainingSeconds > 0) {
    parts.push(`${remainingSeconds}s`);
  }

  if (parts.length === 0) {
    return "0s";
  }

  return parts.join(" ");
};

const getCoordinatesFromUrl = () => {
  if (typeof window === "undefined")
    return { coordinates: [], optimized: true };
  const params = new URLSearchParams(window.location.search);
  const coordsString = params.get("coordinates");
  const optimizedString = params.get("optimized");

  // Default to optimized=true if not specified or not 'false'
  const optimized = optimizedString !== "false";

  if (!coordsString) {
    // Default coordinates (3 stops to test optimization)
    return {
      coordinates: [
        [76.6971535, 30.691342], // A: Start
        [76.75, 30.65], // B: Stop 1
        [76.65, 30.72], // C: Stop 2
        [76.70, 30.70], // D: Stop 3
      ],
      optimized,
    };
  }

  const coordinates = coordsString
    .split(";")
    .map((pair) => {
      const [lng, lat] = pair.split(",").map(Number);
      return [lng, lat];
    })
    .filter((c) => c.length === 2 && !isNaN(c[0]) && !isNaN(c[1]));

  return { coordinates, optimized };
};

// --- NEW NEAREST-NEIGHBOR LOGIC ---

// Helper function to calculate the Haversine distance between two coordinates
const haversineDistance = (
  [lng1, lat1]: number[],
  [lng2, lat2]: number[]
): number => {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distance in meters
};

// Function to sequence the stops using the Nearest Neighbor approach
const getOptimizedCoordinates = (initialCoords: number[][]): number[][] => {
  if (initialCoords.length < 2) {
    return initialCoords;
  }

  // The first point is always the fixed starting point
  const startPoint = initialCoords[0];
  let stops = initialCoords.slice(1);
  const optimizedOrder: number[][] = [startPoint];
  let currentPoint = startPoint;

  while (stops.length > 0) {
    let nearestIndex = -1;
    let minDistance = Infinity;

    // Find the nearest remaining stop
    for (let i = 0; i < stops.length; i++) {
      const distance = haversineDistance(currentPoint, stops[i]);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = i;
      }
    }

    if (nearestIndex !== -1) {
      // Add the nearest stop to the optimized order
      currentPoint = stops[nearestIndex];
      optimizedOrder.push(currentPoint);

      // Remove the stop from the list of remaining stops
      stops.splice(nearestIndex, 1);
    } else {
      // Safety break, should not happen
      break;
    }
  }
  
  // Return the newly ordered list of coordinates
  return optimizedOrder; 
};

// --- MAIN COMPONENT ---

export default function VisitMap() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [routeSummary, setRouteSummary] = useState<any>(null);
  const [directionsList, setDirectionsList] = useState<any[]>([]);
  // Store all coordinates
  const [coordinates, setCoordinates] = useState<any[]>([]);
  const [startLabel, setStartLabel] = useState("Start Point");
  const [isLoading, setIsLoading] = useState(true);
  const [isOptimized, setIsOptimized] = useState(true);

  // References for map components
  const startMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const destinationMarkerRef = useRef<mapboxgl.Marker | null>(null);

  const getRoute = useCallback(
    async (map: mapboxgl.Map, coords: any[], isOptimized: boolean) => {
      if (coords.length < 2 || !mapboxgl.accessToken) {
        setRouteSummary({
          distance: 0,
          duration: 0,
          error: "Route Error: Invalid Mapbox token or insufficient stops.",
        });
        return;
      }
      
      let routeCoords = coords;
      
      // --- APPLY NEAREST NEIGHBOR LOGIC HERE ---
      // Apply the nearest neighbor logic if optimization is requested AND there are 3+ stops
      if (isOptimized && coords.length > 2) {
        routeCoords = getOptimizedCoordinates(coords);
      } else {
        // If not optimizing, just use the original order
        routeCoords = coords;
      }
      
      // --- END NEAREST NEIGHBOR LOGIC ---

      const coordsQuery = routeCoords.map((c) => c.join(",")).join(";");

      // Profile is now 'driving'
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsQuery}?steps=true&geometries=geojson&alternatives=true&overview=full&access_token=${mapboxgl.accessToken}`;

      try {
        const response = await fetch(url);
        const json = await response.json();

        if (!json.routes || json.routes.length === 0) {
          setRouteSummary({ distance: 0, duration: 0, error: "No route found." });
          return;
        }

        const routes = json.routes;

        // Since we manually optimized the order (Nearest Neighbor), we assume the first route is the one we want.
        // We can still pick the fastest among the returned alternatives if desired, but for the manually optimized
        // route, we typically stick to the first result or the one matching the optimized coordinates.
        let primaryRoute = routes[0];
        
        // Find the fastest route among alternatives for comparison, but use the one generated by our order
        // unless Mapbox offers a slightly faster path with the same stops in the same order.
        let shortestRoute = routes.reduce(
          (best: any, current: any) =>
            current.duration < best.duration ? current : best,
          routes[0]
        );
        
        // Use the fastest route returned if it's the primary, otherwise use the first one from our optimized query
        primaryRoute = isOptimized ? shortestRoute : routes[0];

        // 1. Update UI state with the chosen primary route
        setDirectionsList(primaryRoute.legs.flatMap((leg: any) => leg.steps));
        setRouteSummary({
          distance: primaryRoute.distance,
          duration: primaryRoute.duration,
          error: null,
        });

        const primaryGeojson = {
          type: "Feature",
          geometry: primaryRoute.geometry,
        };
        const primaryRouteId = "route-primary";

        // 2. Draw Primary Route (Blue)
        if (map.getSource(primaryRouteId)) {
          (map.getSource(primaryRouteId) as any).setData(primaryGeojson);
        } else {
          map.addSource(primaryRouteId, {
            type: "geojson",
            data: primaryGeojson,
          });
          map.addLayer({
            id: primaryRouteId,
            type: "line",
            source: primaryRouteId,
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#0d53ff",
              "line-width": 6,
              "line-opacity": 0.85,
            },
          });
        }
        
        // Remove alternative route logic for simplicity, focusing on the primary calculated route
        const alternativeRouteId = "route-alternative";
        if (map.getLayer(alternativeRouteId)) {
          map.removeLayer(alternativeRouteId);
          map.removeSource(alternativeRouteId);
        }


        if (primaryRoute.bbox) {
          const bounds: [mapboxgl.LngLatLike, mapboxgl.LngLatLike] = [
            [primaryRoute.bbox[0], primaryRoute.bbox[1]],
            [primaryRoute.bbox[2], primaryRoute.bbox[3]],
          ];
          map.fitBounds(bounds, { padding: 50, duration: 1000 });
        }
      } catch (e) {
        console.error("Route fetching error:", e);
        setRouteSummary({
          distance: 0,
          duration: 0,
          error: "Network error fetching route.",
        });
      }
    },
    [] // Empty dependency array for stability
  );

  const fetchAndAddMarker = async (
    map: mapboxgl.Map,
    lng: number,
    lat: number,
    index: number,
    isDestination: boolean 
  ) => {
    let label = isDestination ? "Destination" : `Stop ${index + 1}`;

    // Reverse geocode to get a better label (unchanged)
    try {
      const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&access_token=${mapboxgl.accessToken}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.features && json.features.length > 0) {
        label = json.features[0].properties.name || label;
      }
    } catch {}

    const popup = new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
    }).setHTML(`<h3 class="font-medium text-sm text-gray-700">${label}</h3>`);

    // --- COLOR LOGIC FOR START (GREEN) VS STOPS (RED) ---
    const markerColor = index === 0 ? "#4ce05b" : "#f30";

    const newMarker = new mapboxgl.Marker({ color: markerColor })
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map);

    if (index === 0) {
      setStartLabel(label);
      startMarkerRef.current = newMarker;
    }

    // Only set the destination marker ref for the *last* coordinate
    if (isDestination) {
      destinationMarkerRef.current = newMarker;
    }
  };

  useEffect(() => {
    const { coordinates: initialCoords, optimized } = getCoordinatesFromUrl();

    if (initialCoords.length === 0) {
      // Fallback if URL is empty
      initialCoords.push([76.6971535, 30.691342], [76.6939939, 30.7115894]);
    } else if (initialCoords.length === 1) {
      // Ensure there is always a start AND a destination for the route
      initialCoords.push(initialCoords[0]);
    }

    setCoordinates(initialCoords);
    setIsOptimized(optimized);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (
      mapRef.current ||
      coordinates.length < 2 ||
      !mapboxgl.Map ||
      !mapboxgl.supported()
    )
      return;

    const center = coordinates[0];

    const map = new mapboxgl.Map({
      container: mapContainerRef.current as any,
      style: "mapbox://styles/mapbox/streets-v11",
      center,
      zoom: 14,
      pitch: 45,
    });

    mapRef.current = map;

    map.on("load", () => {
      map.addLayer({
        id: "3d-buildings",
        source: "composite",
        "source-layer": "building",
        filter: ["==", "extrude", "true"],
        type: "fill-extrusion",
        minzoom: 15,
        paint: {
          "fill-extrusion-color": "#aaa",
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-base": ["get", "min_height"],
          "fill-extrusion-opacity": 0.6,
        },
      });

      // **IMPORTANT**: Get the final ordered coordinates based on optimization setting
      let finalCoordsForMap = coordinates;
      if (isOptimized && coordinates.length > 2) {
          finalCoordsForMap = getOptimizedCoordinates(coordinates);
      }
      
      // Clear existing markers if map had been loaded before
      startMarkerRef.current?.remove();
      destinationMarkerRef.current?.remove();
      // NOTE: For a dynamic number of stops, you'd need a list of marker refs to clear them all.

      // Add markers for all points, based on the final order
      finalCoordsForMap.forEach((coord, index) => {
        const [lng, lat] = coord;
        const isDestination = index === finalCoordsForMap.length - 1;
        fetchAndAddMarker(map, lng, lat, index, isDestination);
      });

      // Calculate the route using the final, optimized/ordered coordinates
      getRoute(map, coordinates, isOptimized);
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [coordinates.length, isOptimized, getRoute]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        Loading coordinates...
      </div>
    );
  }

  if (coordinates.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-red-600">Invalid Coordinates</h2>
        <p className="text-sm text-red-500 mt-2 text-center">
          The map requires at least two coordinates (start and end).
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      {routeSummary && (
        <div className="absolute top-8 left-8 bg-white shadow-lg rounded-xl p-4 z-20 w-64">
          <h2 className="text-lg font-semibold mb-2">
            {isOptimized
              ? "Optimized Route (Nearest Neighbor)"
              : "Original Route (Default Order)"}
          </h2>
          {routeSummary.error ? (
            <p className="text-red-500 font-bold">{routeSummary.error}</p>
          ) : (
            <div className="text-sm">
              <p>
                <span className="text-gray-600"> Total Distance: </span>
                <span className="font-bold">
                  {formatDistance(routeSummary.distance)} mi
                </span>
              </p>
              <p>
                <span className="text-gray-600">Estimated Time: </span>
                <span className="font-bold">
                  {formatDuration(routeSummary.duration)} 🚗
                </span>
              </p>
              <p>
                <span className="text-gray-600">Start Point: </span>
                <span className="font-bold">{startLabel}</span>
              </p>
              <p className="mt-2 text-xs text-gray-400">
                Route sequencing is determined by the **Nearest Neighbor** heuristic.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="absolute top-8 right-8 bg-white shadow-xl p-4 w-80 max-h-[85vh] overflow-y-auto rounded-xl z-20">
        <h3 className="text-lg font-semibold mb-3">Turn-by-Turn Directions</h3>
        <div className="divide-y-1">
          {directionsList.map((step, i) => (
            <div key={i} className="py-3.5 first:pt-0 last:pb-0">
              <p className="text-sm font-medium">{step.maneuver.instruction}</p>
              <p className="text-xs text-gray-500">
                {(step.distance * 0.000621371).toFixed(2)} mi
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-grow relative rounded-xl overflow-hidden shadow-xl m-4">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
}