import { ReactNode } from "react";
import { CounterStoreProvider } from "./counter-store-provider";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <CounterStoreProvider>{children}</CounterStoreProvider>
      </ThemeProvider>
    </>
  );
}
