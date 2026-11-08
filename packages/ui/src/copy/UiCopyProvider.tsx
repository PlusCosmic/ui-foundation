import { type ReactNode, createContext, useContext, useMemo } from "react";
import {
  type UiCopy,
  type UiCopyOverrides,
  defaultUiCopy,
  mergeCopy,
} from "./ui";

const UiCopyContext = createContext<UiCopy>(defaultUiCopy);

/** Gives the components below it the app's own words in place of the defaults (`copy/ui.ts`). */
export function UiCopyProvider({
  copy,
  children,
}: {
  copy: UiCopyOverrides;
  children: ReactNode;
}) {
  const parent = useContext(UiCopyContext);
  const value = useMemo(() => mergeCopy(parent, copy), [parent, copy]);
  return (
    <UiCopyContext.Provider value={value}>{children}</UiCopyContext.Provider>
  );
}

export function useUiCopy(): UiCopy {
  return useContext(UiCopyContext);
}
