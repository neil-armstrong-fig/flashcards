import {Provider} from "react-redux";
import type {AppStore} from "@src/redux/Store";
import type {ReactNode} from "react";

interface Props {
  readonly children: ReactNode;
}

/** The wrapper that gives a hook under test the store, for `renderHook`. */
export function storeProviderOf(store: AppStore): (props: Props) => React.JSX.Element {
  return function StoreProvider({children}: Props): React.JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  };
}
