import "./styles/Screen.css";

import { useDispatch, useSelector } from "react-redux";
import { RootReducer } from "app/shared/rootReducer";
import { setCatVisibility } from "../stores/ingame";
import { useState } from "react";
import Menu from "./Menu";
/* import { useState } from "react"; */

const Screen = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { isCatVisible } = useSelector((state: RootReducer) => state.ingame);
  const dispatch = useDispatch();
  overwolf.settings.hotkeys.onHold.addListener((result) => {
    if (result.name === "show_cat") {
      dispatch(setCatVisibility(result.state === "down" ? true : false));
    }
  })
  overwolf.settings.hotkeys.onPressed.addListener(() => {
    setIsMenuVisible(!isMenuVisible)
  });
  console.log(isCatVisible)
  return (
    <div className="ingame">
      {isCatVisible ? 
        <img className="catImage" width={300} height={300} alt='cat gif' src='https://media.tenor.com/RUCmdkzaIsoAAAAM/cat-wet.gif' />
        : null
      }
      {isMenuVisible ? <Menu/> : null}
    </div>
  );
};

export default Screen;
