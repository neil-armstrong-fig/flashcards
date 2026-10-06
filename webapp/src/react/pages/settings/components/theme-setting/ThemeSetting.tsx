import {themeChosen} from "@src/redux/slices/settings/SettingsSlice";
import {ChoiceSetting} from "@src/react/pages/settings/components/choice-setting/ChoiceSetting";
import {THEMES} from "@flashcards/shared/theme/Theme";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";
import type {Theme} from "@flashcards/shared/theme/Theme";

const THEME_LABELS = {system: "Match device", light: "Light", dark: "Dark"} as const satisfies Record<Theme, string>;

/** Which colours the app wears. */
export function ThemeSetting(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const value = useAppSelector(state => state.settings.theme);

  return (
    <ChoiceSetting
      label="Colours"
      choices={THEMES}
      labels={THEME_LABELS}
      testIdPrefix="theme"
      value={value}
      onChange={chosen => dispatch(themeChosen(chosen))}
    />
  );
}
