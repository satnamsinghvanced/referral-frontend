import { createSlice } from "@reduxjs/toolkit";

// Read initial states from localStorage or defaults
const initialTheme =
  localStorage.getItem("theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light");

const initialSidebarOpen =
  localStorage.getItem("sidebarOpen") === "true" ? true : false;

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    theme: initialTheme,
    sidebarOpen: initialSidebarOpen,
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", state.theme);
      document.documentElement.classList.toggle("dark", state.theme === "dark");
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("theme", state.theme);
      document.documentElement.classList.toggle("dark", state.theme === "dark");
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
      localStorage.setItem("sidebarOpen", state?.sidebarOpen);
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
      localStorage.setItem("sidebarOpen", state?.sidebarOpen);
    },
  },
});

export const { toggleTheme, setTheme, toggleSidebar, setSidebarOpen } =
  uiSlice.actions;

export default uiSlice.reducer;
