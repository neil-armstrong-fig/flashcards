import {useEffect} from "react";
import {useAppSelector} from "@src/redux/shared/Hooks";

/**
 * Puts the learner's choice of colours on the page: `data-theme` on the root for light or dark, and none for the device to
 * decide. It also tells the browser the ground colour for its own bar, read from the token the page is actually using, and
 * keeps it right if the device changes scheme while the app is open. Draws nothing.
 */
export function ThemeApplier(): undefined {
  const theme = useAppSelector(state => state.settings.theme);

  useEffect(() => {
    const device = window.matchMedia("(prefers-color-scheme: light)");

    if (theme === "system") {
      delete document.documentElement.dataset["theme"];
    }

    if (theme !== "system") {
      document.documentElement.dataset["theme"] = theme;
    }

    paintTheBrowserBar();
    device.addEventListener("change", paintTheBrowserBar);

    return () => device.removeEventListener("change", paintTheBrowserBar);
  }, [theme]);

  return undefined;
}

function paintTheBrowserBar(): void {
  const ground = getComputedStyle(document.documentElement).getPropertyValue("--color-ground").trim();

  if (ground === "") {
    return;
  }

  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", ground);
}
