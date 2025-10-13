import { createContext, useContext } from 'react';
import Lenis from '@studio-freight/lenis';

export const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
    return useContext(LenisContext);
}
