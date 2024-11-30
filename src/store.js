import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./features/boardSlice";

const store = configureStore({
  reducer: {
    boards: boardReducer, // Reducer for managing boards
  },
});

export default store;
