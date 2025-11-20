import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

// ---------- Helpers ----------
const formatDistance = (distance: number) => {
  if (!distance && distance !== 0) return "--";
  const km = distance / 1000;
  const miles = km * 0.621371;
  return miles.toFixed(1);
};

export const formatDuration = (seconds: number): string => {
  if (!seconds && seconds !== 0) return "--";
  const hours = Math.floor(seconds / 3600);
  const remainingSecondsAfterHours = seconds % 3600;
  const minutes = Math.floor(remainingSecondsAfterHours / 60);
  const remainingSeconds = Math.round(remainingSecondsAfterHours % 60);

  const parts: string[] = [];

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

  return parts.length === 0 ? "0s" : parts.join(" ");
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

// color mapping for congestion types
const congestionColor = (level: string | null | undefined) => {
  // Mapbox congestion levels: unknown, low, moderate, heavy, severe
  switch (level) {
    case "severe":
      return "#b30000";
    case "heavy":
      return "#ff4500";
    case "moderate":
      return "#ffbf00";
    case "low":
      return "#00b050";
    default:
      return "#20a9f8"; // default route color
  }
};

type RouteWithExtras = {
  route: any;
  geojson: GeoJSON.Feature<GeoJSON.LineString>;
  congestionSegments?: GeoJSON.FeatureCollection<GeoJSON.LineString>;
};

export default function VisitMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [routeSummary, setRouteSummary] = useState<any>(null);
  const [directionsList, setDirectionsList] = useState<any[]>([]);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOptimized, setIsOptimized] = useState(true);
  const [currentProfile, setCurrentProfile] = useState<"driving-traffic" | "driving">(
    "driving-traffic"
  );
  const [routesAvailable, setRoutesAvailable] = useState<RouteWithExtras[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // moving marker
  const movingMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const animIdxRef = useRef(0);

  useEffect(() => {
    const { coordinates: initialCoords, optimized } = getCoordinatesFromUrl();
    setCoordinates(initialCoords as [number, number][]);
    setIsOptimized(optimized);
    setIsLoading(false);
  }, []);

  // initialize map
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
      // add 3D building layer if style supports it
      if (!map.getLayer("3d-buildings")) {
        try {
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
        } catch (e) {
          // style might not contain composite/source layers; ignore
        }
      }

      // add a blank source / layer placeholders for routes and congestion
      if (!map.getSource("route-primary")) {
        map.addSource("route-primary", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
      }
      if (!map.getLayer("route-primary")) {
        map.addLayer({
          id: "route-primary",
          type: "line",
          source: "route-primary",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#20a9f8", "line-width": 6, "line-opacity": 0.9 },
        });
      }

      if (!map.getSource("route-alternative")) {
        map.addSource("route-alternative", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
      }
      if (!map.getLayer("route-alternative")) {
        map.addLayer({
          id: "route-alternative",
          type: "line",
          source: "route-alternative",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": "#212121",
            "line-width": 4,
            "line-opacity": 0.5,
            "line-dasharray": [1, 1.5],
          },
        }, "route-primary"); // draw under primary if present
      }

      // congestion segments layer (each segment color-coded)
      if (!map.getSource("route-congestion")) {
        map.addSource("route-congestion", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
      }
      if (!map.getLayer("route-congestion")) {
        map.addLayer({
          id: "route-congestion",
          type: "line",
          source: "route-congestion",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            // color is from the feature property "color"
            "line-color": ["get", "color"],
            "line-width": 6,
            "line-opacity": 0.9,
          },
        }, "route-primary");
      }

      // origin / destination markers will be added in getRoute

      // when map is ready, fetch route once
      getRoute(map, coordinates, isOptimized, currentProfile);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates, isOptimized]);

  // re-request route when user toggles profile or optimization
  useEffect(() => {
    if (!mapRef.current || coordinates.length < 2) return;
    getRoute(mapRef.current, coordinates, isOptimized, currentProfile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile, isOptimized]);

  // animate marker
  useEffect(() => {
    if (!isAnimating) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
      return;
    }
    const map = mapRef.current;
    const route = routesAvailable[selectedRouteIndex];
    if (!map || !route) {
      setIsAnimating(false);
      return;
    }
    const coords = route.geojson.geometry.coordinates;
    if (!coords || coords.length === 0) {
      setIsAnimating(false);
      return;
    }

    if (!movingMarkerRef.current) {
      movingMarkerRef.current = new mapboxgl.Marker({ rotationAlignment: "map" }).setLngLat(coords[0]).addTo(map);
    }

    animIdxRef.current = 0;
    const step = () => {
      if (!movingMarkerRef.current) return;
      animIdxRef.current = (animIdxRef.current + 1) % coords.length;
      movingMarkerRef.current.setLngLat(coords[animIdxRef.current] as any);
      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    };
  }, [isAnimating, routesAvailable, selectedRouteIndex]);

  // ---------- Fetch & Draw Route ----------
  const getRoute = async (
    map: mapboxgl.Map,
    coords: [number, number][],
    optimized: boolean,
    profile: "driving-traffic" | "driving"
  ) => {
    if (coords.length < 2 || !mapboxgl.accessToken) {
      setRouteSummary({
        distance: 0,
        duration: 0,
        error: "Route Error: Invalid Mapbox token.",
      });
      return;
    }

    setRouteSummary(null);
    setDirectionsList([]);
    setRoutesAvailable([]);

    // build coordinates query
    const coordsQuery = coords.map((c) => `${c[0]},${c[1]}`).join(";");

    // Use driving-traffic profile by default → better highway preference due to traffic/historic speeds
    const profileToUse = profile;

    // Use large radiuses so snapping is tolerant; radius in meters, "unlimited" is expressed by omitting the radiuses param,
    // but providing a reasonable radius helps snap to adjacent highway ramps.
    const radiuses = coords.map(() => "25").join(";");

    // Request full overview and annotations (congestion) and alternatives
    const url = `https://api.mapbox.com/directions/v5/mapbox/${profileToUse}/${coordsQuery}` +
      `?geometries=geojson&overview=full&steps=true&alternatives=true&annotations=congestion,congestion_numeric&radiuses=${radiuses}&access_token=${mapboxgl.accessToken}`;

    try {
      const res = await fetch(url);
      const json = await res.json();

      if (!json.routes || json.routes.length === 0) {
        setRouteSummary({ distance: 0, duration: 0, error: "No route found." });
        return;
      }

      // pick routes (we'll present them all)
      const routes: RouteWithExtras[] = json.routes.map((route: any) => {
        const geojson = {
          type: "Feature",
          properties: {},
          geometry: route.geometry,
        } as GeoJSON.Feature<GeoJSON.LineString>;

        // build congestion segments if annotation present
        let congestionSegments: GeoJSON.FeatureCollection<GeoJSON.LineString> | undefined = undefined;
        try {
          // annotation distances / congestion array lives inside route.legs[].annotation
          // We'll build segments by mapping geometry coordinates to annotation.congestion levels.
          const leg = route.legs && route.legs[0];
          if (route.legs && route.legs.length >= 1) {
            // accumulate across legs
            const segments: GeoJSON.Feature<GeoJSON.LineString>[] = [];
            // Mapbox returns route.geometry.coordinates array, and annotations are per-segment (len = coords-1)
            // We'll iterate segments and create 1-segment line features with color property
            const coordsArr: any[] = route.geometry?.coordinates || [];
            // Find an aggregated congestion array if present across legs
            let allCongestion: string[] = [];
            for (const lg of route.legs) {
              if (lg.annotation && lg.annotation.congestion) {
                allCongestion = allCongestion.concat(lg.annotation.congestion);
              }
            }
            if (allCongestion.length > 0 && coordsArr.length > 1) {
              // allCongestion length should be coordsArr.length - 1 (or close) — clamp to avoid mismatch
              const n = Math.min(allCongestion.length, coordsArr.length - 1);
              for (let i = 0; i < n; i++) {
                const segmentCoords = [coordsArr[i], coordsArr[i + 1]];
                const lvl = allCongestion[i];
                segments.push({
                  type: "Feature",
                  geometry: { type: "LineString", coordinates: segmentCoords },
                  properties: { color: congestionColor(lvl), congestion: lvl },
                });
              }
            }
            if (segments.length > 0) {
              congestionSegments = { type: "FeatureCollection", features: segments };
            }
          }
        } catch (e) {
          // ignore if not present
        }

        return { route, geojson, congestionSegments };
      });

      // prefer fastest route as primary
      routes.sort((a, b) => a.route.duration - b.route.duration);

      // set summary from fastest route
      const primary = routes[0].route;
      setRouteSummary({
        distance: primary.distance,
        duration: primary.duration,
        error: null,
      });

      // set turn-by-turn from primary
      const primarySteps = routes[0].route.legs.flatMap((leg: any) => leg.steps || []);
      setDirectionsList(primarySteps);

      // draw in map sources
      // primary
      if (map.getSource("route-primary")) {
        (map.getSource("route-primary") as mapboxgl.GeoJSONSource).setData(routes[0].geojson);
      } else {
        map.addSource("route-primary", { type: "geojson", data: routes[0].geojson });
      }

      // alternative (if at least 2)
      if (routes.length > 1) {
        const altGeo = routes[1].geojson;
        if (map.getSource("route-alternative")) {
          (map.getSource("route-alternative") as mapboxgl.GeoJSONSource).setData(altGeo);
        } else {
          map.addSource("route-alternative", { type: "geojson", data: altGeo });
        }
      } else {
        // clear alternative
        if (map.getSource("route-alternative")) {
          (map.getSource("route-alternative") as mapboxgl.GeoJSONSource).setData({ type: "FeatureCollection", features: [] });
        }
      }

      // congestion segments for primary (color-coded)
      if (routes[0].congestionSegments) {
        if (map.getSource("route-congestion")) {
          (map.getSource("route-congestion") as mapboxgl.GeoJSONSource).setData(routes[0].congestionSegments);
        } else {
          map.addSource("route-congestion", { type: "geojson", data: routes[0].congestionSegments });
        }
      } else {
        // reset to empty if none
        if (map.getSource("route-congestion")) {
          (map.getSource("route-congestion") as mapboxgl.GeoJSONSource).setData({ type: "FeatureCollection", features: [] });
        }
      }

      // Add origin/destination markers (remove previous)
      // clear old markers by removing layers/sources if we used them; we'll just create new mapbox markers and keep references through DOM cleanup
      // For simplicity, remove old markers by querying & removing elements with data attributes
      Array.from(document.querySelectorAll("[data-map-marker]")).forEach((n) => n.remove());

      // add markers
      coords.forEach((c, idx) => {
        const el = document.createElement("div");
        el.setAttribute("data-map-marker", String(idx));
        el.className = "rounded-full border-2 border-white bg-blue-600 w-6 h-6 flex items-center justify-center text-white text-xs";
        el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)";
        const marker = new mapboxgl.Marker({ element: el }).setLngLat(c as any).addTo(map as any);

        // reverse geocode for label/popups
        (async () => {
          try {
            const url = `https://api.mapbox.com/search/geocode/v1/reverse?longitude=${c[0]}&latitude=${c[1]}&access_token=${mapboxgl.accessToken}`;
            const r = await fetch(url);
            const j = await r.json();
            const label = j?.features?.[0]?.properties?.name || `Stop ${idx + 1}`;
            const popup = new mapboxgl.Popup({ offset: 8 }).setHTML(`<div class="text-xs font-medium">${label}</div>`);
            marker.setPopup(popup);
            if (idx === 0) {
              // open first marker popup briefly
              popup.addTo(map);
            }
          } catch (e) {
            // ignore
          }
        })();
      });

      // Save routes in state for UI selection
      setRoutesAvailable(routes);
      setSelectedRouteIndex(0);

      // fit bounds
      try {
        const coordsArr = routes[0].geojson.geometry.coordinates;
        const bounds = coordsArr.reduce(function (b: mapboxgl.LngLatBoundsLike, coord: any) {
          if (!b) return new mapboxgl.LngLatBounds(coord, coord);
          return (b as any).extend ? (b as mapboxgl.LngLatBounds).extend(coord) : new mapboxgl.LngLatBounds(coord, coord);
        }, null as any);
        if (bounds) {
          map.fitBounds(bounds, { padding: 60, duration: 800 });
        }
      } catch (e) {
        // ignore fit errors
      }
    } catch (err) {
      console.error(err);
      setRouteSummary({
        distance: 0,
        duration: 0,
        error: "Network error fetching route or invalid response.",
      });
    }
  };

  // when selected route changes, update map drawing and directions list
  useEffect(() => {
    const map = mapRef.current;
    if (!map || routesAvailable.length === 0) return;
    const rt = routesAvailable[selectedRouteIndex];

    // update main route layer data
    if (map.getSource("route-primary")) {
      (map.getSource("route-primary") as mapboxgl.GeoJSONSource).setData(rt.geojson);
    }

    // draw congestion segments if present
    if (rt.congestionSegments && map.getSource("route-congestion")) {
      (map.getSource("route-congestion") as mapboxgl.GeoJSONSource).setData(rt.congestionSegments);
      // hide the plain primary line so color segments show clearly
      if (map.getLayer("route-primary")) {
        map.setPaintProperty("route-primary", "line-opacity", 0.25);
      }
    } else {
      if (map.getLayer("route-primary")) {
        map.setPaintProperty("route-primary", "line-opacity", 0.95);
      }
      if (map.getSource("route-congestion")) {
        (map.getSource("route-congestion") as mapboxgl.GeoJSONSource).setData({ type: "FeatureCollection", features: [] });
      }
    }

    // update directions list
    const steps = rt.route.legs.flatMap((leg: any) => leg.steps || []);
    setDirectionsList(steps);

    // update summary
    setRouteSummary({
      distance: rt.route.distance,
      duration: rt.route.duration,
      error: null,
    });

    // reset animation marker
    if (movingMarkerRef.current) {
      movingMarkerRef.current.remove();
      movingMarkerRef.current = null;
    }
    setIsAnimating(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRouteIndex, routesAvailable]);

  // helper: fly to a step
  const flyToStep = (maneuver: any) => {
    const map = mapRef.current;
    if (!map || !maneuver || !maneuver.location) return;
    map.flyTo({ center: maneuver.location as any, zoom: 16, speed: 0.8 });
    // add a temporary highlight
    const el = document.createElement("div");
    el.className = "p-1 rounded bg-white shadow";
    el.innerHTML = `<div class="text-xs">${maneuver.instruction}</div>`;
  };

  // UI render
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">Loading coordinates...</div>
    );
  }

  if (coordinates.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-red-600">Invalid Coordinates</h2>
        <p className="text-sm text-red-500 mt-2 text-center">The URL must contain at least two lng,lat pairs separated by semicolons.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      {/* Top-left summary */}
      {routeSummary && (
        <div className="absolute top-6 left-6 bg-white shadow-lg rounded-xl p-4 z-30 w-72">
          <h2 className="text-lg font-semibold mb-2">{isOptimized ? "Optimized Route" : "Original Route"}</h2>
          <div className="text-sm">
            <p><span className="text-gray-600">Total Distance: </span><span className="font-bold">{formatDistance(routeSummary.distance)} mi</span></p>
            <p><span className="text-gray-600">Estimated Time: </span><span className="font-bold">{formatDuration(routeSummary.duration)}</span></p>
            <p><span className="text-gray-600">Stops: </span><span className="font-bold">{coordinates.length}</span></p>
            <p><span className="text-gray-600">Avg Speed: </span><span className="font-bold">{((routeSummary.distance / Math.max(routeSummary.duration, 1)) * 2.23694).toFixed(1)} mph</span></p>
          </div>
        </div>
      )}

      {/* Top-right controls */}
      <div className="absolute top-6 right-6 bg-white shadow-xl p-4 w-96 max-h-[80vh] overflow-y-auto rounded-xl z-30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Route Controls</h3>
          <div className="flex gap-2">
            <button
              onClick={() => {
                // force refetch with same profile (re-run getRoute)
                if (mapRef.current) getRoute(mapRef.current, coordinates, isOptimized, currentProfile);
              }}
              className="px-3 py-1 rounded bg-slate-100 text-sm hover:bg-slate-200"
            >
              Refresh
            </button>
            <button
              onClick={() => {
                setIsAnimating((s) => !s);
              }}
              className={`px-3 py-1 rounded text-sm ${isAnimating ? "bg-red-100 hover:bg-red-200" : "bg-green-100 hover:bg-green-200"}`}
            >
              {isAnimating ? "Pause" : "Animate"}
            </button>
          </div>
        </div>

        <div className="mb-3 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isOptimized} onChange={(e) => setIsOptimized(e.target.checked)} />
            <span>Optimized</span>
          </label>
          <div className="mt-2">
            <label className="text-xs text-gray-500">Routing profile</label>
            <div className="mt-1 flex gap-2">
              <button
                onClick={() => setCurrentProfile("driving-traffic")}
                className={`px-2 py-1 rounded text-sm ${currentProfile === "driving-traffic" ? "bg-blue-600 text-white" : "bg-slate-100"}`}
              >
                Driving-Traffic
              </button>
              <button
                onClick={() => setCurrentProfile("driving")}
                className={`px-2 py-1 rounded text-sm ${currentProfile === "driving" ? "bg-blue-600 text-white" : "bg-slate-100"}`}
              >
                Driving
              </button>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label className="text-sm font-medium">Available Routes</label>
          <div className="mt-2 flex flex-col gap-2">
            {routesAvailable.length === 0 && <div className="text-xs text-gray-500">No routes loaded yet.</div>}
            {routesAvailable.map((r, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedRouteIndex(idx)}
                className={`text-left p-2 rounded ${selectedRouteIndex === idx ? "bg-slate-100 border" : "bg-white"} text-sm`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{idx === 0 ? "Fastest" : `Alt ${idx}`}</div>
                    <div className="text-xs text-gray-500">{(r.route.distance / 1000).toFixed(1)} km • {formatDuration(r.route.duration)}</div>
                  </div>
                  <div className="text-xs text-gray-500">{r.route.legs.length} legs</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Turn-by-Turn</label>
          <div className="mt-2 divide-y max-h-48 overflow-auto">
            {directionsList.length === 0 && <div className="text-xs text-gray-500 p-2">No steps yet.</div>}
            {directionsList.map((step, i) => (
              <div key={i} className="p-2 hover:bg-slate-50 cursor-pointer" onClick={() => flyToStep(step.maneuver)}>
                <div className="text-sm font-medium">{step.maneuver.instruction}</div>
                <div className="text-xs text-gray-500">{((step.distance || 0) * 0.000621371).toFixed(2)} mi</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map container */}
      <div className="flex-grow relative rounded-xl overflow-hidden shadow-xl m-4">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
