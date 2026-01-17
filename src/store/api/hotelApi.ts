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
  offset?: number;
  limit?: number;
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
    return normalized.substring(0, 3).toUpperCase();
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
        const offset = params.offset || 0;
        const limit = params.limit || 20;

        if (!headers) {
          return { data: getMockHotels(params.location, offset, limit) };
        }

        try {
          const formatDate = (date: any) => {
            const d = new Date(date || Date.now());
            return d.toISOString().split('T')[0];
          };

          const checkIn = formatDate(params.checkIn);
          const checkOut = formatDate(params.checkOut);
          const destCode = await getDestinationCode(params.location, headers);

          const from = offset + 1;
          const to = offset + limit;

          const response = await fetch(
            `${HOTELBEDS_BASE_URL}/hotel-api/1.0/hotels`,
            {
              method: 'POST',
              headers,
              body: JSON.stringify({
                stay: { checkIn, checkOut },
                occupancies: [{ rooms: 1, adults: params.guests || 2, children: 0 }],
                destination: { code: destCode },
                filter: { minCategory: 2 },
                from,
                to,
              }),
            }
          );

          const data = await response.json();

          // ⚠️ Handle explicit API errors (like Quota Exceeded) with Mock Data
          if (data?.error) {
            console.warn('Hotelbeds API Error:', data.error);
            return { data: getMockHotels(params.location, offset, limit) };
          }

          // ✅ Handle valid responses with 0 results
          if (!data?.hotels?.hotels || data.hotels.total === 0) {
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
              rating: h.rating || 4.5,
              location: h.destinationName || params.location,
              image: images[index % images.length],
              description: `Luxury stay at ${h.name} in ${h.destinationName || params.location}`,
              amenities: ['WiFi', 'AC', 'Pool', 'Gym'],
            })
          );

          return { data: hotels };
        } catch (err) {
          console.error(err);
          return { data: getMockHotels(params.location, offset, limit) };
        }
      },
    }),
  }),
});

/**
 * Fallback mock data with pagination support
 */
const getMockHotels = (location: string, offset: number, limit: number): Hotel[] => {
  const images = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    'https://images.unsplash.com/photo-1551882547-ff43c63efe81',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
  ];

  const baseHotels = [
    { name: 'Palazzo ', suffix: 'Resort' },
    { name: 'The ', suffix: 'Obsidian' },
    { name: 'Azure ', suffix: 'Heights' },
    { name: 'Sanctuary ', suffix: 'Grand' },
    { name: 'Elysian ', suffix: 'Suites' },
    { name: 'Vista ', suffix: 'Point' },
  ];

  return Array.from({ length: limit }).map((_, i) => {
    const idx = (offset + i) % baseHotels.length;
    const hotel = baseHotels[idx];
    return {
      id: `m${offset + i}`,
      name: `${hotel.name}${location || 'Global'} ${hotel.suffix}`,
      price: 200 + (offset + i) * 15,
      rating: 4.0 + ((offset + i) % 10) / 10,
      location: location || 'World',
      image: images[(offset + i) % images.length],
      description: 'Hand-picked luxury accommodation.',
      amenities: ['WiFi', 'Pool', 'Gym'],
    };
  });
};

export const { useSearchHotelsQuery } = hotelApi;
