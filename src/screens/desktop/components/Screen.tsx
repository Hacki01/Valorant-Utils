import { DesktopHeader } from "./DesktopHeader";
import "./styles/Screen.css";
import { useSelector } from "react-redux";
import { RootReducer } from "app/shared/rootReducer";

//avoid the use of static text, use i18n instead, each language has its own text, and the text is stored in the
//locales folder in the project root
const Screen = () => {

  const { match_info } = useSelector(
    (state: RootReducer) => state.background,
  );

  return (
    <div className='desktop'>
      <DesktopHeader />
      <div className={"desktopContainer"}>
        <div>Stats</div>
        <div>map:{JSON.stringify(match_info)}</div>
      </div>
    </div>
  );
};

export default Screen;
