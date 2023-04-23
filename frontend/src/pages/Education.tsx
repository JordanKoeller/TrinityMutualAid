import React, { useEffect, useState } from 'react';
import { TopSpacer } from '../components/TopSpacer';
import { ArticleViewerOrEditor } from '../components/Wyswig/WyswigArticleViewer';
import { pageIds } from './PageIds';
import { Leafletmap } from '../components/LeafletMap';

interface MarkerPopupProps {
  title: string,
  image: string,
  desc: string,
  addr?: string,
  href: string
}

const MarkerPopup: React.FC<MarkerPopupProps> = ({ title, desc, image, addr, href }) => {
  return <div className="map-popup">
    <a href={href} target="_blank" rel="noopener noreferrer">
      <h3 className="map-popup-title">{title}</h3>
    </a>
      <img src={image} alt={title} className="map-popup-img" />
    <p className="map-popup-desc">{desc}</p>
    <p className="map-popup-desc">{addr}</p>
  </div>
};

const getDesc = (desc: string, addr?: string) => {
  if (addr) {
    return desc + "\n\n" + addr;
  }
  return desc
}


const ContactPage: React.FC = () => {

  const [data, setData] = useState();

  useEffect(() => {
    const json = fetch("map-data.json", { method: 'GET' }).then(r => r.json());
    const markers = json.then(d => d.map((e: any) => ({
      popup: <MarkerPopup key={e[0]} desc={e[1]} addr={e[2]} title={e[0]} image={e[4]} href={e[3]} />, point: [e[5], e[6]]
    })));
    markers.then(setData);
  }, [])


  return <>
    <TopSpacer />
    <Leafletmap markers={data} />
    <ArticleViewerOrEditor defaultArticleId={pageIds[process.env.NODE_ENV]?.Education} />
  </>
}

export default ContactPage;