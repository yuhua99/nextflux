import { persistentAtom } from "@nanostores/persistent";

const defaultValue = {
  themeMode: "system",
  lightTheme: "light",
  darkTheme: "dark",
};

// 主题配置
export const themes = {
  light: [
    { id: "light", name: "白色", color: "#ffffff" },
    { id: "stone", name: "石灰", color: "#F3F1ED" },
  ],
  dark: [{ id: "dark", name: "黑色", color: "#1E1E1E" }],
};

export const themeState = persistentAtom("theme", defaultValue, {
  encode: JSON.stringify,
  decode: (str) => {
    const storedValue = JSON.parse(str);
    return { ...defaultValue, ...storedValue };
  },
});

// 更新主题的函数
export function setTheme(mode, themeId = null) {
  const root = window.document.documentElement;
  const allThemes = [...themes.light, ...themes.dark].map((t) => t.id);
  root.classList.remove(...allThemes);

  if (mode === "system") {
    const systemMode = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const themeToUse =
      systemMode === "dark"
        ? themeState.get().darkTheme
        : themeState.get().lightTheme;
    root.classList.add(themeToUse);
  } else {
    const newTheme =
      themeId ||
      (mode === "dark"
        ? themeState.get().darkTheme
        : themeState.get().lightTheme);
    root.classList.add(newTheme);
    if (mode === "dark") {
      themeState.set({ ...themeState.get(), darkTheme: newTheme });
    } else {
      themeState.set({ ...themeState.get(), lightTheme: newTheme });
    }
  }

  themeState.set({ ...themeState.get(), themeMode: mode });
}

// 初始化主题
export function initTheme() {
  const mode = themeState.get().themeMode;
  setTheme(mode);

  // 监听系统主题变化
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", (e) => {
    if (themeState.get().themeMode === "system") {
      const systemMode = e.matches ? "dark" : "light";
      const themeToUse =
        systemMode === "dark"
          ? themeState.get().darkTheme
          : themeState.get().lightTheme;
      const root = window.document.documentElement;
      const allThemes = [...themes.light, ...themes.dark].map((t) => t.id);
      root.classList.remove(...allThemes);
      root.classList.add(themeToUse);
    }
  });
}
