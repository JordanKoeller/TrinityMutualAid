import React from 'react';


export interface ImageFrameProps {
  src: string,
  width?: string | number,
  height?: string | number,
  cx?: string,
  cy?: string
}

export const ImageFrame: React.FC<ImageFrameProps> = ({src, height, width, cx="center", cy="center"}) => {

  return <img
    alt="" src={src} width={width} height={height}
  />

  // return <div 
  //   style={{
  //     width,
  //     height,
  //     backgroundImage: `url('${src}')`,
  //     backgroundPosition: `${cx} ${cy}`,
  //     backgroundRepeat: 'no-repeat',
  //     overflow: 'hidden'
  //   }}/>
};