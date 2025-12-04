import { Card, CardBody, CardHeader } from "@heroui/react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState, useCallback } from "react";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

/* -----------------------------------------------------
 * Utility Functions
 * ---------------------------------------------------- */
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

  const parts: string[] = [];

  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  if (hours === 0 && minutes === 0) {
    parts.push(`${remainingSeconds}s`);
  } else if (remainingSeconds > 0) {
    parts.push(`${remainingSeconds}s`);
  }

  return parts.length > 0 ? parts.join(" ") : "0s";
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
        [76.75, 30.65],
        [76.65, 30.72],
        [76.7, 30.7],
      ],
      optimized,
    };
  }

  const coordinates = coordsString
    .split(";")
    .map((pair) => pair.split(",").map(Number))
    .filter((c) => c.length === 2 && !isNaN(c[0]) && !isNaN(c[1]));

  return { coordinates, optimized };
};

/* -----------------------------------------------------
 * Nearest Neighbor Optimization
 * ---------------------------------------------------- */
const haversineDistance = (
  [lng1, lat1]: number[],
  [lng2, lat2]: number[]
): number => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const getOptimizedCoordinates = (initialCoords: number[][]): number[][] => {
  if (initialCoords.length < 2) return initialCoords;

  const startPoint = initialCoords[0];
  let stops = initialCoords.slice(1);
  const optimizedOrder = [startPoint];
  let currentPoint = startPoint;

  while (stops.length > 0) {
    let nearestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < stops.length; i++) {
      const distance = haversineDistance(currentPoint, stops[i]);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = i;
      }
    }

    currentPoint = stops[nearestIndex];
    optimizedOrder.push(currentPoint);
    stops.splice(nearestIndex, 1);
  }

  return optimizedOrder;
};

/* -----------------------------------------------------
 * Main Component
 * ---------------------------------------------------- */
