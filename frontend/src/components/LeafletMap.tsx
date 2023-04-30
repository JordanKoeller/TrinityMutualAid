import React, { useEffect, useState, useRef } from 'react';
import { v4 } from 'uuid';

declare var L: any;

type Point = [number, number];

export enum MarkerTypeEnum {
  RED = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  GREEN = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  BLUE = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  ORANGE = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  YELLOW = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
  VIOLET = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
  GREY = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
}

export interface MapMarker {
  point: Point,
  popup: JSX.Element,
  marker?: MarkerTypeEnum

}

export interface MapProps {
  markers?: MapMarker[] // Must be memoized;
}

export const Leafletmap: React.FC<MapProps> = ({ markers, }) => {

  const [tag,] = useState<string>(v4());
  const mapState = useRef<{ map: any, markers: Record<string, any> }>({ map: undefined, markers: {} });

  // Initialize the map
  useEffect(() => {
    try {
      const myMap = L.map(tag).setView([29.432056, -98.493167], 10);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(myMap);
      mapState.current.map = myMap;
    } catch {
      console.warn("Supressing error on map init");
    }
  }, [tag]);

  useEffect(() => {
    if (mapState.current.map) {
      const markersRoot = document.getElementById(`hidden-${tag}`)!;
      markers?.forEach(descriptor => {
        if (descriptor.marker && !(descriptor.marker in mapState.current.markers)) {
          const icon = new L.Icon({
            iconUrl: descriptor.marker,
            shadowUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
          mapState.current.markers[descriptor.marker] = icon;
        }
      });
      const layer = markers?.map((descriptor, i) => {
        if (descriptor.marker) {
          const marker = L.marker(descriptor.point, { icon: mapState.current.markers[descriptor.marker] }).addTo(mapState.current.map);
          marker.bindPopup(markersRoot.children[i]);
          return marker;
        }
        const marker = L.marker(descriptor.point).addTo(mapState.current.map);
        marker.bindPopup(markersRoot.children[i]);
        return marker;
      });

      return () => {
        layer?.forEach(m => m.remove());
      }
    }
  }, [markers, mapState.current.map, tag]);

  return <>
    <div id={"hidden-" + tag} hidden>
      {markers?.map(desc => desc.popup)}
    </div>
    <div className="map" id={tag}></div>
  </>
}
