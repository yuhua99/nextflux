import "./i18n";
import { initTheme } from "@/stores/themeStore";
import { createRoot } from "react-dom/client";
import "./index.css";
import { router } from "@/routes/index.jsx";
import { HeroUIProvider } from "@heroui/react";
import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import SplashScreen from "@/components/SplashScreen";

// 初始化主题
initTheme();

createRoot(document.getElementById("root")).render(
  <HeroUIProvider>
    <SplashScreen />
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true,
      }}
    />
    <Toaster theme="system" richColors position="bottom-center" />
  </HeroUIProvider>,
);
