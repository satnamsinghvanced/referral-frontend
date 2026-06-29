import { DirectionsParams, MapboxDirectionsResponse } from "../types/mapbox";
import axios from "./axios";

const BASE_URL = "https://api.mapbox.com/directions/v5/mapbox/driving/";

export const getDirections = async (
  params: DirectionsParams
): Promise<MapboxDirectionsResponse> => {
  if (!params.coordinates) {
    throw new Error("Coordinates are required for directions API.");
  }

  const { data } = await axios.get<MapboxDirectionsResponse>(
    `${BASE_URL}${params.coordinates}`,
    {
      params: {
        alternatives: true,
        annotations: "distance",
        geometries: "geojson",
        overview: "full",
        steps: false,
        access_token: import.meta.env.VITE_MAPBOX_API_KEY,
      },
    }
  );

  if (data.code !== "Ok") {
    throw new Error(`Mapbox API Error: ${data.code}`);
  }

  return data;
};
