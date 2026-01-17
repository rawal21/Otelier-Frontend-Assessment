import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Hotel } from './api/hotelApi';

interface HotelState {
  selectedHotels: Hotel[];
  searchParams: {
    location: string;
    checkIn: Date
    checkOut: Date;
    guests: number;
    offset: number;
    limit: number;
  };
}

const initialState: HotelState = {
  selectedHotels: JSON.parse(localStorage.getItem('selectedHotels') || '[]'),
  searchParams: {
    location: '',
    checkIn: new Date(),
    checkOut: new Date(),
    guests: 1,
    offset: 0,
    limit: 20,
  },
};

const hotelSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    toggleHotelSelection: (state, action: PayloadAction<Hotel>) => {
      const index = state.selectedHotels.findIndex((h) => h.id === action.payload.id);
      if (index >= 0) {
        state.selectedHotels.splice(index, 1);
      } else if (state.selectedHotels.length < 3) {
        state.selectedHotels.push(action.payload);
      }
      localStorage.setItem('selectedHotels', JSON.stringify(state.selectedHotels));
    },
    setSearchParams: (state, action: PayloadAction<HotelState['searchParams']>) => {
      state.searchParams = action.payload;
    },
    clearSelectedHotels: (state) => {
      state.selectedHotels = [];
      localStorage.removeItem('selectedHotels');
    },
  },
});

export const { toggleHotelSelection, setSearchParams, clearSelectedHotels } = hotelSlice.actions;
export default hotelSlice.reducer;
