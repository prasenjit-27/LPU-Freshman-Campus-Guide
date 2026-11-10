"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { AlertCircle } from "lucide-react";
import { lpuCampusBoundary, lpu3DBuildings } from "@/data/campus3dBuildings";

// LPU Coordinates & Focus Bounds
const LPU_CENTER_LNG = 75.7042;
const LPU_CENTER_LAT = 31.2536;

export default function MapView() {
  const mapElementRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [err, setErr] = useState("");

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

  return (
    <div className="space-y-3">
      {/* 3D Map Canvas Only */}
      <div className="relative rounded-2xl border-4 border-black overflow-hidden bg-slate-100 shadow-neo min-h-[620px] h-[82vh]">
        {err && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-red-50/95 text-red-700 space-y-2">
            <AlertCircle className="h-6 w-6" />
            <p className="text-xs font-semibold">{err}</p>
          </div>
        )}

        {/* Map Container */}
        <div ref={mapElementRef} className="h-full w-full" />
      </div>
    </div>
  );
}
