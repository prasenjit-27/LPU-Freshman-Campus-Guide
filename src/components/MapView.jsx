"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";
import { 
  Search, 
  MapPin, 
  Navigation, 
  Star, 
  AlertCircle, 
  ExternalLink, 
  Compass, 
  LocateFixed, 
  Route, 
  CheckCircle2, 
  Info 
} from "lucide-react";

export default function MapView({ locations = [], signedIn = false, savedIds = [] }) {
  const mapElementRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const dirRendererRef = useRef(null);
  const markersRef = useRef([]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const [mapLoaded, setMapLoaded] = useState(false);
  const [err, setErr] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [saved, setSaved] = useState(savedIds);
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [routingInProgress, setRoutingInProgress] = useState(false);

  // Extract categories dynamically
  const categories = useMemo(() => {
    return ["all", ...new Set(locations.map((l) => l.category).filter(Boolean))];
  }, [locations]);

  // Filter locations
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      const matchCat = activeCategory === "all" || loc.category === activeCategory;
      const matchQuery = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (loc.description && loc.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [locations, activeCategory, searchQuery]);

  // Initialize Map once window.google is ready
  const initializeMap = () => {
    if (!window.google?.maps || !mapElementRef.current) return;

    try {
      // Default center: LPU Campus or first location
      const defaultCenter = locations.length > 0 && locations[0].lat && locations[0].lng
        ? { lat: Number(locations[0].lat), lng: Number(locations[0].lng) }
        : { lat: 31.2536, lng: 75.7037 }; // LPU Phagwara coordinates

      const map = new window.google.maps.Map(mapElementRef.current, {
        center: defaultCenter,
        zoom: 16,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });

      mapInstanceRef.current = map;
      dirRendererRef.current = new window.google.maps.DirectionsRenderer({ map });

      // Clean existing markers
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];

      // Add markers
      locations.forEach((loc) => {
        if (!loc.lat || !loc.lng) return;
        const marker = new window.google.maps.Marker({
          position: { lat: Number(loc.lat), lng: Number(loc.lng) },
          map,
          title: loc.name,
          animation: window.google.maps.Animation.DROP,
        });

        marker.addListener("click", () => {
          setSelectedLocation(loc);
        });

        markersRef.current.push(marker);
      });

      setMapLoaded(true);
    } catch (e) {
      console.error("Map initialization failed:", e);
      setErr("Failed to initialize Google Maps. Please check browser console.");
    }
  };

  useEffect(() => {
    if (window.google?.maps && mapElementRef.current && !mapInstanceRef.current) {
      initializeMap();
    }
  }, [locations]);

  // Pan to location
  function focusLocation(loc) {
    setSelectedLocation(loc);
    if (mapInstanceRef.current && loc.lat && loc.lng) {
      mapInstanceRef.current.panTo({ lat: Number(loc.lat), lng: Number(loc.lng) });
      mapInstanceRef.current.setZoom(17);
    }
  }

  // Toggle saved spot
  async function toggleSave(loc) {
    if (!signedIn) return;
    try {
      const r = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId: loc._id }),
      });
      if (r.ok) {
        const { saved: isSaved } = await r.json();
        setSaved((prev) => (isSaved ? [...prev, loc._id] : prev.filter((id) => id !== loc._id)));
      }
    } catch {
      setStatusMessage("Could not update bookmark.");
    }
  }

  // Calculate walking directions
  function calculateRoute() {
    const originLoc = locations.find((l) => l._id === fromId);
    const destLoc = locations.find((l) => l._id === toId);

    if (!originLoc || !destLoc) {
      setStatusMessage("Please select both starting point and destination.");
      return;
    }

    if (!window.google?.maps) {
      setStatusMessage("Map service is not active. Walking directions unavailable.");
      return;
    }

    setRoutingInProgress(true);
    setStatusMessage("");

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: { lat: Number(originLoc.lat), lng: Number(originLoc.lng) },
        destination: { lat: Number(destLoc.lat), lng: Number(destLoc.lng) },
        travelMode: window.google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        setRoutingInProgress(false);
        if (status === "OK") {
          dirRendererRef.current.setDirections(result);
          setStatusMessage("Calculated outdoor walking path.");
        } else {
          setStatusMessage(`No walking route found (${status}).`);
        }
      }
    );
  }

  // Geolocation centering
  function centerOnUser() {
    if (!navigator.geolocation) {
      setStatusMessage("Geolocation not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo(coords);
          mapInstanceRef.current.setZoom(17);
          new window.google.maps.Marker({
            position: coords,
            map: mapInstanceRef.current,
            title: "Your Location",
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 7,
              fillColor: "#4f46e5",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            },
          });
        }
        setStatusMessage("Centered on your current location.");
      },
      () => {
        setStatusMessage("Location access denied or unavailable.");
      }
    );
  }

  return (
    <>
      {/* Safely inject Google Maps JavaScript API via Next.js Script */}
      {apiKey && (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
          strategy="lazyOnload"
          onLoad={initializeMap}
          onError={() => setErr("Google Maps script failed to load. Check API restrictions & billing.")}
        />
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left Side: Directory, Search, Filters & Directions */}
        <div className="card border-slate-200 shadow-sm p-4 space-y-4 lg:col-span-1 max-h-[80vh] flex flex-col">
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                className="input pl-9 text-xs"
                placeholder="Search campus buildings, blocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="input text-xs"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              aria-label="Filter by category"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All Categories" : c.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Locations List */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1 divide-y divide-slate-100">
            {filteredLocations.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                {locations.length === 0 ? "No verified locations found in database." : "No locations match your filter."}
              </p>
            ) : (
              filteredLocations.map((loc) => {
                const isSelected = selectedLocation?._id === loc._id;
                const isSaved = saved.includes(loc._id);
                return (
                  <div
                    key={loc._id}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                      isSelected ? "bg-indigo-50 font-semibold text-indigo-900" : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <button
                      onClick={() => focusLocation(loc)}
                      className="flex-1 text-left truncate flex items-center gap-1.5"
                    >
                      <MapPin className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-indigo-600" : "text-slate-400"}`} />
                      <span className="truncate">{loc.name}</span>
                    </button>

                    {signedIn && (
                      <button
                        onClick={() => toggleSave(loc)}
                        className={`p-1 rounded hover:bg-slate-200/50 transition-colors ${
                          isSaved ? "text-amber-500" : "text-slate-300 hover:text-slate-500"
                        }`}
                        title={isSaved ? "Remove bookmark" : "Save location"}
                      >
                        <Star className="h-3.5 w-3.5 fill-current" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Directions Tool */}
          {locations.length > 1 && (
            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <Route className="h-3.5 w-3.5 text-indigo-600" />
                Walking Route Finder
              </span>

              <div className="grid grid-cols-2 gap-1.5">
                <select
                  value={fromId}
                  onChange={(e) => setFromId(e.target.value)}
                  className="input text-xs"
                  aria-label="Starting location"
                >
                  <option value="">Start from...</option>
                  {locations.map((l) => (
                    <option key={l._id} value={l._id}>{l.name}</option>
                  ))}
                </select>

                <select
                  value={toId}
                  onChange={(e) => setToId(e.target.value)}
                  className="input text-xs"
                  aria-label="Destination location"
                >
                  <option value="">Destination...</option>
                  {locations.map((l) => (
                    <option key={l._id} value={l._id}>{l.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={calculateRoute}
                  disabled={routingInProgress}
                  className="btn py-1.5 px-3 text-xs flex-1 justify-center"
                >
                  {routingInProgress ? "Calculating..." : "Get Walking Route"}
                </button>
                <button
                  onClick={centerOnUser}
                  className="btn bg-slate-100 text-slate-700 hover:bg-slate-200 py-1.5 px-2.5 text-xs"
                  title="Center map on my GPS location"
                >
                  <LocateFixed className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {statusMessage && (
            <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100">
              {statusMessage}
            </p>
          )}
        </div>

        {/* Right Side: Map Canvas & Location Details */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 shadow-sm min-h-[550px] h-[75vh]">
            {!apiKey && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-slate-50/95 space-y-3">
                <div className="rounded-full bg-amber-100 p-3 text-amber-600">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Google Maps API Key Not Configured</h4>
                <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
                  The interactive canvas requires an active <code className="bg-slate-200 px-1 py-0.5 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>. You can still use the verified building directory on the left.
                </p>
              </div>
            )}

            {err && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-red-50/95 text-red-700 space-y-2">
                <AlertCircle className="h-6 w-6" />
                <p className="text-xs font-semibold">{err}</p>
              </div>
            )}

            <div ref={mapElementRef} className="h-full w-full" />
          </div>

          {/* Selected Location Card */}
          {selectedLocation && (
            <div className="card border-slate-200 shadow-sm p-4 text-xs space-y-2 bg-white">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{selectedLocation.name}</h4>
                  <span className="text-[11px] text-indigo-600 font-semibold capitalize">{selectedLocation.category}</span>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.lat},${selectedLocation.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn bg-indigo-50 text-indigo-700 hover:bg-indigo-100 py-1 px-2.5 text-[11px] font-medium flex items-center gap-1"
                >
                  <span>Open in Google Maps App</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {selectedLocation.description && (
                <p className="text-slate-600 leading-relaxed">{selectedLocation.description}</p>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Verification: <strong className="text-slate-600 capitalize">{selectedLocation.verificationStatus || "verified"}</strong></span>
                {selectedLocation.sourceUrl && (
                  <a href={selectedLocation.sourceUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                    {selectedLocation.sourceName || "Source Link"}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
