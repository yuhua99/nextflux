import "./i18n";
import { initTheme } from "@/stores/themeStore";
import { createRoot } from "react-dom/client";
import "./index.css";
import { router } from "@/routes/index.jsx";
import { HeroUIProvider } from "@heroui/react";
import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import SplashScreen from "@/components/SplashScreen";
import { Loader2 } from "lucide-react";

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
    <Toaster
      theme="system"
      position="bottom-center"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex gap-1 items-center w-full bg-background border p-3 rounded-xl shadow-lg bg-gradient-to-b from-white/5 from-1% to-transparent to-20%",
          title: "text-sm font-medium",
          loading:
            "text-default-500 bg-default-100 border-default-300 shadow-black/10",
          info: "text-default-500 bg-default-100 border-default-300 shadow-black/10",
          success:
            "text-success bg-success-50 border-success-200 shadow-success/20",
          error: "text-danger bg-danger-50 border-danger-200 shadow-danger/20",
          warning:
            "text-warning bg-warning-50 border-warning-200 shadow-warning/20",
        },
      }}
      icons={{
        loading: <Loader2 className="h-4 w-4 animate-spin" />,
      }}
    />
  </HeroUIProvider>,
);
