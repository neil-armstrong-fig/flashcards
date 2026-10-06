import type {AsideKind} from "@src/redux/slices/study/types/AsideKind";

export interface SetAsideShortcut {
  readonly kind: "setAside";
  readonly how: AsideKind;
}
