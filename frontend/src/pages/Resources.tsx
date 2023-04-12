import React from 'react';
import { useTranslation } from 'react-i18next';
import { TopSpacer } from '../components/TopSpacer';
import { ArticleViewerOrEditor } from '../components/Wyswig/WyswigArticleViewer';
import { pageIds } from './PageIds';

const LEAN_CALENDAR_LINK = "https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=America%2FChicago&src=ZmQzZGQ2YzdmY2ZkMDM0MDQ5YjY5ZTFmZTI4OTQxY2Q4NzRmNjQ3ZDQ0NzAxZGU0MjEzOWJkYjBjNzVlZjU5OUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23F4511E";

const CALENDAR_ARGS = "&mode=AGENDA&showTabs=0&showTitle=0&showNav=0&showDate=0&showPrint=0&showCalendars=0&showTz=0"


const ResourcesPage: React.FC = () => {
  const { t, i18n } = useTranslation(undefined, { useSuspense: false });
  const language_code = i18n.language?.slice(0, 2)
  return <>
    <TopSpacer />
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
          style={{ border: 0, minHeight: 600, maxHeight: 800, width: 350}} frameBorder="0" scrolling="no"></iframe>
      </div>
    </div>
  </>
}

export default ResourcesPage;