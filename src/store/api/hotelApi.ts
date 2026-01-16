import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import CryptoJS from 'crypto-js';

export interface Hotel {
  id: string;
  name: string;
  price: number;
  rating: number;
  location: string;
  image: string;
  description: string;
  amenities: string[];
}

export interface SearchParams {
  location: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
}

const HOTELBEDS_BASE_URL = '/hotelbeds-api';

/**
 * Generates Hotelbeds headers
 */
const getHotelbedsHeaders = () => {
  const apiKey = (import.meta.env.VITE_HOTELBEDS_API_KEY || '').trim();
  const secret = (import.meta.env.VITE_HOTELBEDS_API_SECRET || '').trim();

  if (!apiKey || !secret) return null;

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = CryptoJS.SHA256(apiKey + secret + timestamp).toString(
    CryptoJS.enc.Hex
  );

  return {
    'Api-Key': apiKey,
    'X-Signature': signature,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
};

/**
 * 🔥 Dynamic destination resolver (cached)
 */
const getDestinationCode = async (
  location: string,
  headers: HeadersInit
): Promise<string | null> => {
  const normalized = location.toLowerCase().trim();
  if (!normalized) return 'PAR';

  // 1. Check Smart Dictionary first for instant high-quality matches
  const cityMap: Record<string, string> = {
    'london': 'LON',
    'paris': 'PAR',
    'new york': 'NYC',
    'dubai': 'DXB',
    'tokyo': 'TYO',
    'singapore': 'SIN',
    'barcelona': 'BCN',
    'madrid': 'MAD',
    'rome': 'ROM',
    'berlin': 'BER',
    'amsterdam': 'AMS',
    'bangkok': 'BKK',
    'mumbai': 'BOM',
    'delhi': 'DEL',
    'sydney': 'SYD'
  };

  if (cityMap[normalized]) return cityMap[normalized];

  try {
    const cacheKey = `hb_dest_${normalized}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;

    // 2. Fetch from Content API (limited to 200)
    const res = await fetch(
      `${HOTELBEDS_BASE_URL}/hotel-content-api/1.0/locations/destinations?language=ENG&from=1&to=200`,
      { headers }
    );

    const data = await res.json();

    if (data?.destinations) {
      const match = data.destinations.find((d: any) =>
        d.name.toLowerCase().includes(normalized) || 
        normalized.includes(d.name.toLowerCase())
      );

      if (match) {
        localStorage.setItem(cacheKey, match.code);
        return match.code;
      }
    }

    // 3. Last Resort: First 3 letters (Standard Hotelbeds Format)
    // Most major hubs use the first 3 letters of the city name
    const fallbackCode = normalized.substring(0, 3).toUpperCase();
    return fallbackCode;
  } catch (err) {
    console.error('Destination lookup failed:', err);
    return normalized.substring(0, 3).toUpperCase();
  }
};

export const hotelApi = createApi({
  reducerPath: 'hotelApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    searchHotels: builder.query<Hotel[], SearchParams>({
      queryFn: async (params) => {
        const headers = getHotelbedsHeaders() as any;

        if (!headers) {
          return { data: getMockHotels(params.location) };
        }

        try {
          const today = new Date().toISOString().split('T')[0];

          const formatDate = (date: any) => {
            if (!date) return today;
            const d = new Date(date);
            return d.toISOString().split('T')[0];
          };

          const checkIn = formatDate(params.checkIn);
          const checkOut = formatDate(params.checkOut);

          // ✅ Dynamic destination code
          const destCode = await getDestinationCode(params.location, headers);

          const response = await fetch(
            `${HOTELBEDS_BASE_URL}/hotel-api/1.0/hotels`,
            {
              method: 'POST',
              headers,
              body: JSON.stringify({
                stay: { checkIn, checkOut },
                occupancies: [
                  {
                    rooms: 1,
                    adults: params.guests || 2,
                    children: 0,
                  },
                ],
                destination: { code: destCode },
                filter: { minCategory: 4 },
                from: 1,
                to: 50,
              }),
            }
          );

          const data = await response.json();

          if (!data?.hotels?.hotels) {
            return { data: [] };
          }

          const images = [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945',
            'https://images.unsplash.com/photo-1551882547-ff43c63efe81',
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
          ];

          const hotels: Hotel[] = data.hotels.hotels.map(
            (h: any, index: number) => ({
              id: h.code.toString(),
              name: h.name,
              price: Number(h.minRate || 200),
              rating: 4.5,
              location: h.destinationName || params.location,
              image: images[index % images.length],
              description: `Luxury stay at ${h.name} in ${
                h.destinationName || params.location
              }`,
              amenities: ['WiFi', 'AC', 'Pool', 'Gym'],
            })
          );

          return { data: hotels };
        } catch (err) {
          console.error(err);
          return { data: getMockHotels(params.location) };
        }
      },
    }),
  }),
});

/**
 * Fallback mock data
 */
const getMockHotels = (location: string): Hotel[] => [
  {
    id: 'm1',
    name: `Grand ${location} Palace`,
    price: 320,
    rating: 4.8,
    location,
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    description: 'Luxury experience in the heart of the city.',
    amenities: ['Spa', 'Pool', 'Gym'],
  },
];

export const { useSearchHotelsQuery } = hotelApi;
