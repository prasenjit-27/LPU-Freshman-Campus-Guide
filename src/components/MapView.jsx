"use client";
import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { AlertCircle, Navigation, MapPin } from "lucide-react";

// LPU Campus Center Coordinates
const LPU_CENTER_LNG = 75.7042;
const LPU_CENTER_LAT = 31.2536;

export default function MapView({ locations = [] }) {
  const mapElementRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [err, setErr] = useState("");
  const [selectedSpot, setSelectedSpot] = useState(null);

  useEffect(() => {
    if (!mapElementRef.current) return;

    let isMounted = true;
    let map = null;

    const initMap = async () => {
      try {
        const mod = await import("maplibre-gl");
        const maplibregl = mod.default || mod;

        if (!isMounted || !mapElementRef.current) return;

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const mapStyle = {
          version: 8,
          name: "LPU Campus Map",
          sources: {
            "osm-tiles": {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "© OpenStreetMap contributors"
            }
          },
          layers: [
            {
              id: "osm-tiles-layer",
              type: "raster",
              source: "osm-tiles",
              minzoom: 0,
              maxzoom: 20
            }
          ]
        };

        const LPU_MAX_BOUNDS = [
          [75.6850, 31.2380], // Southwest [lng, lat]
          [75.7250, 31.2680]  // Northeast [lng, lat]
        ];

        map = new maplibregl.Map({
          container: mapElementRef.current,
          style: mapStyle,
          center: [LPU_CENTER_LNG, LPU_CENTER_LAT],
          zoom: 16.2,
          minZoom: 14.5,
          maxZoom: 19.5,
          pitch: 0,
          bearing: 0,
          maxBounds: LPU_MAX_BOUNDS,
          attributionControl: false
        });

        map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
        map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");

        map.on("load", () => {
          if (!isMounted) return;
          mapInstanceRef.current = map;

          // Render clean location pins on map
          markersRef.current.forEach((m) => m.remove());
          markersRef.current = [];

          locations.forEach((loc) => {
            if (!loc.lat || !loc.lng) return;

            const el = document.createElement("div");
            el.className = "cursor-pointer group flex flex-col items-center select-none";
            el.style.zIndex = "20";

            el.innerHTML = `
              <div style="background-color:#FFB800; color:#000; font-weight:800; font-size:11px; padding:3px 8px; border-radius:6px; border:2px solid #000; box-shadow:2px 2px 0px 0px #000; white-space:nowrap; display:flex; align-items:center; gap:4px;">
                <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background-color:#DC2626;"></span>
                <span>${loc.name.split('(')[0].trim()}</span>
              </div>
              <div style="width:2px; height:6px; background-color:#000;"></div>
            `;

            el.addEventListener("click", () => {
              setSelectedSpot(loc);
              map.flyTo({
                center: [loc.lng, loc.lat],
                zoom: 17,
                essential: true
              });
            });

            const marker = new maplibregl.Marker({ element: el })
              .setLngLat([loc.lng, loc.lat])
              .addTo(map);

            markersRef.current.push(marker);
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
      if (markersRef.current) {
        markersRef.current.forEach((m) => m.remove());
      }
      if (map) {
        map.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations]);

  return (
    <div className="space-y-4">
      {/* 2D Map Canvas */}
      <div className="relative rounded-2xl border-4 border-black overflow-hidden bg-slate-100 shadow-neo min-h-[600px] h-[78vh]">
        {err && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-red-50/95 text-red-700 space-y-2">
            <AlertCircle className="h-6 w-6" />
            <p className="text-xs font-semibold">{err}</p>
          </div>
        )}

        {/* Floating Marker Count Badge */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-black rounded-lg shadow-neo-sm text-xs font-black text-black">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>{locations.length} Campus Locations Marked</span>
          </div>
        </div>

        <div ref={mapElementRef} className="h-full w-full" />
      </div>

      {/* Selected Location Info Card */}
      {selectedSpot && (
        <div className="rounded-xl border-3 border-black shadow-neo p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded border border-black bg-lpu-yellow text-black">
              {selectedSpot.category || "Campus Landmark"}
            </span>
            <h4 className="text-base font-black text-black">{selectedSpot.name}</h4>
            {selectedSpot.description && (
              <p className="text-xs font-semibold text-black/75 max-w-2xl leading-relaxed">
                {selectedSpot.description}
              </p>
            )}
            {selectedSpot.lat && selectedSpot.lng && (
              <p className="text-[11px] font-bold text-lpu-orange">
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

      {/* Quick Jump Bar to Campus Locations */}
      <div className="bg-white p-3.5 rounded-xl border-3 border-black shadow-neo space-y-2">
        <p className="text-xs font-black uppercase text-black flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-lpu-orange" />
          Campus Blocks & Key Locations:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {locations.map((loc) => (
            <button
              key={loc._id || loc.name}
              onClick={() => {
                setSelectedSpot(loc);
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.flyTo({
                    center: [loc.lng, loc.lat],
                    zoom: 17,
                    essential: true
                  });
                }
              }}
              className="px-2.5 py-1 text-[11px] font-bold rounded-md border-2 border-black bg-white hover:bg-lpu-yellow text-black transition-all cursor-pointer shadow-neo-sm"
            >
              📍 {loc.name.split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
