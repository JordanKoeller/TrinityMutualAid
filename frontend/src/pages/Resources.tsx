import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TopSpacer } from '../components/TopSpacer';
import { ArticleViewerOrEditor } from '../components/Wyswig/WyswigArticleViewer';
import { pageIds } from './PageIds';
import { Leafletmap, MarkerTypeEnum } from '../components/LeafletMap';
import { ListGroup } from 'react-bootstrap';

const LEAN_CALENDAR_LINK = "https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=America%2FChicago&src=ZmQzZGQ2YzdmY2ZkMDM0MDQ5YjY5ZTFmZTI4OTQxY2Q4NzRmNjQ3ZDQ0NzAxZGU0MjEzOWJkYjBjNzVlZjU5OUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23F4511E";

const CALENDAR_ARGS = "&mode=AGENDA&showTabs=0&showTitle=0&showNav=0&showDate=0&showPrint=0&showCalendars=0&showTz=0";

const MARKER_COLOR_MAP: Record<string, MarkerTypeEnum> = {
  "PANTRY/FRIDGE": MarkerTypeEnum.ORANGE,
  "MUTUAL AID": MarkerTypeEnum.BLUE,
  "NON-PROFIT": MarkerTypeEnum.GREEN,
  "HEALTH SERVICE": MarkerTypeEnum.RED,
  "HOUSING ASSISTANCE": MarkerTypeEnum.YELLOW,
  "LEGAL SERVICE": MarkerTypeEnum.VIOLET,
  "OTHER": MarkerTypeEnum.GREY,
}

const MARKER_TO_I18N_MAP: Record<string, string> = {
  "PANTRY/FRIDGE": "Pantry",
  "MUTUAL AID": "MutualAid",
  "NON-PROFIT": "NonProfit",
  "HEALTH SERVICE": "HealthService",
  "HOUSING ASSISTANCE": "HousingAssistance",
  "LEGAL SERVICE": "LegalService",
  "OTHER": "Other",
}

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

const ResourcesPage: React.FC = () => {
  const { t, i18n } = useTranslation(undefined, { useSuspense: false });
  const language_code = i18n.language?.slice(0, 2)


  const [data, setData] = useState();

  useEffect(() => {
    const json = fetch("map-data.json", { method: 'GET', headers: {'Cache-Control': 'max-age=0'} }).then(r => r.json());
    const markers = json.then(d => d.map((e: any) => {
      const [titleEn, descEn, titleEs, descEs, address, serviceType, link, img, coordX, coordY] = e;
      return {
        point: [coordX, coordY],
        marker: MARKER_COLOR_MAP[serviceType],
        popup: language_code === 'en' ?
          <MarkerPopup key={titleEn} title={titleEn} desc={descEn} addr={address} image={img} href={link} />
          :
          <MarkerPopup key={titleEn} title={titleEs} desc={descEs} addr={address} image={img} href={link} />,
      };
    }));
    markers.then(setData);
  }, [language_code])

  return <>
    <TopSpacer />
    <div className="map-container">
      <Leafletmap markers={data} />
      <div className="map-overlay">
        <ListGroup>
          <ListGroup.Item className="map-legend-row">Legend:</ListGroup.Item>
          {
            Object.entries(MARKER_COLOR_MAP).map(([k, v]) => {
              return <ListGroup.Item className="map-legend-row"><span className="map-legend-row-span">
                {t(`pages.Resources.MapLegend.${MARKER_TO_I18N_MAP[k]}`)}:
                <img src={v} alt="Marker" className="map-marker-legend"></img>
                </span></ListGroup.Item>
            })
          }
        </ListGroup>
      </div>
    </div>
    <div style={{ width: "100vw", display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "left", alignItems: "flex-start", columnGap: "4em" }}>
      <div style={{ maxWidth: 1200 }}>
        <h1 className="jumbotron-title">{t('navbar.Resources')}</h1>

        <ArticleViewerOrEditor defaultArticleId={pageIds[process.env.NODE_ENV]?.Resources} />
      </div>
      <div className="calendar-stage">
        <h1 className="jumbotron-title">{t("pages.Resources.CalendarTitle")}</h1>
        <iframe
          title="GoogleCal"
          src={LEAN_CALENDAR_LINK + CALENDAR_ARGS + "&hl=" + language_code}
          style={{ border: 0, minHeight: 600, maxHeight: 800, width: 350 }} frameBorder="0" scrolling="no"></iframe>
      </div>
    </div>
  </>
}

export default ResourcesPage;