// src/App.jsx
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { useTranslation } from "react-i18next";

function App() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <div className="app-container">
      <Outlet />
      <Toaster
        position={isRtl ? "top-left" : "top-right"}
        dir={isRtl ? "rtl" : "ltr"}
        richColors
      />
    </div>
  );
}

export default App;