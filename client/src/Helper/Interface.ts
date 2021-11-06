import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

//* APP LEVEL STATE
export interface IAppContext {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export interface IUserInfo {
  username?: string;
  readyState?: boolean;
  buyin?: number;
}

export interface IRoomInfo {
  host?: string;
  roomName?: string;
  password?: string | undefined;
  selectedGame?: string;
  ante?: number;
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
  gameId: number;
  gameName: string;
  gameSetup: string;
  howToPlay: string;
}

export interface ICallBack {
  status: boolean;
  msg: string;
  data: IUserInfo[];
  isHost: boolean;
  userInfo: IUserInfo;
  redirect: boolean;
}

export interface IGameInfo {
  selectedGame: string;
  stake?: number;
  minBuyin?: number;
}

interface InBetweenPlayer {
  playerName: string;
  stack: number;
  winnings: number;
  // cashOut: () => number;
}
export interface InBetweenState {
  // issueTwoCards: () => void;
  // attemptBetween: () => number;
  // outcome: () => boolean;
  // drawACard: () => number;
  // newDeck: () => number[];
  // populatePlayers: () => InBetweenPlayer[];
  // newPlayer: () => void;
  // currentDeck: number[];
  issuedCards: number[];
  turn: number;
  playerStatus: InBetweenPlayer[];
  stake: number;
  minBuyin: number;
  pot: number;
}
