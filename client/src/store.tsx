import {
  useReducer,
  createContext,
  useState,
  useContext,
  ReactNode,
} from "react";
import { IUserInfo, IAvailableGame, IRoomInfo } from "./Helper/Interface";
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
//* App level state management

//* Host setup

enum Actions {
  setUserData = "setUserData",
  setPlayerStatus = "setPlayerStatus",
  setRoomInfo = "setRoomInfo",
  setAvailableGames = "setAvailableGames",
  setSelectedGame = "setSelectedGame",
  setMessage = "setMessage",
}

interface IReducerState {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  roomInfo?: IRoomInfo;
  userData?: IUserInfo;
  playerStatus?: IUserInfo[];
  availableGames?: IAvailableGame[];
  selectedGame?: string;
  message?: string;
}

interface IAction {
  type: Actions;
  payload:
    | string
    | number
    | IAvailableGame[]
    | IUserInfo
    | IUserInfo[]
    | IRoomInfo;
}

const reducerFunc = (state: IReducerState, action: IAction): IReducerState => {
  const { type, payload } = action;
  switch (type) {
    case Actions.setRoomInfo:
      return {
        ...state,
        roomInfo: { ...state.roomInfo, ...(payload as IRoomInfo) },
      };

    case Actions.setUserData:
      return {
        ...state,
        userData: { ...state.userData, ...(payload as IUserInfo) },
      };

    case Actions.setPlayerStatus:
      return {
        ...state,
        playerStatus: payload as IUserInfo[],
      };

    case Actions.setAvailableGames:
      return {
        ...state,
        availableGames: payload as IAvailableGame[],
      };

    case Actions.setSelectedGame:
      return { ...state, selectedGame: payload as string };

    case Actions.setMessage:
      return { ...state, message: payload as string };

    default:
      return state;
  }
};

export const useStore = (intial: IReducerState) => {
  const [state, dispatch] = useReducer(reducerFunc, intial);

  const useDisRoomInfo = (payload: IRoomInfo) =>
    dispatch({ type: Actions.setRoomInfo, payload });

  const useDisUserData = (payload: IUserInfo) =>
    dispatch({ type: Actions.setUserData, payload });

  const useDisPlayerStatus = (payload: IUserInfo[]) =>
    dispatch({ type: Actions.setPlayerStatus, payload });

  const useDisAvailableGames = (payload: IAvailableGame[]) =>
    dispatch({
      type: Actions.setAvailableGames,
      payload,
    });

  const useDisSelectedGame = (payload: string) =>
    dispatch({ type: Actions.setSelectedGame, payload });

  const useDisMessage = (payload: string) =>
    dispatch({ type: Actions.setMessage, payload });

  const useClearMessage = (timer: number) => {
    setTimeout(
      () => dispatch({ type: Actions.setMessage, payload: "" }),
      timer
    );
  };

  const [isHost, setIsHost] = useState<boolean | null>();

  const updateHost = (hostStatus: boolean) => setIsHost(hostStatus);

  return {
    state,
    useDisRoomInfo,
    useDisUserData,
    useDisPlayerStatus,
    useDisAvailableGames,
    useDisSelectedGame,
    useDisMessage,
    useClearMessage,
    updateHost,
    isHost,
  };
};

type reducerType = ReturnType<typeof useStore>;

const ContextData = createContext<reducerType | null>(null)!;
export const UseStateContext = () => useContext(ContextData)!;

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const socket = io(`http://localhost:5050`, { transports: [`websocket`] });

  return (
    <ContextData.Provider value={useStore({ socket })}>
      {children}
    </ContextData.Provider>
  );
};
