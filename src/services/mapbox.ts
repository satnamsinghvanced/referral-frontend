import axios from "axios";
import { DirectionsParams, MapboxDirectionsResponse } from "../types/mapbox";

const BASE_URL = "https://api.mapbox.com/directions/v5/mapbox/driving/";

export const getDirections = async (
  params: DirectionsParams
): Promise<MapboxDirectionsResponse> => {
  if (!params.coordinates) {
    throw new Error("Coordinates are required for directions API.");
  }

  // The structure of the URL provided in the prompt already includes query parameters.
  // We'll follow that pattern but use Axios params for cleaner management.

  const response = await axios.get<MapboxDirectionsResponse>(
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
      // You can add headers here if necessary
    }
  );

  // Basic error check for Mapbox API status
  if (response.data.code !== "Ok") {
    throw new Error(`Mapbox API Error: ${response.data.code}`);
  }

  return response.data;
};
