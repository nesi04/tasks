import { createSlice } from "@reduxjs/toolkit";

const boardSlice = createSlice({
  name: "boards",
  initialState: {
    boards: [], // Initialize boards as an empty array
  },
  reducers: {
    addBoard: (state, action) => {
      state.boards.push({
        id: Date.now(),
        name: action.payload.boardName,
        lists: [],
      });
    },
    addList: (state, action) => {
      const board = state.boards.find((b) => b.id === action.payload.boardId);
      if (board) {
        board.lists.push({
          id: Date.now(),
          name: action.payload.listName,
          cards: [],
        });
      }
    },
    addCard: (state, action) => {
      const board = state.boards.find((b) => b.id === action.payload.boardId);
      const list = board?.lists.find((l) => l.id === action.payload.listId);
      if (list) {
        list.cards.push({
          id: Date.now(),
          name: action.payload.cardName,
        });
      }
    },
    updateLists: (state, action) => {
      const board = state.boards.find((b) => b.id === action.payload.boardId);
      if (board) {
        board.lists = action.payload.lists; // Update lists order
      }
    },
  },
});

export const { addBoard, addList, addCard, updateLists } = boardSlice.actions;
export default boardSlice.reducer;
