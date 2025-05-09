'use client'
import { TanstackQueryProvider } from "./TanstackQueryProvider";

export function MainProvider({ children }: { children: React.ReactNode }) {
    return <TanstackQueryProvider>{ children }</TanstackQueryProvider>;
}