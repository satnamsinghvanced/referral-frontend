import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

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

  const optimized = optimizedString !== "false";

  if (!coordsString) {
    return {
      coordinates: [
        [76.6971535, 30.691342],
        [76.6939939, 30.7115894],
        [76.6857059, 30.7094125],
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

export default function VisitMap() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [routeSummary, setRouteSummary] = useState<any>(null);
  const [directionsList, setDirectionsList] = useState<any[]>([]);
  const [coordinates, setCoordinates] = useState<any[]>([]);
  const [startLabel, setStartLabel] = useState("Start Point");
  const [isLoading, setIsLoading] = useState(true);

  const [isOptimized, setIsOptimized] = useState(true);

  const movingMarkerRef = useRef<any>(null);
  const routeCoordsRef = useRef<any[]>([]);
  const animIndexRef = useRef(0);

  const fetchAndAddMarker = async (
    map: mapboxgl.Map,
    lng: number,
    lat: number,
    index: number
  ) => {
    let label = `Stop ${index + 1}`;

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

    new mapboxgl.Marker().setLngLat([lng, lat]).setPopup(popup).addTo(map);

    if (index === 0) {
      setStartLabel(label);
    }
  };

  useEffect(() => {
    const { coordinates: initialCoords, optimized } = getCoordinatesFromUrl();
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

      coordinates.forEach((coord, index) => {
        const [lng, lat] = coord;
        fetchAndAddMarker(map, lng, lat, index);
      });

      getRoute(map, coordinates, isOptimized);
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [coordinates, isOptimized]);

  const animateCar = () => {
    const coords = routeCoordsRef.current;
    const marker = movingMarkerRef.current;
    if (!coords || coords.length === 0 || !marker) return;

    animIndexRef.current++;
    if (animIndexRef.current >= coords.length) animIndexRef.current = 0;

    marker.setLngLat(coords[animIndexRef.current]);
    requestAnimationFrame(animateCar);
  };

  const getRoute = async (
    map: mapboxgl.Map,
    coords: any[],
    isOptimized: boolean
  ) => {
    if (coords.length < 2 || !mapboxgl.accessToken) {
      setRouteSummary({
        distance: 0,
        duration: 0,
        error: "Route Error: Invalid Mapbox token.",
      });
      return;
    }

    const coordsQuery = coords.map((c) => c.join(",")).join(";");
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsQuery}?geometries=geojson&steps=true&alternatives=true&access_token=${mapboxgl.accessToken}`;

    try {
      const response = await fetch(url);
      const json = await response.json();

      if (!json.routes || json.routes.length === 0) {
        setRouteSummary({ distance: 0, duration: 0, error: "No route found." });
        return;
      }

      const routes = json.routes;
      let shortestRoute = routes[0];
      let longestRoute = routes[0];

      for (const route of routes) {
        if (route.duration < shortestRoute.duration) {
          shortestRoute = route;
        }
        if (route.duration > longestRoute.duration) {
          longestRoute = route;
        }
      }

      let primaryRoute: any;
      let alternativeRoute: any;

      // CORRECTED LOGIC:
      if (isOptimized) {
        // If optimized=true, primary is shortest (less time)
        primaryRoute = shortestRoute;
        alternativeRoute = longestRoute;
      } else {
        // If optimized=false, primary is longest (more time)
        primaryRoute = longestRoute;
        alternativeRoute = shortestRoute;
      }

      // 1. Update UI state with the chosen primary route
      routeCoordsRef.current = primaryRoute.geometry.coordinates;
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

      // 2. Draw Primary Route
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
            "line-color": "#20a9f8",
            "line-width": 6,
            "line-opacity": 0.85,
          },
        });
      }

      // 3. Draw Alternative Route (only if it's actually different)
      const alternativeRouteId = "route-alternative";
      if (
        primaryRoute.duration !== alternativeRoute.duration ||
        primaryRoute.distance !== alternativeRoute.distance
      ) {
        const alternativeGeojson = {
          type: "Feature",
          geometry: alternativeRoute.geometry,
        };

        if (map.getSource(alternativeRouteId)) {
          (map.getSource(alternativeRouteId) as any).setData(
            alternativeGeojson
          );
        } else {
          map.addSource(alternativeRouteId, {
            type: "geojson",
            data: alternativeGeojson,
          });
          map.addLayer(
            {
              id: alternativeRouteId,
              type: "line",
              source: alternativeRouteId,
              layout: { "line-join": "round", "line-cap": "round" },
              paint: {
                "line-color": "#212121",
                "line-width": 4,
                "line-opacity": 0.5,
                "line-dasharray": [1, 1.5],
              },
            },
            primaryRouteId
          );
        }
      } else {
        // Remove alternative layer if it exists and there's only one route
        if (map.getLayer(alternativeRouteId)) {
          map.removeLayer(alternativeRouteId);
          map.removeSource(alternativeRouteId);
        }
      }

      if (primaryRoute.bbox) {
        const bounds: [mapboxgl.LngLatLike, mapboxgl.LngLatLike] = [
          [primaryRoute.bbox[0], primaryRoute.bbox[1]],
          [primaryRoute.bbox[2], primaryRoute.bbox[3]],
        ];
        // map.fitBounds(bounds, { padding: 50, duration: 1000 });
      }
    } catch {
      setRouteSummary({
        distance: 0,
        duration: 0,
        error: "Network error fetching route.",
      });
    }
  };

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
          <h2 className="text-lg font-semibold mb-2">
            {isOptimized ? "Optimized Route" : "Original Route"}
          </h2>
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
