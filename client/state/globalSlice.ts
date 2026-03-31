import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FiltersState {
  location: string;
  beds: string;
  baths: string;
  propertyType: string;
  amenities: string[];
  availableFrom: string;
  priceRange: [number, number] | [null, null];
  squareFeet: [number, number] | [null, null];
  coordinates: [number, number];
}

export interface AuthUser {
  email: string,
  id: number,
  name: string,
  password: string,
  phone: string,
  role: string
}

interface InitialStateTypes {
  filters: FiltersState;
  isFiltersFullOpen: boolean;
  viewMode: "grid" | "list";
  authUser: AuthUser
}

export const initialState: InitialStateTypes = {
  filters: {
    location: "Ibadan",
    beds: "any",
    baths: "any",
    propertyType: "any",
    amenities: [],
    availableFrom: "any",
    priceRange: [null, null],
    squareFeet: [null, null],
    coordinates: [3.9470, 7.3775],
  },
  isFiltersFullOpen: false,
  viewMode: "grid",
  authUser: {
    email: "",
    id: 0,
    name: "",
    password: "",
    phone: "",
    role: ""
  }
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<FiltersState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    toggleFiltersFullOpen: (state) => {
      state.isFiltersFullOpen = !state.isFiltersFullOpen;
    },
    setViewMode: (state, action: PayloadAction<"grid" | "list">) => {
      state.viewMode = action.payload;
    },
    setAuthUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      state.authUser = { ...state.authUser, ...action.payload };
    },
  },
});

export const { setFilters, toggleFiltersFullOpen, setViewMode, setAuthUser } =
  globalSlice.actions;

export default globalSlice.reducer;