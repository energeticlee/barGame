import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

//* APP LEVEL STATE
export interface IAppContext {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export interface IUserInfo {
  username?: string;
  roomName?: string;
  password?: string;
}

//* BUTTON INTERFACE
export interface IRouteButton {
  text: string;
  routeTo: string;
}

export interface ISetupButton {
  text: string;
  routeTo: string;
}
