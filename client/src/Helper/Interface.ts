import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

//* APP LEVEL STATE
export interface IAppContext {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export interface IUserInfo {
  username?: string;
  readyState?: boolean;
}

export interface IRoomInfo {
  host?: string;
  roomName?: string;
  password?: string;
  selectedGame?: string;
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

export interface IAvailableGame {
  id: string;
  gameName: string;
  gameSetup: string;
  howToPlay: string;
}
