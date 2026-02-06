import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiInfo, FiList } from "react-icons/fi";

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
    return { coordinates: [], optimized: true, names: [] };

  const params = new URLSearchParams(window.location.search);
  const coordsString = params.get("coordinates");
  const optimizedString = params.get("optimized");
  const namesString = params.get("names");
  const optimized = optimizedString !== "false";

  const names = namesString ? namesString.split(";") : [];

  if (!coordsString) {
    return {
      coordinates: [
        [76.6971535, 30.691342],
        [76.75, 30.65],
        [76.65, 30.72],
        [76.7, 30.7],
      ],
      optimized,
      names: [],
    };
  }

  const coordinates = coordsString
    .split(";")
    .map((pair) => pair.split(",").map(Number))
    .filter(
      (c): c is [number, number] =>
        c.length === 2 &&
        typeof c[0] === "number" &&
        typeof c[1] === "number" &&
        !isNaN(c[0]) &&
        !isNaN(c[1]),
    );

  return { coordinates, optimized, names };
};

/* -----------------------------------------------------
 * Nearest Neighbor Optimization
 * ---------------------------------------------------- */
const haversineDistance = (p1: number[], p2: number[]): number => {
  const lng1 = p1?.[0] || 0;
  const lat1 = p1?.[1] || 0;
  const lng2 = p2?.[0] || 0;
  const lat2 = p2?.[1] || 0;

  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const getOptimizedCoordinates = (
  initialCoords: number[][],
): { optimizedOrder: number[][]; orderMap: number[] } => {
  if (initialCoords.length < 2) {
    return {
      optimizedOrder: initialCoords,
      orderMap: initialCoords.map((_, i) => i),
    };
  }

  const startPoint = initialCoords[0];
  if (!startPoint)
    return {
      optimizedOrder: initialCoords,
      orderMap: initialCoords.map((_, i) => i),
    };

  // Store stops with their original index (offset by 1 because 0 is start)
  let stops = initialCoords
    .slice(1)
    .map((coord, i) => ({ coord, originalIndex: i + 1 }));

  const optimizedOrder = [startPoint];
  const orderMap = [0]; // Start point is always original index 0
  let currentPoint = startPoint;

  while (stops.length > 0) {
    let nearestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < stops.length; i++) {
      const stop = stops[i];
      if (!stop) continue;
      const distance = haversineDistance(currentPoint, stop.coord);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = i;
      }
    }

    const nearestStop = stops[nearestIndex];
    if (nearestStop) {
      currentPoint = nearestStop.coord;
      optimizedOrder.push(currentPoint);
      orderMap.push(nearestStop.originalIndex);
      stops.splice(nearestIndex, 1);
    } else {
      stops.splice(nearestIndex, 1);
    }
  }

  return { optimizedOrder, orderMap };
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
  const [names, setNames] = useState<string[]>([]);
  const [startLabel, setStartLabel] = useState("Start Point");
  const [isLoading, setIsLoading] = useState(true);
  const [isOptimized, setIsOptimized] = useState(true);

  // Mobile drawer states
  const [isSummaryOpen, setSummaryOpen] = useState(false);
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [isMapsModalOpen, setMapsModalOpen] = useState(false);

  const markerRefs = useRef<mapboxgl.Marker[]>([]);

  // Simple check for Apple device (iPhone, iPad, Mac)
  const isAppleDevice = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

  // Trigger "Open in Maps" modal on mobile/tablet when coordinates are ready
  useEffect(() => {
    if (!isLoading && coordinates.length >= 2) {
      const isMobileOrTablet = window.innerWidth < 1024; // Align with lg:hidden
      if (isMobileOrTablet) {
        // Small delay to ensure UI is ready and user sees the context
        const timer = setTimeout(() => {
          setMapsModalOpen(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, coordinates]);

  const handleOpenGoogleMaps = () => {
    if (coordinates.length < 2) return;

    // Extract origin and destination
    const origin = `${coordinates[0]![1]},${coordinates[0]![0]}`; // lat,lng
    const destinationIndex = coordinates.length - 1;
    const destination = `${coordinates[destinationIndex]![1]},${coordinates[destinationIndex]![0]}`;

    // Build waypoints string for intermediate stops
    let waypointsParam = "";
    if (coordinates.length > 2) {
      const intermediatePoints = coordinates.slice(1, destinationIndex);
      waypointsParam = intermediatePoints
        .map((coord) => `${coord[1]},${coord[0]}`)
        .join("|");
    }

    // Google Maps app URL scheme
    // Format: comgooglemaps://?saddr=origin&daddr=destination&waypoints=wp1|wp2&directionsmode=driving
    let appUrl = `comgooglemaps://?saddr=${origin}&daddr=${destination}`;
    if (waypointsParam) {
      appUrl += `&waypoints=${waypointsParam}`;
    }
    appUrl += "&directionsmode=driving";

    // Web URL for fallback
    let webUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    if (waypointsParam) {
      webUrl += `&waypoints=${waypointsParam}`;
    }
    webUrl += "&travelmode=driving";

    // Try to open native app first
    window.location.href = appUrl;

    // Fallback to web after a short delay if app doesn't open
    setTimeout(() => {
      window.open(webUrl, "_blank");
    }, 1500);

    setMapsModalOpen(false);
  };

  const handleOpenAppleMaps = () => {
    if (coordinates.length < 2) return;

    // Apple Maps URL scheme for navigation
    // maps:// opens the native Maps app on iOS/macOS

    // Start address
    const saddr = `${coordinates[0]![1]},${coordinates[0]![0]}`;

    // Destination addresses (chained with +to:)
    const stops = coordinates.slice(1);
    const daddr = stops.map((coord) => `${coord[1]},${coord[0]}`).join("+to:");

    // Use maps:// scheme for native app with dirflg=d for driving directions
    const url = `maps://?saddr=${saddr}&daddr=${daddr}&dirflg=d`;

    // This will open Apple Maps app directly with navigation ready
    window.location.href = url;
    setMapsModalOpen(false);
  };

  const clearMarkers = () => {
    markerRefs.current.forEach((marker) => marker.remove());
    markerRefs.current = [];
  };

  const getRoute = useCallback(
    async (map: mapboxgl.Map, coords: number[][]) => {
      if (coords.length < 2) {
        setRouteSummary({
          distance: 0,
          duration: 0,
          error: "Invalid input for mapping",
        });
        return;
      }

      const urlCoords = coords.map((c) => c.join(",")).join(";");
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
          current.duration < best.duration ? current : best,
        );

        setDirectionsList(route.legs.flatMap((leg: any) => leg.steps));
        setRouteLegs(
          route.legs.map((leg: any, i: number) => ({
            index: i + 1,
            distance: leg.distance,
            duration: leg.duration,
          })),
        );

        setRouteSummary({
          distance: route.distance,
          duration: route.duration,
          error: null,
        });

        const id = "route-primary";
        const geojson = {
          type: "Feature",
          properties: {},
          geometry: route.geometry,
        } as GeoJSON.Feature<GeoJSON.Geometry>;

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
            { padding: 50 },
          );
      } catch (e) {
        console.error(e);
      }
    },
    [],
  );

  const fetchAndAddMarker = async (
    map: mapboxgl.Map,
    lng: number,
    lat: number,
    idx: number,
    total: number,
    customLabel?: string,
  ) => {
    const isStart = idx === 0;
    const isDest = idx === total - 1;

    let label =
      customLabel ||
      (isStart ? "Start" : isDest ? "Destination" : `Stop ${idx}`);

    if (!customLabel) {
      try {
        const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&access_token=${mapboxgl.accessToken}`;
        const res = await fetch(url);
        const json = await res.json();
        label = json?.features?.[0]?.properties?.name ?? label;
      } catch {}
    }

    const el = document.createElement("div");
    const color = isStart
      ? "bg-green-600"
      : isDest
        ? "bg-red-600"
        : "bg-primary";
    el.innerHTML = `
      <div class="w-7 h-7 ${color} text-background rounded-full flex items-center justify-center text-sm font-bold border-2 border-background shadow-md">
        ${idx + 1}
      </div>
    `;

    const popup = new mapboxgl.Popup({
      offset: 30,
      className: "bg-background",
    }).setHTML(`<h3 class="font-medium text-sm text-foreground">${label}</h3>`);

    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat([lng, lat] as [number, number])
      .setPopup(popup)
      .addTo(map);

    markerRefs.current.push(marker);
    if (isStart) setStartLabel(label);
  };

  /* -----------------------------------------------------
   * Init Data from URL & User Location
   * ---------------------------------------------------- */
  useEffect(() => {
    const initData = async () => {
      // 1. Get initial data from URL
      let {
        coordinates: loadedCoords,
        optimized,
        names: loadedNames,
      } = getCoordinatesFromUrl();

      // Ensure mutable copies with correct types
      let coords: number[][] = [...loadedCoords];
      let namesList: string[] = loadedNames ? [...loadedNames] : [];

      // Default fallback if no coords
      if (!coords.length) {
        coords.push([76.69715, 30.69134], [76.69399, 30.71158]);
        if (coords.length === 1 && coords[0]) coords.push(coords[0]);
      }

      // 2. Attempt to fetch user's live location
      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              enableHighAccuracy: true,
            });
          },
        );

        const userLoc = [
          position.coords.longitude,
          position.coords.latitude,
        ] as number[];

        // 3. Integrate User Location
        // If the URL already designated the first point as "Current Location", update it.
        // Otherwise, prepend the live location.
        if (namesList.length > 0 && namesList[0] === "Current Location") {
          // Verify coords[0] exists before setting
          if (coords.length > 0) {
            coords[0] = userLoc;
          } else {
            coords.unshift(userLoc);
          }
        } else {
          // Prepend as new start point
          coords.unshift(userLoc);
          namesList.unshift("Current Location");
        }

        // Force optimization to true because we've altered the route start point
        // and implied intent is "Guide me from here to closest..."
        optimized = true;
      } catch (e) {
        console.warn("Could not retrieve user location:", e);
        // Fallback: proceed with URL data as-is
      }

      // 4. Perform Optimization Immediately
      // This ensures that 'coordinates' state is correct for Google Maps open,
      // and that the visual map draws the correct sequence.
      if (optimized && coords.length > 2) {
        const { optimizedOrder, orderMap } = getOptimizedCoordinates(coords);
        coords = optimizedOrder;

        if (namesList.length > 0) {
          const mappedNames: string[] = [];
          orderMap.forEach((idx) => {
            if (namesList[idx] !== undefined) {
              mappedNames.push(namesList[idx] as string);
            }
          });
          namesList = mappedNames;
        }
      }

      // 5. Update State
      setCoordinates(coords);
      setNames(namesList);
      setIsOptimized(optimized);
      setIsLoading(false);
    };

    initData();
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
      center: coordinates[0] as [number, number],
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

      // Coordinates and names are already optimized in InitData useEffect
      // So we can use them directly.
      const finalCoords = coordinates;
      const finalNames = names;

      clearMarkers();
      finalCoords.forEach(([lng, lat], i) =>
        fetchAndAddMarker(
          map,
          lng || 0,
          lat || 0,
          i,
          finalCoords.length,
          finalNames[i],
        ),
      );

      getRoute(map, finalCoords);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [coordinates, isOptimized, getRoute, names]);

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
   * Content Renderers
   * ---------------------------------------------------- */
  const renderRouteSummaryContent = () => {
    if (!routeSummary) return null;

    return (
      <div className="text-sm space-y-1.5">
        {routeSummary.error ? (
          <p className="text-red-500">{routeSummary.error}</p>
        ) : (
          <>
            <p>
              <span className="text-gray-600 dark:text-foreground/60">
                Distance:
              </span>{" "}
              <b>{formatDistance(routeSummary.distance)} mi</b>
            </p>
            <p>
              <span className="text-gray-600 dark:text-foreground/60">
                Estimated Duration:
              </span>{" "}
              <b>{formatDuration(routeSummary.duration)}</b>
            </p>
            <p>
              <span className="text-gray-600 dark:text-foreground/60">
                Starting Point:
              </span>{" "}
              <b>{startLabel}</b>
            </p>
          </>
        )}
      </div>
    );
  };

  const renderRouteSegmentsContent = () => (
    <div className="divide-y-1 divide-gray-300 dark:divide-foreground/10">
      {routeLegs.map((leg, i) => (
        <div key={i} className="text-sm py-2 first:pt-0 last:pb-0">
          <b>
            Stretch {leg.index} → {leg.index + 1}
          </b>
          <p>Distance: {formatDistance(leg.distance)} mi</p>
          <p>ETA: {formatDuration(leg.duration)}</p>
        </div>
      ))}
    </div>
  );

  const renderDetailedStepsContent = () => (
    <div className="space-y-3">
      {directionsList.map((step, i) => (
        <div key={i}>
          <p className="text-sm font-medium">{step.maneuver.instruction}</p>
          <p className="text-xs text-gray-500 dark:text-foreground/60">
            {(step.distance * 0.000621371).toFixed(2)} mi
          </p>
        </div>
      ))}
    </div>
  );

  /* -----------------------------------------------------
   * UI Layout
   * ---------------------------------------------------- */
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-background relative overflow-hidden">
      {/* 
         --- DESKTOP LAYOUT --- 
         Hidden on mobile (lg:block)
      */}

      {/* Left Summary Card (Desktop) */}
      {routeSummary && (
        <div className="hidden lg:block absolute top-2 left-2 z-20 w-64">
          <Card shadow="none" radius="md">
            <CardHeader className="p-4 pb-0">
              <h2 className="text-base font-semibold">
                {isOptimized && coordinates.length > 2
                  ? "Optimized Route"
                  : "Original Route"}
              </h2>
            </CardHeader>
            <CardBody className="p-4 pt-3">
              {renderRouteSummaryContent()}
            </CardBody>
          </Card>
        </div>
      )}

      {/* Right Details Cards (Desktop) */}
      <div className="hidden lg:block absolute top-2 right-2 z-20 w-80 space-y-2">
        <Card shadow="none" radius="md">
          <CardHeader className="p-4 pb-3">
            <h3 className="font-semibold">Route Segments</h3>
          </CardHeader>
          <CardBody className="px-4 pt-0 pb-4">
            {renderRouteSegmentsContent()}
          </CardBody>
        </Card>

        <Card shadow="none" radius="md">
          <CardHeader className="p-4 pb-3">
            <h3 className="font-semibold">Detailed Steps</h3>
          </CardHeader>
          <CardBody className="px-4 pt-0 pb-4 max-h-[40vh] overflow-y-auto">
            {renderDetailedStepsContent()}
          </CardBody>
        </Card>
      </div>

      {/* 
         --- MOBILE LAYOUT --- 
         Visible on mobile (lg:hidden)
      */}

      {/* Toggle Buttons */}
      <div className="lg:hidden absolute top-12 right-2.5 z-20">
        <Button
          isIconOnly
          radius="sm"
          className="size-[30px] min-w-auto bg-background shadow-md border border-foreground/10"
          onPress={() => setSummaryOpen(true)}
        >
          <FiInfo className="size-[18px]" />
        </Button>
      </div>

      <div className="lg:hidden absolute top-[86px] right-2.5 z-20">
        <Button
          isIconOnly
          radius="sm"
          className="size-[30px] min-w-auto bg-background shadow-md border border-foreground/10"
          onPress={() => setDetailsOpen(true)}
        >
          <FiList className="size-[18px]" />
        </Button>
      </div>

      {/* Drawers (Modals) */}
      <Modal
        isOpen={isSummaryOpen}
        onOpenChange={setSummaryOpen}
        placement="bottom"
        className="lg:hidden"
        classNames={{
          base: `max-sm:!m-3 !m-0`,
          closeButton: "cursor-pointer",
        }}
      >
        <ModalContent>
          <ModalHeader className="p-4 pb-3.5">
            <h4 className="font-medium text-base">
              {isOptimized && coordinates.length > 2
                ? "Optimized Route"
                : "Original Route"}
            </h4>
          </ModalHeader>
          <ModalBody className="pb-4 pt-0 px-4">
            {renderRouteSummaryContent()}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isDetailsOpen}
        onOpenChange={setDetailsOpen}
        placement="bottom"
        scrollBehavior="inside"
        className="lg:hidden h-[80vh]"
        classNames={{
          base: `max-sm:!m-3 !m-0`,
          closeButton: "cursor-pointer",
        }}
      >
        <ModalContent>
          <ModalHeader className="p-4 pb-3.5">
            <h4 className="font-medium text-base">Route Details</h4>
          </ModalHeader>
          <ModalBody className="pb-4 pt-0 px-4">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Route Segments</h4>
                {renderRouteSegmentsContent()}
              </div>
              <div>
                <h4 className="font-medium mb-2">Detailed Steps</h4>
                {renderDetailedStepsContent()}
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Map */}
      <div className="flex-grow overflow-hidden relative w-full h-full">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Mobile/Tablet: Open in Maps App Modal */}
      <Modal
        isOpen={isMapsModalOpen}
        onOpenChange={setMapsModalOpen}
        placement="center"
        scrollBehavior="inside"
        classNames={{
          base: `max-sm:!m-3 !m-0`,
          closeButton: "cursor-pointer",
        }}
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 p-4 pb-3">
                <h4 className="font-medium text-base">Open in Maps App?</h4>
              </ModalHeader>
              <ModalBody className="px-4 py-0">
                <p className="text-sm text-gray-600 dark:text-foreground/60">
                  Would you like to open this optimized route in your preferred
                  navigation app for turn-by-turn directions?
                </p>
              </ModalBody>
              <ModalFooter className="flex flex-col items-stretch gap-3 p-4">
                <Button
                  size="sm"
                  radius="sm"
                  color="primary"
                  onPress={handleOpenGoogleMaps}
                  variant="solid"
                  className="w-full"
                >
                  Open in Google Maps
                </Button>
                {isAppleDevice && (
                  <Button
                    size="sm"
                    radius="sm"
                    onPress={handleOpenAppleMaps}
                    variant="ghost"
                    color="default"
                    className="w-full"
                  >
                    Open in Maps
                  </Button>
                )}
                <Button
                  size="sm"
                  radius="sm"
                  onPress={() => setMapsModalOpen(false)}
                  variant="light"
                  color="default"
                  className="w-full"
                >
                  Stay Here
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
