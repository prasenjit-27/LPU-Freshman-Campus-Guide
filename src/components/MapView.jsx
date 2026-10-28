"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { 
  Box, 
  RotateCcw, 
  LocateFixed, 
  Layers, 
  MapPin, 
  ExternalLink,
  AlertCircle 
} from "lucide-react";
import { lpuCampusBoundary, lpu3DBuildings } from "@/data/campus3dBuildings";

// LPU Coordinates & Focus Bounds
const LPU_CENTER_LNG = 75.7037;
const LPU_CENTER_LAT = 31.2536;

export default function MapView({ locations = [] }) {
  const mapElementRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [err, setErr] = useState("");
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [is3D, setIs3D] = useState(true);
  const [mapTheme, setMapTheme] = useState("street"); // "street" | "satellite"

  // Base map tiles (100% free, reliable, no API key required)
  const mapStyle = useMemo(() => {
    const tileUrl = mapTheme === "satellite"
      ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}";

    return {
      version: 8,
      name: "LPU 3D Map",
      sources: {
        "base-tiles": {
          type: "raster",
          tiles: [tileUrl],
          tileSize: 256,
          attribution: "© OpenStreetMap contributors, Esri"
        },
        "lpu-boundary": {
          type: "geojson",
          data: lpuCampusBoundary
        },
        "lpu-3d-buildings": {
          type: "geojson",
          data: lpu3DBuildings
        }
      },
      layers: [
        // 1. Photographic Base Tiles
        {
          id: "base-tiles-layer",
          type: "raster",
          source: "base-tiles",
          minzoom: 0,
          maxzoom: 20
        },
        // 2. 600+ Acre LPU Perimeter Outline
        {
          id: "lpu-boundary-fill",
          type: "fill",
          source: "lpu-boundary",
          paint: {
            "fill-color": "#FFA04D",
            "fill-opacity": 0.08
          }
        },
        {
          id: "lpu-boundary-stroke",
          type: "line",
          source: "lpu-boundary",
          paint: {
            "line-color": "#F37021",
            "line-width": 3,
            "line-dasharray": [2, 2]
          }
        },
        // 3. 3D Extruded Building Models with Heights & LPU Brand Colors
        {
          id: "lpu-3d-buildings-extrusion",
          type: "fill-extrusion",
          source: "lpu-3d-buildings",
          paint: {
            "fill-extrusion-color": ["get", "color"],
            "fill-extrusion-height": ["get", "height"],
            "fill-extrusion-base": ["get", "min_height"],
            "fill-extrusion-opacity": 0.92
          }
        }
      ]
    };
  }, [mapTheme]);

  // Initialize MapLibre GL instance
  useEffect(() => {
    if (!mapElementRef.current) return;

    let isMounted = true;
    let map = null;

    const initMap = async () => {
      try {
        const mod = await import("maplibre-gl");
        const maplibregl = mod.default || mod;

        if (!isMounted || !mapElementRef.current) return;

        // Clean up previous instance if any
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        map = new maplibregl.Map({
          container: mapElementRef.current,
          style: mapStyle,
          center: [LPU_CENTER_LNG, LPU_CENTER_LAT],
          zoom: 16.5,
          pitch: is3D ? 58 : 0,
          bearing: is3D ? -18 : 0,
          maxPitch: 70,
          attributionControl: false
        });

        map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
        map.addControl(new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }), "top-right");

        map.on("load", () => {
          if (!isMounted) return;
          mapInstanceRef.current = map;
          setMapLoaded(true);

          // Click on 3D building to select
          map.on("click", "lpu-3d-buildings-extrusion", (e) => {
            if (e.features && e.features.length > 0) {
              const bldg = e.features[0].properties;
              setSelectedSpot({
                name: bldg.name,
                category: bldg.category,
                height: `${bldg.height}m`
              });
            }
          });

          map.on("mouseenter", "lpu-3d-buildings-extrusion", () => {
            map.getCanvas().style.cursor = "pointer";
          });
          map.on("mouseleave", "lpu-3d-buildings-extrusion", () => {
            map.getCanvas().style.cursor = "";
          });
        });

        map.on("error", (e) => {
          console.warn("Map event notice:", e);
        });
      } catch (e) {
        console.error("Map initialization failed:", e);
        if (isMounted) {
          setErr("Failed to initialize campus map: " + (e?.message || ""));
        }
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (map) {
        map.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapStyle, is3D]);

  // Add 3D Pin Markers on LPU buildings
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    let isMounted = true;

    const renderMarkers = async () => {
      try {
        const mod = await import("maplibre-gl");
        const maplibregl = mod.default || mod;

        if (!isMounted || !mapInstanceRef.current) return;
        const map = mapInstanceRef.current;

        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];

        locations.forEach((loc) => {
          if (!loc.lat || !loc.lng) return;

          const el = document.createElement("div");
          el.className = "cursor-pointer group relative";

          el.innerHTML = `
            <div class="flex items-center justify-center w-7 h-7 rounded-full border-2 border-black bg-amber-400 hover:bg-orange-500 hover:text-white text-black shadow-[2px_2px_0px_0px_#000] transition-all transform duration-150">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div class="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-white opacity-0 group-hover:opacity-100 transition-opacity z-40 shadow-sm">
              ${loc.name}
            </div>
          `;

          const popupHtml = `
            <div class="p-2 space-y-1.5 max-w-[240px] font-sans">
              <span class="inline-block text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                ${loc.category || "Campus Location"}
              </span>
              <h4 class="text-xs font-black text-slate-900 leading-snug">${loc.name}</h4>
              ${loc.description ? `<p class="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">${loc.description}</p>` : ""}
              <div class="pt-1 border-t border-slate-200 text-[10px] font-bold text-orange-600">
                📍 [${Number(loc.lat).toFixed(4)}, ${Number(loc.lng).toFixed(4)}]
              </div>
            </div>
          `;

          const popup = new maplibregl.Popup({
            offset: 20,
            closeButton: true,
            closeOnClick: false,
            maxWidth: "280px"
          }).setHTML(popupHtml);

          const marker = new maplibregl.Marker({ element: el, anchor: "center" })
            .setLngLat([Number(loc.lng), Number(loc.lat)])
            .setPopup(popup)
            .addTo(map);

          el.addEventListener("click", () => {
            setSelectedSpot(loc);
          });

          markersRef.current.push(marker);
        });
      } catch (e) {
        console.warn("Marker creation notice:", e);
      }
    };

    renderMarkers();

    return () => {
      isMounted = false;
    };
  }, [locations, mapLoaded]);

  // Toggle between 3D Tilt and 2D Plan view
  function toggle3D() {
    if (!mapInstanceRef.current) return;
    const next3D = !is3D;
    setIs3D(next3D);

    mapInstanceRef.current.easeTo({
      pitch: next3D ? 58 : 0,
      bearing: next3D ? -18 : 0,
      duration: 800
    });
  }

  // Toggle Satellite vs Street map tiles
  function toggleTheme() {
    setMapTheme((prev) => (prev === "street" ? "satellite" : "street"));
  }

  // Reset to default LPU campus angle
  function resetCampusView() {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo({
      center: [LPU_CENTER_LNG, LPU_CENTER_LAT],
      zoom: 16.5,
      pitch: 58,
      bearing: -18,
      essential: true
    });
    setIs3D(true);
  }

  // Center on user GPS position
  async function centerOnUser() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = [pos.coords.longitude, pos.coords.latitude];
        const map = mapInstanceRef.current;
        if (!map) return;

        const mod = await import("maplibre-gl");
        const maplibregl = mod.default || mod;

        map.flyTo({ center: coords, zoom: 17.5, pitch: 58, essential: true });

        if (userMarkerRef.current) {
          userMarkerRef.current.setLngLat(coords);
        } else {
          const el = document.createElement("div");
          el.className = "flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-md animate-pulse";
          el.innerHTML = `<div class="w-2.5 h-2.5 rounded-full bg-white"></div>`;
          userMarkerRef.current = new maplibregl.Marker({ element: el }).setLngLat(coords).addTo(map);
        }
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  return (
    <div className="space-y-3">
      {/* 3D Map Canvas - Full Width */}
      <div className="relative rounded-2xl border-4 border-black overflow-hidden bg-slate-100 shadow-neo min-h-[580px] h-[80vh]">
        {/* Floating Controls at Top */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2">
          {/* Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] text-xs font-black text-black">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping inline-block" />
            <span>LPU 3D Campus • 600+ Acres</span>
          </div>

          {/* 3D / 2D Toggle Button */}
          <button
            onClick={toggle3D}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] text-xs font-black transition-all cursor-pointer"
          >
            <Box className="h-3.5 w-3.5" />
            <span>{is3D ? "3D View ON" : "2D Plan View"}</span>
          </button>

          {/* Map Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] text-xs font-black transition-all cursor-pointer"
          >
            <Layers className="h-3.5 w-3.5" />
            <span className="capitalize">{mapTheme === "street" ? "Satellite View" : "Street View"}</span>
          </button>

          {/* Reset Campus View */}
          <button
            onClick={resetCampusView}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] text-xs font-black transition-all cursor-pointer"
            title="Reset full campus view"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset View</span>
          </button>

          {/* Center GPS */}
          <button
            onClick={centerOnUser}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] text-xs font-black transition-all cursor-pointer"
            title="Locate my position on campus"
          >
            <LocateFixed className="h-3.5 w-3.5" />
            <span>Locate Me</span>
          </button>
        </div>

        {err && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-red-50/95 text-red-700 space-y-2">
            <AlertCircle className="h-6 w-6" />
            <p className="text-xs font-semibold">{err}</p>
          </div>
        )}

        {/* Map Container */}
        <div ref={mapElementRef} className="h-full w-full" />
      </div>

      {/* Selected Location Card (If clicked) */}
      {selectedSpot && (
        <div className="card border-slate-200 shadow-sm p-4 text-xs space-y-2 bg-white flex items-center justify-between">
          <div className="space-y-1">
            <span className="inline-block text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
              {selectedSpot.category || "Campus Landmark"}
            </span>
            <h4 className="text-sm font-black text-slate-900">{selectedSpot.name}</h4>
            {selectedSpot.description && (
              <p className="text-slate-600 max-w-2xl leading-relaxed">{selectedSpot.description}</p>
            )}
          </div>
          <button
            onClick={() => setSelectedSpot(null)}
            className="btn bg-slate-100 text-slate-700 hover:bg-slate-200 py-1 px-3 text-xs border-2 border-black"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
