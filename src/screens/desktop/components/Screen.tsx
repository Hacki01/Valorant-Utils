import { useTranslation } from "react-i18next";
import { DesktopHeader } from "./DesktopHeader";
import "./styles/Screen.css";
import { useDispatch, useSelector } from "react-redux";
import { RootReducer } from "app/shared/rootReducer";
import { setCatVisibility } from "screens/ingame/stores/ingame";

//avoid the use of static text, use i18n instead, each language has its own text, and the text is stored in the
//locales folder in the project root
const Screen = () => {
  const { t } = useTranslation();

  const { events, infos } = useSelector(
    (state: RootReducer) => state.background,
  );

  const { isCatVisible } = useSelector(
    (state: RootReducer) => state.ingame,
  );

  const dispatch = useDispatch()

  return (
    <div className='desktop'>
      <DesktopHeader />
      <div className={"desktop__container"}>
        <header className={"desktop__header desktop__fit"}>
            {t("components.desktop.header")}
        </header>
        <main className={"desktop__main"}>
          <div className={"desktop__content"}>
            <span>Events</span>
            {events.map((event, index) => (
              <div key={index}>{ JSON.stringify(event)}</div>
            ))}
          </div>
          <div className={"desktop__content"}>
            <span>Infos</span>
            {infos.map((info, index) => (
              <div key={index}>{ JSON.stringify(info)}</div>
            ))}
          </div>
        </main>
        <aside className={"desktop__aside"}>
          <input type="button" value="SetCatVisibility" onClick={() => {
            dispatch(setCatVisibility(!isCatVisible))
          }} />
          {isCatVisible ? "true" : "false"}
        </aside>
        <footer className={"desktop__footer desktop__fit"}>
          {t("components.desktop.footer")}
        </footer>
      </div>
    </div>
  );
};

export default Screen;
