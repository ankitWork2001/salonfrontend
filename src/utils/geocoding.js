// import Geocoder from 'react-native-geocoding';

// // Initialize once with your Google Maps API key
// Geocoder.init('YOUR_GOOGLE_MAPS_API_KEY');

// export const getAddressFromCoords = async (latitude, longitude) => {
//   try {
//     const json = await Geocoder.from(latitude, longitude);
//     const address = json.results[0]?.formatted_address || '';
//     return address;
//   } catch (error) {
//     console.warn('Geocoding error:', error);
//     return '';
//   }
// };

import axios from "axios";

export const getAddressFromCoords = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse`,
      {
        params: {
          format: "jsonv2",
          lat: latitude,
          lon: longitude,
        },
        headers: {
          "User-Agent": "MyAwesomeApp/1.0", // Required by Nominatim
          "Accept-Language": "en",
        },
      }
    );

    if (response.data && response.data.display_name) {
      return response.data.display_name;
    } else {
      return "Unknown location";
    }
  } catch (error) {
    console.error("Error fetching address:", error.response?.data || error.message);
    return "Unknown location";
  }
};



