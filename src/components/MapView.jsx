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
  AlertCircle,
  Eye,
  Building,
  Navigation
} from "lucide-react";
import { lpuCampusBoundary, lpu3DBuildings } from "@/data/campus3dBuildings";

// LPU Coordinates & Focus Bounds
const LPU_CENTER_LNG = 75.7042;
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
  const [activeCategory, setActiveCategory] = useState("all");

  // Filtered locations
  const filteredLocations = useMemo(() => {
    if (activeCategory === "all") return locations;
    return locations.filter((loc) => loc.category === activeCategory);
  }, [locations, activeCategory]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(locations.map((l) => l.category).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [locations]);

  // Base map style (Clean keyless OpenStreetMap tiles with custom 3D building extrusions)
  const mapStyle = useMemo(() => {
    const tileUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

    return {
      version: 8,
      name: "LPU 3D Campus Experience",
      sources: {
        "base-tiles": {
          type: "raster",
          tiles: [tileUrl],
          tileSize: 256,
          attribution: "© OpenStreetMap contributors"
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
        // 1. Illustrated 2D Base Map
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
            "fill-color": "#EA580C",
            "fill-opacity": 0.06
          }
        },
        {
          id: "lpu-boundary-stroke",
          type: "line",
          source: "lpu-boundary",
          paint: {
            "line-color": "#EA580C",
            "line-width": 4
          }
        },
        // 3. Vibrant 3D Extruded Building Models with distinct heights and colors
        {
          id: "lpu-3d-buildings-extrusion",
          type: "fill-extrusion",
          source: "lpu-3d-buildings",
          paint: {
            "fill-extrusion-color": [
              "coalesce",
              ["get", "color"],
              "#F59E0B"
            ],
            "fill-extrusion-height": [
              "coalesce",
              ["get", "height"],
              24
            ],
            "fill-extrusion-base": [
              "coalesce",
              ["get", "min_height"],
              0
            ],
            "fill-extrusion-opacity": 0.92
          }
        }
      ]
    };
  }, []);

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

        // Campus boundary bounds
        const LPU_MAX_BOUNDS = [
          [75.6900, 31.2420], // Southwest [lng, lat]
          [75.7200, 31.2650]  // Northeast [lng, lat]
        ];

        map = new maplibregl.Map({
          container: mapElementRef.current,
          style: mapStyle,
          center: [LPU_CENTER_LNG, LPU_CENTER_LAT],
          zoom: 16.6,
          minZoom: 15,
          maxZoom: 19.5,
          pitch: 60,
          bearing: -22,
          maxPitch: 75,
          maxBounds: LPU_MAX_BOUNDS,
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
  }, [mapStyle]);

  // Add 3D Pin Markers on LPU campus landmarks
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    let isMounted = true;

    const renderMarkers = async () => {
      try {
        const mod = await import("maplibre-gl");
        const maplibregl = mod.default || mod;

        if (!isMounted || !mapInstanceRef.current) return;
        const map = mapInstanceRef.current;

        // Clear existing markers
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];

        filteredLocations.forEach((loc) => {
          if (!loc.lat || !loc.lng) return;

          const el = document.createElement("div");
          el.className = "lpu-marker-pin cursor-pointer group flex flex-col items-center select-none";
          el.style.zIndex = "30";

          // Neo-brutalist 3D floating tag with pointer
          el.innerHTML = `
            <div class="flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-black bg-amber-300 text-black font-extrabold text-[12px] shadow-[3px_3px_0px_0px_#000] hover:bg-orange-500 hover:text-white transition-all transform hover:scale-110 active:translate-x-0.5 active:translate-y-0.5 whitespace-nowrap">
              <span class="w-2 h-2 rounded-full bg-red-600 border border-black animate-pulse"></span>
              <span>${loc.name.split('(')[0].trim()}</span>
            </div>
            <div class="w-2 h-3 bg-black -mt-0.5"></div>
            <div class="w-3 h-1.5 bg-black/50 rounded-full blur-[0.5px]"></div>
          `;

          const popupHtml = `
            <div class="p-2.5 space-y-2 max-w-[260px] font-sans">
              <span class="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                ${loc.category || "Campus Location"}
              </span>
              <h4 class="text-xs font-black text-slate-900 leading-snug">${loc.name}</h4>
              ${loc.description ? `<p class="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">${loc.description}</p>` : ""}
              <div class="pt-1.5 border-t border-slate-200 flex items-center justify-between text-[11px] font-bold text-orange-600">
                <span>📍 Lat ${Number(loc.lat).toFixed(4)}, Lng ${Number(loc.lng).toFixed(4)}</span>
              </div>
            </div>
          `;

          const popup = new maplibregl.Popup({
            offset: 24,
            closeButton: true,
            closeOnClick: false,
            maxWidth: "300px"
          }).setHTML(popupHtml);

          const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
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
  }, [filteredLocations, mapLoaded]);

  // Toggle between 3D Isometric View and 2D Plan View
  function toggle3D() {
    if (!mapInstanceRef.current) return;
    const next3D = !is3D;
    setIs3D(next3D);

    mapInstanceRef.current.easeTo({
      pitch: next3D ? 60 : 0,
      bearing: next3D ? -22 : 0,
      duration: 800
    });
  }

  // Reset to default LPU campus isometric angle
  function resetCampusView() {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo({
      center: [LPU_CENTER_LNG, LPU_CENTER_LAT],
      zoom: 16.6,
      pitch: 60,
      bearing: -22,
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

        map.flyTo({ center: coords, zoom: 17.5, pitch: 60, essential: true });

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

  // Focus on specific location
  function flyToLocation(loc) {
    if (!mapInstanceRef.current || !loc.lat || !loc.lng) return;
    setSelectedSpot(loc);
    mapInstanceRef.current.flyTo({
      center: [Number(loc.lng), Number(loc.lat)],
      zoom: 17.5,
      pitch: 60,
      duration: 1000,
      essential: true
    });
  }

  return (
    <div className="space-y-3">
      {/* Category Filter Pills & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-3 rounded-xl border-3 border-black shadow-neo">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-black uppercase text-black flex items-center gap-1 mr-1">
            <Building className="h-3.5 w-3.5 text-lpu-orange" />
            Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 text-xs font-black rounded-lg border-2 border-black transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-black text-white shadow-neo-sm scale-105"
                  : "bg-white text-black hover:bg-amber-100"
              }`}
            >
              {cat === "all" ? "All Blocks & Places" : cat}
            </button>
          ))}
        </div>

        {/* View mode toggle button */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggle3D}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-black text-xs font-black shadow-neo-sm cursor-pointer transition-all ${
              is3D ? "bg-lpu-yellow text-black" : "bg-white text-black hover:bg-slate-100"
            }`}
          >
            <Box className="h-3.5 w-3.5" />
            <span>{is3D ? "3D Mode ON" : "Switch to 3D"}</span>
          </button>

          <button
            onClick={resetCampusView}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border-2 border-black bg-white hover:bg-slate-100 text-xs font-black shadow-neo-sm cursor-pointer"
            title="Reset Campus View"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={centerOnUser}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border-2 border-black bg-white hover:bg-slate-100 text-xs font-black shadow-neo-sm cursor-pointer"
            title="My Location"
          >
            <LocateFixed className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">GPS</span>
          </button>
        </div>
      </div>

      {/* 3D Map Canvas */}
      <div className="relative rounded-2xl border-4 border-black overflow-hidden bg-slate-100 shadow-neo min-h-[580px] h-[78vh]">
        {/* Floating Quick Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-black rounded-lg shadow-neo-sm text-xs font-black text-black">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
            <span>LPU 3D Campus • {filteredLocations.length} Places Marked</span>
          </div>
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

      {/* Selected Location Card */}
      {selectedSpot && (
        <div className="rounded-xl border-3 border-black shadow-neo p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              {selectedSpot.category || "Campus Landmark"}
            </span>
            <h4 className="text-base font-black text-slate-900">{selectedSpot.name}</h4>
            {selectedSpot.description && (
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">{selectedSpot.description}</p>
            )}
            {selectedSpot.lat && selectedSpot.lng && (
              <p className="text-[11px] font-bold text-orange-600">
                Coordinates: {Number(selectedSpot.lat).toFixed(4)}, {Number(selectedSpot.lng).toFixed(4)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedSpot.lat && selectedSpot.lng && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedSpot.lat},${selectedSpot.lng}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border-2 border-black bg-lpu-yellow hover:bg-lpu-orange hover:text-white font-black text-xs shadow-neo-sm transition-all"
              >
                <Navigation className="h-3.5 w-3.5" />
                <span>Get Directions</span>
              </a>
            )}
            <button
              onClick={() => setSelectedSpot(null)}
              className="px-3 py-1.5 rounded-lg border-2 border-black bg-slate-100 hover:bg-slate-200 text-xs font-black shadow-neo-sm cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Quick Jump Bar for Freshman Key Locations */}
      <div className="bg-white p-3 rounded-xl border-3 border-black shadow-neo space-y-2">
        <p className="text-xs font-black uppercase text-black flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-lpu-orange" />
          Quick Jump to Campus Block / Location:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {locations.map((loc) => (
            <button
              key={loc._id || loc.name}
              onClick={() => flyToLocation(loc)}
              className="px-2.5 py-1 text-[11px] font-extrabold rounded-md border-2 border-black bg-slate-50 hover:bg-lpu-yellow text-slate-900 transition-all cursor-pointer shadow-neo-sm"
            >
              📍 {loc.name.split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
