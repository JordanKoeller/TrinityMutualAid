import { useEffect, useState } from "react";


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
  for (let i=0; i < BREAKPOINTS.length; i++) {
    if (w < BREAKPOINTS[i][1]) return BREAKPOINTS[i][0];
  }
  return BREAKPOINTS[BREAKPOINTS.length - 1][0];
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