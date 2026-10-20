import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { searchByNumber, searchWithAnalogues } from '../api/partsApi.js'

function getBestPrice(warehouses) {
  if (!warehouses || !warehouses.length) return 0
  const validPrices = warehouses
    .map(warehouse => warehouse.price)
    .filter(price => price > 0)
  return validPrices.length ? Math.min(...validPrices) : 0
}

export const fetchBrands = createAsyncThunk(
  'search/fetchBrands',
  async (articleNumber, { rejectWithValue }) => {
    try {
      const { data } = await searchByNumber(articleNumber)
      if (data.error) return rejectWithValue(data.error)
      return { goods: data.goods, articleNumber }
    } catch (networkError) {
      return rejectWithValue(networkError.message || 'Ошибка сети')
    }
  }
)

export const fetchResults = createAsyncThunk(
  'search/fetchResults',
  async ({ articleNumber, brand }, { rejectWithValue }) => {
    try {
      const { data } = await searchWithAnalogues(articleNumber, brand)
      if (data.error) return rejectWithValue(data.error)
      return data.goods
    } catch (networkError) {
      return rejectWithValue(networkError.message || 'Ошибка сети')
    }
  }
)

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    articleNumber: '',
    brands: [],
    selectedBrand: null,
    results: [],
    loadingStep: null, // null | 'brands' | 'results'
    error: null,
    brandSearchDone: false,
    resultSearchDone: false,
  },
  reducers: {
    selectBrand(state, action) {
      state.selectedBrand = action.payload
      state.results = []
      state.resultSearchDone = false
    },
    reset(state) {
      state.brands = []
      state.selectedBrand = null
      state.results = []
      state.error = null
      state.loadingStep = null
      state.brandSearchDone = false
      state.resultSearchDone = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loadingStep = 'brands'
        state.error = null
        state.brands = []
        state.results = []
        state.selectedBrand = null
        state.brandSearchDone = false
        state.resultSearchDone = false
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loadingStep = null
        state.brandSearchDone = true
        state.articleNumber = action.payload.articleNumber
        const goodsList = action.payload.goods || []
        state.brands = goodsList
          .filter(good => good.brand && good.number)
          .map(good => ({
            brand: good.brand,
            name: good.name,
            count: good.count,
            number: good.number,
          }))
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loadingStep = null
        state.error = action.payload || 'Ошибка запроса'
      })
      .addCase(fetchResults.pending, (state) => {
        state.loadingStep = 'results'
        state.error = null
        state.results = []
        state.resultSearchDone = false
      })
      .addCase(fetchResults.fulfilled, (state, action) => {
        state.loadingStep = null
        state.resultSearchDone = true
        const goodsList = action.payload || []
        if (!goodsList.length) return

        const mainItem = goodsList[0]
        const resultItems = []

        if (mainItem.brand) {
          resultItems.push({
            brand: mainItem.brand,
            number: mainItem.number,
            name: mainItem.name,
            count: mainItem.count,
            price: getBestPrice(mainItem.warehouses),
            isMain: true,
          })
        }

        for (const analogue of mainItem.analogues || []) {
          if (analogue.brand) {
            resultItems.push({
              brand: analogue.brand,
              number: analogue.number,
              name: analogue.name,
              count: analogue.count,
              price: getBestPrice(analogue.warehouses),
              isMain: false,
            })
          }
        }

        state.results = resultItems
      })
      .addCase(fetchResults.rejected, (state, action) => {
        state.loadingStep = null
        state.error = action.payload || 'Ошибка запроса'
      })
  },
})

export const { selectBrand, reset } = searchSlice.actions
export default searchSlice.reducer
