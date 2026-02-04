import { useMemo } from "react";

const MapComponent = ({ locations = [] }) => {
  const markers = useMemo(() => {
    return locations.map((loc) => ({
      lat: loc.latitude,
      lng: loc.longitude,
      id: loc.id,
    }));
  }, [locations]);

  return (
    <div className="w-full h-[400px] bg-gray-100 rounded-md flex items-center justify-center">
      {/* Replace this with your actual map implementation */}
      <p className="text-gray-600">
        Map loaded with {markers.length} locations
      </p>
    </div>
  );
};

export default MapComponent;
