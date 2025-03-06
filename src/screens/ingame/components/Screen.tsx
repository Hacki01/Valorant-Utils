import { useDispatch, useSelector } from "react-redux";
import { RootReducer } from "app/shared/rootReducer";
import { setCatVisibility } from "../stores/ingame";
import Menu from "./Menu";
import { isDev } from "lib/utils";
/* import { useState } from "react"; */

const Screen = () => {
  const { isCatVisible } = useSelector((state: RootReducer) => state.ingame);
  const dispatch = useDispatch();
  
  if (isDev) {
    window.onkeydown = (e) => {
      if (e.key === "F8") {
        dispatch(setCatVisibility(true))
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
  }

  return (
    <div className="ingame">
      {isCatVisible ? 
        <img style={{zIndex:100}} className="catImage" width={1024} height={576} alt='cat gif' src='https://media.tenor.com/RUCmdkzaIsoAAAAM/cat-wet.gif' />
        : null
      }
      <Menu/>
    </div>
  );
};

export default Screen
