import {
  useReducer,
  createContext,
  useContext,
  ReactNode,
  Reducer,
} from "react";
import { IUserInfo, IAvailableGame } from "./Helper/Interface";
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
//* App level state management
const socket = io(`http://localhost:5050`, { transports: [`websocket`] });

//* Host setup

export enum Actions {
  setUserData = "setUserData",
  setAvailableGames = "setAvailableGames",
  setSelectedGame = "setSelectedGame",
  setMessage = "setMessage",
}

interface IReducerState {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  userData?: IUserInfo;
  availableGames?: IAvailableGame[] | [];
  selectedGame?: string;
  message?: string;
}
interface IAction {
  type: Actions;
  payload: string | number | IAvailableGame | IUserInfo;
}

const reducerFunc = (
  state: IReducerState,
  action: IAction
): IReducerState | undefined => {
  const { type, payload } = action;
  switch (type) {
    case Actions.setUserData:
      return { ...state, userData: payload as IUserInfo };

    case Actions.setAvailableGames:
      return {
        ...state,
        availableGames: state.availableGames
          ? [...state.availableGames, payload as IAvailableGame]
          : [payload as IAvailableGame],
      };

    case Actions.setSelectedGame:
      return { ...state, selectedGame: payload as string };

    case Actions.setMessage:
      return { ...state, message: payload as string };

    default:
      break;
  }
};

const useStore = (intial: IReducerState) => {
  const [state, dispatch] = useReducer<Reducer<any, any>>(reducerFunc, intial);

  const useDisMessage = (payload: string) =>
    dispatch({ type: Actions.setMessage, payload });

  const useDisUserData = (payload: IUserInfo) => {
    dispatch({ type: Actions.setUserData, payload });
  };

  const useDisAvailableGames = (payload: IAvailableGame) => {
    dispatch({ type: Actions.setAvailableGames, payload });
  };

  const useClearMessage = (timer: number) => {
    setTimeout(
      () => dispatch({ type: Actions.setMessage, payload: timer }),
      timer
    );
  };

  return {
    state,
    useDisMessage,
    useDisUserData,
    useDisAvailableGames,
    useClearMessage,
  };
};

type reducerType = ReturnType<typeof useStore>;

const ContextData = createContext<reducerType | null>(null)!;
export const UseStateContext = () => useContext(ContextData)!;

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ContextData.Provider value={useStore({ socket })}>
      {children}
    </ContextData.Provider>
  );
};
