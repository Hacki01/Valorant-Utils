import { useDispatch, useSelector } from "react-redux";
import "./styles/Screen.css"
import { useEffect } from "react";
import { RootReducer } from "app/shared/rootReducer";
import { removeNotification } from "screens/ingame/stores/ingame";

export default function Screen () {
  const { notifications } = useSelector((state: RootReducer) => state.ingame);
  console.log(notifications)

  const dispatch = useDispatch();

  useEffect(() => {
    // Get current window
    overwolf.windows.getCurrentWindow((result) => {
      // Get primary monitor resolution
      overwolf.utils.getMonitorsList((monitors) => {
        const primaryMonitor = monitors.displays[0];
        const windowWidth = 300;  // Set your window width
        
        // Calculate position for top-right corner
        const left = primaryMonitor.width - windowWidth - 20; // 20px margin from right
        const top = 20; // 20px from top
        
        // Set window position and size
        overwolf.windows.changePosition(result.window.id, left, top);
      });
    });
  }, []); // Empty dependency array - run once on mount
  
  if (notifications?.length === 0) return

  setTimeout(() => {
    // Remove the first notification after timeout
    dispatch(removeNotification());
  }
  , notifications[0].timeout);


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