export default function VisitMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [routeSummary, setRouteSummary] = useState<any>(null);
  const [directionsList, setDirectionsList] = useState<any[]>([]);
  const [routeLegs, setRouteLegs] = useState<any[]>([]);
  const [coordinates, setCoordinates] = useState<number[][]>([]);
  const [startLabel, setStartLabel] = useState("Start Point");
  const [isLoading, setIsLoading] = useState(true);
  const [isOptimized, setIsOptimized] = useState(true);

  const markerRefs = useRef<mapboxgl.Marker[]>([]);

  const clearMarkers = () => {
    markerRefs.current.forEach((marker) => marker.remove());
    markerRefs.current = [];
  };

  const getRoute = useCallback(
    async (map: mapboxgl.Map, coords: number[][], optimized: boolean) => {
      if (coords.length < 2) {
        setRouteSummary({
          distance: 0,
          duration: 0,
          error: "Invalid input for mapping",
        });
        return;
      }

      const routeCoords =
        optimized && coords.length > 2
          ? getOptimizedCoordinates(coords)
          : coords;

      const urlCoords = routeCoords.map((c) => c.join(",")).join(";");
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${urlCoords}?steps=true&geometries=geojson&alternatives=true&overview=full&access_token=${mapboxgl.accessToken}`;

      try {
        const res = await fetch(url);
        const json = await res.json();

        if (!json?.routes?.length) {
          setRouteSummary({
            distance: 0,
            duration: 0,
            error: "No route found",
          });
          return;
        }

        const route = json.routes.reduce((best: any, current: any) =>
          current.duration < best.duration ? current : best
        );

        setDirectionsList(route.legs.flatMap((leg: any) => leg.steps));
        setRouteLegs(
          route.legs.map((leg: any, i: number) => ({
            index: i + 1,
            distance: leg.distance,
            duration: leg.duration,
          }))
        );

        setRouteSummary({
          distance: route.distance,
          duration: route.duration,
          error: null,
        });

        const id = "route-primary";
        const geojson = { type: "Feature", geometry: route.geometry };

        if (map.getSource(id)) {
          (map.getSource(id) as any).setData(geojson);
        } else {
          map.addSource(id, { type: "geojson", data: geojson });
          map.addLayer({
            id,
            type: "line",
            source: id,
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#0d53ff",
              "line-width": 6,
              "line-opacity": 0.85,
            },
          });
        }

        route.bbox &&
          map.fitBounds(
            [
              [route.bbox[0], route.bbox[1]],
              [route.bbox[2], route.bbox[3]],
            ],
            { padding: 50 }
          );
      } catch (e) {
        console.error(e);
      }
    },
    []
  );

  const fetchAndAddMarker = async (
    map: mapboxgl.Map,
    lng: number,
    lat: number,
    idx: number,
    total: number
  ) => {
    const isStart = idx === 0;
    const isDest = idx === total - 1;

    let label = isStart ? "Start" : isDest ? "Destination" : `Stop ${idx}`;

    try {
      const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&access_token=${mapboxgl.accessToken}`;
      const res = await fetch(url);
      const json = await res.json();
      label = json?.features?.[0]?.properties?.name ?? label;
    } catch {}

    const el = document.createElement("div");
    const color = isStart
      ? "bg-green-600"
      : isDest
      ? "bg-red-600"
      : "bg-primary";
    el.innerHTML = `
      <div class="w-7 h-7 ${color} text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-md">
        ${idx + 1}
      </div>
    `;

    const popup = new mapboxgl.Popup({ offset: 30 }).setHTML(
      `<h3 class="font-medium text-sm">${label}</h3>`
    );

    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat([lng, lat])
      // .setPopup(popup)
      .addTo(map);

    markerRefs.current.push(marker);
    if (isStart) setStartLabel(label);
  };

  /* -----------------------------------------------------
   * Init Data from URL
   * ---------------------------------------------------- */
  useEffect(() => {
    const { coordinates: coords, optimized } = getCoordinatesFromUrl();

    if (!coords.length) coords.push([76.69715, 30.69134], [76.69399, 30.71158]);
    if (coords.length === 1) coords.push(coords[0]);

    setCoordinates(coords);
    setIsOptimized(optimized);
    setIsLoading(false);
  }, []);

  /* -----------------------------------------------------
   * Initialize Map
   * ---------------------------------------------------- */
  useEffect(() => {
    if (
      mapRef.current ||
      coordinates.length < 2 ||
      !mapboxgl.supported() ||
      !mapContainerRef.current
    )
      return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: coordinates[0],
      zoom: 14,
      pitch: 45,
    });

    mapRef.current = map;

    map.on("load", () => {
      const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 15000,
        },
        trackUserLocation: true,
        showUserHeading: true,
      });

      map.addControl(geolocateControl, "top-right");

      geolocateControl.on("geolocate", (e) => {});

      geolocateControl.trigger();

      let finalCoords = isOptimized
        ? getOptimizedCoordinates(coordinates)
        : coordinates;

      clearMarkers();
      finalCoords.forEach(([lng, lat], i) =>
        fetchAndAddMarker(map, lng, lat, i, finalCoords.length)
      );

      getRoute(map, finalCoords, isOptimized);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [coordinates, isOptimized, getRoute]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading coordinates...
      </div>
    );
  }

  if (coordinates.length < 2) {
    return (
      <div className="flex items-center justify-center h-screen">
        Invalid Coordinates
      </div>
    );
  }

  /* -----------------------------------------------------
   * UI Layout
   * ---------------------------------------------------- */
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Summary Card */}
      {routeSummary && (
        <Card className="absolute top-8 left-8 z-20 w-64">
          <CardHeader className="p-4 pb-0">
            <h2 className="text-base font-semibold">
              {isOptimized && coordinates.length > 2
                ? "Optimized Route"
                : "Original Route"}
            </h2>
          </CardHeader>
          <CardBody className="p-4 pt-3">
            {routeSummary.error ? (
              <p className="text-red-500">{routeSummary.error}</p>
            ) : (
              <div className="text-sm space-y-1.5">
                <p>
                  <span className="text-gray-600">Distance:</span>{" "}
                  <b>{formatDistance(routeSummary.distance)} mi</b>
                </p>
                <p>
                  <span className="text-gray-600">Estimated Duration:</span>{" "}
                  <b>{formatDuration(routeSummary.duration)}</b>
                </p>
                <p>
                  <span className="text-gray-600">Starting Point:</span>{" "}
                  <b>{startLabel}</b>
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* Right Details */}
      <div className="absolute top-8 right-8 z-20 w-80 space-y-4">
        <Card>
          <CardHeader className="p-4 pb-3">
            <h3 className="font-semibold">Route Segments</h3>
          </CardHeader>
          <CardBody className="px-4 pt-0 pb-4 divide-y-1 divide-gray-300">
            {routeLegs.map((leg, i) => (
              <div key={i} className="text-sm py-2 first:pt-0 last:pb-0">
                <b>
                  Stretch {leg.index} → {leg.index + 1}
                </b>
                <p>Distance: {formatDistance(leg.distance)} mi</p>
                <p>ETA: {formatDuration(leg.duration)}</p>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-3">
            <h3 className="font-semibold">Detailed Steps</h3>
          </CardHeader>
          <CardBody className="px-4 pt-0 pb-4 max-h-[40vh] overflow-y-auto space-y-3">
            {directionsList.map((step, i) => (
              <div key={i}>
                <p className="text-sm font-medium">
                  {step.maneuver.instruction}
                </p>
                <p className="text-xs text-gray-500">
                  {(step.distance * 0.000621371).toFixed(2)} mi
                </p>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Map */}
      <div className="flex-grow m-4 rounded-xl shadow-xl overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
