import { addNotification } from "screens/ingame/stores/ingame";
import store from '../app/shared/store';

export function ingameNotification(message:string, timeout: number) {
  timeout = timeout * 1000;
  return store.dispatch(addNotification({message, timeout}));
}