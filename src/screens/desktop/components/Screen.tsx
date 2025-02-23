import { useDispatch, useSelector } from "react-redux";
import { DesktopHeader } from "./DesktopHeader";
import "./styles/Screen.css";
import { RootReducer } from "app/shared/rootReducer";

import { setDisplayForDRP } from "../../background/stores/background";

//avoid the use of static text, use i18n instead, each language has its own text, and the text is stored in the
//locales folder in the project root
const Screen = () => {

  const { displayDRP } = useSelector(
    (state: RootReducer) => state.background,
  )

  const dispatch = useDispatch();

  return (
    <div className='desktop'>
      <DesktopHeader />
      <div className={"desktopContainer"}>
        <input type='button' onClick={() => {dispatch(setDisplayForDRP(!displayDRP))}} value={(displayDRP ? "Disable" : "Enable") + " DRP"}></input>
      </div>
    </div>
  );
};

export default Screen;
