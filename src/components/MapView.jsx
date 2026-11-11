"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import "maplibre-gl/dist/maplibre-gl.css";
import { AlertCircle, Navigation, MapPin } from "lucide-react";

// LPU Campus Center Coordinates
const LPU_CENTER_LNG = 75.7042;
const LPU_CENTER_LAT = 31.2536;

export default function MapView({ locations = [] }) {
  const searchParams = useSearchParams();
  const spotParam = searchParams.get("spot");

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

        // Check if there is an initial target spot from query param
        const initialTarget = spotParam
          ? locations.find((l) =>
              l.name.toLowerCase().includes(spotParam.toLowerCase()) ||
              spotParam.toLowerCase().includes(l.name.split("(")[0].trim().toLowerCase())
            )
          : null;

        const initialCenter = initialTarget && initialTarget.lat && initialTarget.lng
          ? [initialTarget.lng, initialTarget.lat]
          : [LPU_CENTER_LNG, LPU_CENTER_LAT];

        const initialZoom = initialTarget ? 17.5 : 16.2;

        if (initialTarget) {
          setSelectedSpot(initialTarget);
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
          center: initialCenter,
          zoom: initialZoom,
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

          // Clear existing markers
          markersRef.current.forEach((m) => m.remove());
          markersRef.current = [];

          locations.forEach((loc) => {
            if (!loc.lat || !loc.lng) return;

            const isHighlighted = initialTarget && initialTarget.name === loc.name;

            const el = document.createElement("div");
            el.className = "cursor-pointer group flex flex-col items-center select-none";
            el.style.zIndex = isHighlighted ? "35" : "25";

            el.innerHTML = `
              <div style="background-color:${isHighlighted ? "#EA580C" : "#FFB800"}; color:${isHighlighted ? "#fff" : "#000"}; font-weight:900; font-size:11px; padding:3px 8px; border-radius:6px; border:2px solid #000; box-shadow:2px 2px 0px 0px #000; white-space:nowrap; display:flex; align-items:center; gap:5px; transform:translateY(-1px);">
                <span style="display:inline-block; width:7px; height:7px; border-radius:50%; background-color:${isHighlighted ? "#fff" : "#DC2626"}; border:1px solid #000;"></span>
                <span>${loc.name.split('(')[0].trim()}</span>
              </div>
              <div style="width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-top:6px solid #000; margin-top:-1px;"></div>
            `;

            el.addEventListener("click", (e) => {
              e.stopPropagation();
              setSelectedSpot(loc);
              map.flyTo({
                center: [loc.lng, loc.lat],
                zoom: 17.2,
                essential: true
              });
            });

            const marker = new maplibregl.Marker({
              element: el,
              anchor: "bottom"
            })
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
  }, [locations, spotParam]);

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

        <div ref={mapElementRef} className="h-full w-full" />
      </div>

      {/* Selected Location Info Card */}
      {selectedSpot && (
        <div className="rounded-xl border-3 border-black shadow-neo p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
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
                Coordinates: {Number(selectedSpot.lat).toFixed(5)}, {Number(selectedSpot.lng).toFixed(5)}
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

      {/* Quick Jump Grid — uniform alignment */}
      <div className="bg-white p-3.5 rounded-xl border-3 border-black shadow-neo space-y-2">
        <p className="text-xs font-black uppercase text-black flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-lpu-orange" />
          Campus Blocks &amp; Key Locations:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5">
          {locations.map((loc) => (
            <button
              key={loc._id || loc.name}
              onClick={() => {
                setSelectedSpot(loc);
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.flyTo({
                    center: [loc.lng, loc.lat],
                    zoom: 17.2,
                    essential: true
                  });
                }
              }}
              className="px-2.5 py-1.5 text-[11px] font-bold rounded-md border-2 border-black bg-white hover:bg-lpu-yellow text-black transition-all cursor-pointer shadow-neo-sm text-left truncate"
            >
              📍 {loc.name.split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
