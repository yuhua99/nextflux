import { createRoot } from "react-dom/client";
import "./index.css";
import { router } from "@/routes/index.jsx";
import { NextUIProvider } from "@nextui-org/react";
import { RouterProvider } from "react-router";

createRoot(document.getElementById("root")).render(
  <NextUIProvider>
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
  </NextUIProvider>,
);
