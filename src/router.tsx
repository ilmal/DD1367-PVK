import { FC } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { IndexPage } from "./pages";
import { PopupPage } from "./pages/popup";
import { Layout } from "./components/Layout";

export const Router: FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="popup" element={<PopupPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};
