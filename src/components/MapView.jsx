"use client";
import { useEffect, useMemo, useRef, useState } from "react";
const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
export default function MapView({ locations, signedIn, savedIds }) {
  const el = useRef(null), mapRef = useRef(null), dirRef = useRef(null);
  const [err, setErr] = useState(key ? "" : "Google Maps key not configured. Showing the list only.");
  const [sel, setSel] = useState(null);
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [saved, setSaved] = useState(savedIds);
  const [from, setFrom] = useState(""), [to, setTo] = useState("");
  const [note, setNote] = useState("");
  const cats = useMemo(() => ["all", ...new Set(locations.map((l) => l.category))], [locations]);
  const shown = locations.filter((l) => (cat === "all" || l.category === cat) && l.name.toLowerCase().includes(q.toLowerCase()));
  useEffect(() => {
    if (!key || locations.length === 0) return;
    const init = () => {
      const map = new google.maps.Map(el.current, { center: { lat: locations[0].lat, lng: locations[0].lng }, zoom: 16 });
      mapRef.current = map;
      dirRef.current = new google.maps.DirectionsRenderer({ map });
      locations.forEach((l) => new google.maps.Marker({ position: { lat: l.lat, lng: l.lng }, map, title: l.name }).addListener("click", () => setSel(l)));
    };
    if (window.google?.maps) return init();
    const sc = document.createElement("script");
    sc.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
    sc.async = true; sc.onload = init; sc.onerror = () => setErr("Google Maps failed to load. Check the API key and restrictions.");
    document.head.appendChild(sc);
  }, [locations]);
  const go = (l) => { setSel(l); mapRef.current?.panTo({ lat: l.lat, lng: l.lng }); };
  async function toggleSave(l) {
    const r = await fetch("/api/saved", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ locationId: l._id }) });
    if (r.ok) { const { saved: on } = await r.json(); setSaved((s) => (on ? [...s, l._id] : s.filter((x) => x !== l._id))); }
  }
  function route() {
    const a = locations.find((l) => l._id === from), b = locations.find((l) => l._id === to);
    if (!a || !b || !window.google) return setNote("Pick two locations and make sure the map is loaded.");
    new google.maps.DirectionsService().route({ origin: { lat: a.lat, lng: a.lng }, destination: { lat: b.lat, lng: b.lng }, travelMode: "WALKING" }, (res, st) => {
      if (st === "OK") { dirRef.current.setDirections(res); setNote("Route from Google Maps. Approximate, outdoor only."); } else setNote(`No route found (${st}).`);
    });
  }
  function nearMe() {
    navigator.geolocation?.getCurrentPosition((p) => mapRef.current?.panTo({ lat: p.coords.latitude, lng: p.coords.longitude }), () => setNote("Location permission denied."));
  }
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="card max-h-[75vh] space-y-2 overflow-auto md:col-span-1">
        <input className="input" aria-label="Filter locations" placeholder="Filter by name" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input" aria-label="Category" value={cat} onChange={(e) => setCat(e.target.value)}>{cats.map((c) => <option key={c}>{c}</option>)}</select>
        {locations.length === 0 && <p className="text-sm">No verified locations yet.</p>}
        <ul className="space-y-1">{shown.map((l) => <li key={l._id} className="flex justify-between text-sm"><button className={`text-left hover:underline ${sel?._id === l._id ? "font-bold" : ""}`} onClick={() => go(l)}>{l.name}</button>{signedIn && <button aria-label={`Save ${l.name}`} onClick={() => toggleSave(l)}>{saved.includes(l._id) ? "★" : "☆"}</button>}</li>)}</ul>
        {locations.length > 1 && <div className="space-y-1 border-t pt-2 text-sm"><b>Directions</b>
          <select className="input" aria-label="From" value={from} onChange={(e) => setFrom(e.target.value)}><option value="">From…</option>{locations.map((l) => <option key={l._id} value={l._id}>{l.name}</option>)}</select>
          <select className="input" aria-label="To" value={to} onChange={(e) => setTo(e.target.value)}><option value="">To…</option>{locations.map((l) => <option key={l._id} value={l._id}>{l.name}</option>)}</select>
          <button className="btn" onClick={route}>Get route</button></div>}
        <button className="text-sm underline" onClick={nearMe}>Center on my location</button>
        {note && <p role="status" className="text-xs">{note}</p>}
      </div>
      <div className="md:col-span-2">
        {err ? <p className="card text-sm" role="alert">{err}</p> : <div ref={el} className="h-[75vh] w-full rounded-xl border" />}
        {sel && <div className="card mt-3 text-sm"><b>{sel.name}</b> ({sel.category}) — {sel.description} <a className="underline" href={`https://www.google.com/maps/dir/?api=1&destination=${sel.lat},${sel.lng}`} target="_blank" rel="noreferrer">Open in Google Maps</a><br /><a className="text-xs underline" href={sel.sourceUrl} target="_blank" rel="noreferrer">{sel.sourceName}</a> · {sel.verificationStatus}</div>}
      </div>
    </div>
  );
}
