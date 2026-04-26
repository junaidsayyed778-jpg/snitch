// Add this reducer to your productSlice
import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    sellerProducts: [],
    // ... other state
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setSellerProducts: (state, action) => {
      state.sellerProducts = action.payload;
    },
    
    // ➕ NEW: Update a single product in both arrays
    updateProductInList: (state, action) => {
  const updatedProduct = action.payload;
  console.log("🔄 [REDUX] updateProductInList called for:", updatedProduct?._id)
  
  const updateInArray = (arr) => {
    const index = arr.findIndex(p => String(p._id) === String(updatedProduct._id));
    console.log("🔍 [REDUX] Found index:", index, "in array of length:", arr.length)
    
    if (index !== -1) {
      arr[index] = updatedProduct; // Immer allows direct mutation
      console.log("✅ [REDUX] Updated existing product")
    } else {
      arr.push(updatedProduct); // Add if new
      console.log("➕ [REDUX] Added new product to array")
    }
    return arr;
  };
  
  state.products = updateInArray([...state.products]);
  state.sellerProducts = updateInArray([...state.sellerProducts]);
},
    
    // Optional: Add variant to existing product in state
    addVariantToProductInList: (state, action) => {
      const { productId, newVariant } = action.payload;
      
      const updateInArray = (arr) =>
        arr.map((p) => {
          if (p._id === productId) {
            return {
              ...p,
              variants: [...(p.variants || []), newVariant]
            };
          }
          return p;
        });
      
      state.products = updateInArray(state.products);
      state.sellerProducts = updateInArray(state.sellerProducts);
    }
  }
});

export const { 
  setProducts, 
  setSellerProducts, 
  updateProductInList, 
  addVariantToProductInList 
} = productSlice.actions;

export default productSlice.reducer;