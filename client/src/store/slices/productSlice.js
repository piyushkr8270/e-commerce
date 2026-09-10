import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to fetch products from backend
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { search, category, minPrice, maxPrice, rating, sort, page, onOffer } = params;
      let url = `/api/products?page=${page || 1}`;

      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (category) url += `&category=${encodeURIComponent(category)}`;
      if (minPrice) url += `&minPrice=${minPrice}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;
      if (rating) url += `&rating=${rating}`;
      if (sort) url += `&sort=${sort}`;
      if (onOffer) url += `&onOffer=true`;

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const initialState = {
  products: [],
  page: 1,
  pages: 1,
  totalProducts: 0,
  loading: false,
  error: null,
  filters: {
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    sort: 'newest',
    onOffer: false,
    page: 1
  }
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilter(state, action) {
      state.filters = { ...state.filters, ...action.payload, page: 1 }; // Reset to page 1 on filter change
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    },
    setPage(state, action) {
      state.filters.page = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.totalProducts = action.payload.totalProducts;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Selector
export const selectAllProducts = (state) => state.products;

export const { setFilter, resetFilters, setPage } = productSlice.actions;
export default productSlice.reducer;
