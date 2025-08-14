import { addToast } from "@heroui/react";
import { useEffect } from "react";
import Layout from "./components/layout/Layout";
import { BrowserRouter, Route, Routes } from "react-router";

function App() {
  // useEffect(() => {
  //   setTimeout(() => {
  //     addToast({
  //       title: "Hello World!",
  //     });
  //   }, 2000);
  // }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={<p>Asi Maarde aa Mllan, Loki Marde aa Gllan</p>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
