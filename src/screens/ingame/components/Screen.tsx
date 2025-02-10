import "./styles/Screen.css";

import { useDispatch, useSelector } from "react-redux";
import { RootReducer } from "app/shared/rootReducer";
import { setCatVisibility } from "../stores/ingame";
import { useState } from "react";
import Menu from "./Menu";
import { isDev } from "lib/utils";
/* import { useState } from "react"; */

const Screen = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { isCatVisible } = useSelector((state: RootReducer) => state.ingame);
  const dispatch = useDispatch();
  
  if (isDev) {
    window.onkeydown = (e) => {
      if (e.key === "F8") {
        dispatch(setCatVisibility(true))
      }
      // Add Alt+X handler
      if (e.key === "x" && e.altKey) {
        setIsMenuVisible(prev => !prev);
      }
    }
    window.onkeyup = (e) => {
      if (e.key === "F8") {
        dispatch(setCatVisibility(false))
      }
    }
    
  } else {
    overwolf.settings.hotkeys.onHold.addListener((result) => {
      if (result.name === "show_cat") {
        dispatch(setCatVisibility(result.state === "down" ? true : false));
      }
    })
    overwolf.settings.hotkeys.onPressed.addListener(() => {
      setIsMenuVisible(!isMenuVisible)
    });
  }

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

export default Screen
