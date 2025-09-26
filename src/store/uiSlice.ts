import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Initial state types
export interface UIState {
  theme: "light" | "dark";
  sidebarOpen: boolean;
}

// Read initial state from localStorage or defaults
const getInitialTheme = (): UIState["theme"] => {
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

const getInitialSidebarOpen = (): boolean => {
  return localStorage.getItem("sidebarOpen") === "true";
};

// Initial state
const initialState: UIState = {
  theme: getInitialTheme(),
  sidebarOpen: getInitialSidebarOpen(),
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state.theme === "dark" ? "light" : "dark";
      state.theme = newTheme;
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    },
    setTheme: (state, action: PayloadAction<UIState["theme"]>) => {
      const newTheme = action.payload;
      state.theme = newTheme;
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
      localStorage.setItem("sidebarOpen", String(state.sidebarOpen));
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
      localStorage.setItem("sidebarOpen", String(state.sidebarOpen));
    },
  },
});

export const { toggleTheme, setTheme, toggleSidebar, setSidebarOpen } =
  uiSlice.actions;

export default uiSlice.reducer;
