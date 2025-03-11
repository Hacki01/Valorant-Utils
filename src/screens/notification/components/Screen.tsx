import { useDispatch, useSelector } from "react-redux";
import "./styles/Screen.css"
import { useEffect } from "react";
import { RootReducer } from "app/shared/rootReducer";
import { removeNotification } from "screens/ingame/stores/ingame";

export default function Screen() {
  const { notifications } = useSelector((state: RootReducer) => state.ingame);
  const dispatch = useDispatch();

  useEffect(() => {
    // Get game info to position notification relative to game window
    overwolf.games.getRunningGameInfo((gameInfo) => {
      if (!gameInfo) return;

      // Get current notification window
      overwolf.windows.getCurrentWindow((result) => {
        const windowWidth = 300;
        const windowHeight = 400;
        
        // Calculate position relative to game window using windowRect
        const left = gameInfo.logicalWidth - windowWidth - 20;
        const top = gameInfo.logicalHeight - windowHeight - 20;
        
        // Set window position and size
        overwolf.windows.changePosition(result.window.id, left, top);
        overwolf.windows.changeSize(result.window.id, windowWidth, windowHeight);
      });
    });
  }, []); 

  if (notifications?.length === 0) return null;

  // Set timeout for notification removal
  setTimeout(() => {
    dispatch(removeNotification());
  }, notifications[0].timeout);

  return (
    <div className="notificationScreen">
      {notifications.map((content, index) => (
        <div key={index} className="notification">
          {content.message}
        </div>
      ))}
    </div>
  );
}