"use client";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { LatLngExpression, LatLng } from "leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

interface MapProps {
  center: LatLngExpression;
  onClick: (lat: number, lng: number) => void;
  setLocationName: (name: string) => void; // New prop for setting location name
}

const Map: React.FC<MapProps> = ({ center, onClick, setLocationName }) => {
  const [position, setPosition] = useState<LatLngExpression | null>(null);

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl:
        "https://cdn.icon-icons.com/icons2/936/PNG/512/map-marker_icon-icons.com_73495.png",
      iconRetinaUrl:
        "https://cdn.icon-icons.com/icons2/936/PNG/512/map-marker_icon-icons.com_73495.png",
      iconSize: [25, 25],
      iconAnchor: [12, 12],
      popupAnchor: [1, -1],
      shadowUrl: null,
    });
  }, []);

  const fetchPlaceName = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      const placeName = data.display_name || "Unknown location";
      setLocationName(placeName);
    } catch (error) {
      console.error("Error fetching place name:", error);
      setLocationName("Unknown location");
    }
  };

  const handleClick = (latlng: LatLng) => {
    setPosition(latlng);
    onClick(latlng.lat, latlng.lng);
    fetchPlaceName(latlng.lat, latlng.lng);
    console.log(`Latitude: ${latlng.lat}, Longitude: ${latlng.lng}`);
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        handleClick(e.latlng);
      },
    });
    return null;
  };

  const ChangeView = ({ center }: { center: LatLngExpression }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center);
    }, [center, map]);
    return null;
  };

  return (
    <MapContainer center={center} zoom={10} className="h-[50vh] w-full">
      <ChangeView center={center} />
      <TileLayer
        url={`https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=${process.env.NEXT_PUBLIC_MAP_API_KEY}`}
      />
      {position && <Marker position={position} />}
      <MapClickHandler />
    </MapContainer>
  );
};

export default Map;
