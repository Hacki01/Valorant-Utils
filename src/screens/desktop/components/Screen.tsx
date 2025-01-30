import { useTranslation } from "react-i18next";
import { DesktopHeader } from "./DesktopHeader";
import "./styles/Screen.css";
import { Feed } from "components/Feed";
import { useSelector } from "react-redux";
import { RootReducer } from "app/shared/rootReducer";

//avoid the use of static text, use i18n instead, each language has its own text, and the text is stored in the
//locales folder in the project root
const Screen = () => {
  const { t } = useTranslation();

  const { events, infos } = useSelector(
    (state: RootReducer) => state.background,
  );

  return (
    <div className='desktop'>
      <DesktopHeader />
      <div className={"desktop__container"}>
        <header className={"desktop__header desktop__fit"}>
            {t("components.desktop.header")}
        </header>
        <main className={"desktop__main"}>
          {t("components.desktop.main")}
          <Feed
            title="Events"
            data={
              events.length
                ? JSON.stringify(events[events.length - 1])
                : "No events yet"
            }
          />
          <Feed
            title="Infos"
            data={
              infos.length
                ? JSON.stringify(infos[infos.length - 1])
                : "No infos yet"
            }
          />
        </main>
        <aside className={"desktop__aside"}>
          {t("components.desktop.aside")}
        </aside>
        <footer className={"desktop__footer desktop__fit"}>
          {t("components.desktop.footer")}
        </footer>
      </div>
    </div>
  );
};

export default Screen;
