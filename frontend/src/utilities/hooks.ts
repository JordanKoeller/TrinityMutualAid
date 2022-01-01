import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";


export enum MediaQuery {
    XS = 0,
    SM = 1,
    MD = 2,
    LG = 3,
    XL = 4,
    XXL = 5,
}

const BREAKPOINTS: [MediaQuery, number][] = [
    [MediaQuery.XS, 576],
    [MediaQuery.SM, 768],
    [MediaQuery.MD, 992],
    [MediaQuery.LG, 1200],
    [MediaQuery.XL, 1400],
    [MediaQuery.XXL, 1000000000], // Infinty.
]

const getSz = (w: number): MediaQuery => {
    for (let i = 0; i < BREAKPOINTS.length; i++) {
        if (w < BREAKPOINTS[i][1]) return BREAKPOINTS[i][0];
    }
    return BREAKPOINTS[BREAKPOINTS.length - 1][0];
}

export const useWindowWidth = (): number => {
    const [state, setState] = useState<number>(window.innerWidth);
    useEffect(() => {
        const updater = () => {
            const sz = window.innerWidth;
            if (sz !== state) {
                setState(sz);
            }
        }
        window.addEventListener('resize', updater);
        return () => window.removeEventListener('resize', updater);
    });
    return state;
}



export const useMediaQuery = (): MediaQuery => {
    const [state, setState] = useState<MediaQuery>(getSz(window.innerWidth));
    useEffect(() => {
        const updater = () => {
            const sz = getSz(window.innerWidth);
            if (sz !== state) {
                setState(sz);
            }
        }
        window.addEventListener('resize', updater);
        return () => window.removeEventListener('resize', updater);
    });
    return state;
}

export enum BreakpointLocation {
    GTE = 0,
    LT = 1,
    Unknown
}

const getBreaking = (refpoint: number) => {
    if (window.innerWidth < refpoint) return BreakpointLocation.LT;
    return BreakpointLocation.GTE;
}
// Returns the window's current relative position to the specified breakpoint,
// as well as a method to change the value of the breakpoint to use.
export const useWindowBreakpoint = (initialBreakpoint: number | null): [BreakpointLocation, (v: number | null) => void] => {
    const [breakpoint, setBreakpoint] = useState(initialBreakpoint);
    const [breakState, setBreakState] = useState(BreakpointLocation.Unknown);
    useEffect(() => {
        const listener = () => {
            if (breakpoint !== null) {
                setBreakState(getBreaking(breakpoint));
            } else {
                setBreakState(BreakpointLocation.Unknown);
            }
        }
        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    }, [breakpoint, setBreakState]);
    return [breakState, setBreakpoint];
}

export const useCurrentLanguage = (): string => {
    const {i18n} = useTranslation(undefined, {useSuspense: false});
    return i18n.language ? i18n.language.slice(0, 2) : 'en';
}