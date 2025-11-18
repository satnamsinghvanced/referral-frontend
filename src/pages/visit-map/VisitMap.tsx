import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

// --- Utility Functions (Kept as is for context) ---

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
  if (typeof window === "undefined") return [];
  const params = new URLSearchParams(window.location.search);
  const coordsString = params.get("coordinates");
  if (!coordsString) {
    return [
      [76.6971535, 30.691342],
      [76.6939939, 30.7115894],
      [76.6857059, 30.7094125],
    ];
  }
  return coordsString
    .split(";")
    .map((pair) => {
      const [lng, lat] = pair.split(",").map(Number);
      return [lng, lat];
    })
    .filter((c) => c.length === 2 && !isNaN(c[0]) && !isNaN(c[1]));
};

// --- Component Start ---

export default function VisitMap() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [routeSummary, setRouteSummary] = useState<any>(null);
  const [directionsList, setDirectionsList] = useState<any[]>([]);
  const [coordinates, setCoordinates] = useState<any[]>([]);
  const [startLabel, setStartLabel] = useState("Start Point");
  const [isLoading, setIsLoading] = useState(true);

  const [trafficOn, setTrafficOn] = useState(true);

  const movingMarkerRef = useRef<any>(null);
  const routeCoordsRef = useRef<any[]>([]);
  const animIndexRef = useRef(0);

  // --- New Function to fetch and display the label for a single marker ---
  const fetchAndAddMarker = async (
    map: mapboxgl.Map,
    lng: number,
    lat: number,
    index: number
  ) => {
    let label = `Stop ${index + 1}`; // Default label
    
    // 1. Reverse Geocoding to get the location name
    try {
      const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&access_token=${mapboxgl.accessToken}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.features && json.features.length > 0) {
        label = json.features[0].properties.name || label;
      }
    } catch {
      // If geocoding fails, use the default label
    }

    // 2. Create the Popup content
    const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
      .setHTML(`<h3 class="font-bold text-base text-violet-700">${label}</h3>`);

    // 3. Create the Marker and attach the Popup
    new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map);
      
    // 4. For the first marker (index 0), set the main start label
    if (index === 0) {
        setStartLabel(label);
    }
  };
  // (Removed original fetchStartLabel as its logic is now merged here)
  
  useEffect(() => {
    const initialCoords = getCoordinatesFromUrl();
    setCoordinates(initialCoords);
    // Removed direct fetchStartLabel call
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
      zoom: 13,
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

      // --- Updated Marker Logic ---
      coordinates.forEach((coord, index) => {
        const [lng, lat] = coord;
        // Call the new async function to fetch the label and add the marker/popup
        fetchAndAddMarker(map, lng, lat, index);
      });
      // --- End Updated Marker Logic ---

      getRoute(map, coordinates);
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [coordinates]);
  
  // (animateCar and getRoute functions are omitted here for brevity, 
  // but they remain exactly the same as in your original code)
  
  // ... (animateCar and getRoute functions here)
  const animateCar = () => {
    const coords = routeCoordsRef.current;
    const marker = movingMarkerRef.current;
    if (!coords || coords.length === 0 || !marker) return;

    animIndexRef.current++;
    if (animIndexRef.current >= coords.length) animIndexRef.current = 0;

    marker.setLngLat(coords[animIndexRef.current]);
    requestAnimationFrame(animateCar);
  };

  const getRoute = async (map: mapboxgl.Map, coords: any[]) => {
    if (coords.length < 2 || !mapboxgl.accessToken) {
      setRouteSummary({
        distance: 0,
        duration: 0,
        error: "Route Error: Invalid Mapbox token.",
      });
      return;
    }

    const coordsQuery = coords.map((c) => c.join(",")).join(";");
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsQuery}?geometries=geojson&steps=true&access_token=${mapboxgl.accessToken}`;

    try {
      const response = await fetch(url);
      const json = await response.json();

      if (!json.routes || json.routes.length === 0) {
        setRouteSummary({ distance: 0, duration: 0, error: "No route found." });
        return;
      }

      const route = json.routes[0];
      const geojson = { type: "Feature", geometry: route.geometry };
      routeCoordsRef.current = route.geometry.coordinates;
      setDirectionsList(route.legs.flatMap((leg: any) => leg.steps));

      setRouteSummary({
        distance: route.distance,
        duration: route.duration,
        error: null,
      });

      if (map.getSource("route")) {
        (map.getSource("route") as any).setData(geojson);
      } else {
        map.addSource("route", { type: "geojson", data: geojson });

        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": "#4C1D95",
            "line-width": 6,
            "line-opacity": 0.85,
          },
        });
      }

      if (route.bbox) {
        const bounds = [
          [route.bbox[0], route.bbox[1]],
          [route.bbox[2], route.bbox[3]],
        ];
        // map.fitBounds(bounds, { padding: 50, duration: 1000 }); // Optional: fit map to route bounds
      }
    } catch {
      setRouteSummary({
        distance: 0,
        duration: 0,
        error: "Network error fetching route.",
      });
    }
  };
  // ... (rest of the component's JSX render)

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
          The URL must contain at least two lng,lat pairs separated by
          semicolons.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      {routeSummary && (
        <div className="absolute top-8 left-8 bg-white shadow-lg rounded-xl p-4 z-20 w-64">
          <h2 className="text-lg font-semibold mb-2">{startLabel}</h2>
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
                {formatDuration(routeSummary.duration)}
              </span>
            </p>
            <p>
              <span className="text-gray-600">Stops: </span>
              <span className="font-bold">{coordinates.length}</span>
            </p>
            <p>
              <span className="text-gray-600">Avg Speed: </span>
              <span className="font-bold">
                {(
                  (routeSummary.distance / routeSummary.duration) *
                  2.23694
                ).toFixed(1)}{" "}
                mph
              </span>
            </p>
          </div>
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