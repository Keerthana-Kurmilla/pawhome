import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2 } from 'lucide-react';

export default function LocationPicker({ value, onChange, onCoordsChange }) {
  const [loading, setLoading] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        onCoordsChange?.(latitude, longitude);
        // Reverse geocode using a simple approach
        try {
          const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await resp.json();
          const loc = data.address?.city || data.address?.town || data.address?.village || data.display_name?.split(',').slice(0, 2).join(',');
          onChange(loc || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
        } catch {
          onChange(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
        }
        setLoading(false);
      },
      () => setLoading(false),
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Enter your location"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
      />
      <Button type="button" variant="outline" onClick={detectLocation} disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
      </Button>
    </div>
  );
}