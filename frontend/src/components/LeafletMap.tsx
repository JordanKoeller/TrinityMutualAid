import React, { useEffect, useState } from 'react';
import ReactDomServer from "react-dom/server";
import { v4 } from 'uuid';

declare var L: any;

type Point = [number, number];

export interface MapMarker {
  point: Point,
  popup: JSX.Element

}

export interface MapProps {
  markers?: MapMarker[] // Must be memoized;
}

export const Leafletmap: React.FC<MapProps> = ({ markers, }) => {

  const [tag, _setTag] = useState<string>(v4());
  const [map, setMap] = useState<any>();

  // Initialize the map
  useEffect(() => {
    try {
      const myMap = L.map(tag).setView([29.432056, -98.493167], 10);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(myMap);
      setMap(myMap);
    } catch {
      console.warn("Supressing error on map init");
    }
  }, [tag]);

  useEffect(() => {
    if (map) {
      const markersRoot = document.getElementById(`hidden-${tag}`)!;
      const layer = markers?.map((descriptor, i) => {
        const marker = L.marker(descriptor.point).addTo(map);
        marker.bindPopup(markersRoot.children[i]);
        return marker;
      });
      
      return () => {
        layer?.forEach(m => m.remove());
      }
    }
  }, [markers, map, tag]);

  return <>
    <div id={"hidden-" + tag} hidden>
      {markers?.map(desc => desc.popup)}
    </div>
    <div className="map" id={tag}></div>
  </>
}
