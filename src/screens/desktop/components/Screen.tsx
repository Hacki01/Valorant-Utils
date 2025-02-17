import { DesktopHeader } from "./DesktopHeader";
import "./styles/Screen.css";
import { useDispatch, useSelector } from "react-redux";
import { RootReducer } from "app/shared/rootReducer";

//avoid the use of static text, use i18n instead, each language has its own text, and the text is stored in the
//locales folder in the project root
const Screen = () => {

  const { matchInfo } = useSelector(
    (state: RootReducer) => state.background,
  );

  const {map,roster,round_number,score,rank} = matchInfo

  const dispatch = useDispatch();
  return (
    <div className='desktop'>
      <DesktopHeader />
      <div className={"desktopContainer"}>
        <div>Stats</div>
        <div>mapa:{map}</div>
        <div>runda:{round_number}</div>
        <div>roster:{JSON.stringify(roster)}</div>
        <div>Ranga: {rank}</div>
        <div>Wynik:{JSON.stringify(score)}</div>
        <div>{JSON.stringify(matchInfo)}</div>
        <input type="button" disabled value="TEST" onClick={() => {
          dispatch({ type: "backgroundScreen/testFunction" });
        }} />
      </div>
    </div>
  );
};

export default Screen;
