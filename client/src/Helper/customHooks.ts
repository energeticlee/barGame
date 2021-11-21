import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  IUserInfo,
  ICallBack,
  IGameInfo,
  InBetweenState,
  IRequest,
} from "./Interface";
import { UseStateContext } from "../store";

//* DIRECTORY
//? useWaitRoomSocket
//? useHandleReady

export const useWaitRoomSocket = (
  roomName: string,
  username: string,
  userId: string
) => {
  const {
    useDisMessage,
    useDisAvailableGames,
    state,
    useDisPlayerStatus,
    useDisGameInfo,
    useDisInBetweenState,
    updateHost,
    useDisReq,
    setMiddleCard,
  } = UseStateContext();
  const { socket, userData, roomInfo } = state;
  const histroy = useHistory();

  useEffect(() => {
    const fetchGames = async () => {
      const res = await fetch("http://localhost:5050/api/games/all-games", {
        mode: "cors",
      });
      const { data, msg } = await res.json();
      if (res.ok) useDisAvailableGames(data);
      else useDisMessage(msg);
    };
    fetchGames();

    socket.on("new-join", (data: IUserInfo[]) => useDisPlayerStatus(data));

    socket.on("update-player-status", (data: IUserInfo[]) =>
      useDisPlayerStatus(data)
    );

    socket.on("update-game", (data: IGameInfo) => useDisGameInfo(data));

    socket.on("update-lobby-buyin", (data: IUserInfo[]) =>
      useDisPlayerStatus(data)
    );

    socket.on("update-stack", (data: IUserInfo[], pendingData: IRequest[]) => {
      useDisPlayerStatus(data);
      useDisReq(pendingData);
    });

    socket.on(
      "update-ingame-stack",
      (data: InBetweenState, pendingData: IRequest[]) => {
        console.log(data);
        useDisInBetweenState(data);
        useDisReq(pendingData);
      }
    );

    socket.emit("get-players", roomName, (res: ICallBack) => {
      if (res.status) useDisPlayerStatus(res.data);
      else useDisMessage(res.msg!);
    });

    socket.on("start-inbetween", (roomName, gameState: InBetweenState) => {
      useDisInBetweenState(gameState);
      histroy.push(`/room/inbetween/${roomName}`);
    });

    socket.on(
      "hit-outcome",
      (gameState: InBetweenState, middleCard: number) => {
        useDisInBetweenState(gameState);
        setMiddleCard(middleCard);
        setTimeout(() => {
          //* setTimeout to trigger turn change (pass)
          socket.emit("pass", userData, roomInfo, (res: ICallBack) => {
            if (!res.status) useDisMessage(res.msg);
          });
        }, 3000);
      }
    );

    socket.on("next-player", (gameState: InBetweenState) => {
      useDisInBetweenState(gameState);
      setMiddleCard(null);
    });

    socket.on("topup-request-host", (data: IRequest[]) => useDisReq(data));

    socket.emit("is-host", { roomName, userId }, (res: ICallBack) => {
      if (res.status) updateHost(res.isHost);
      else {
        updateHost(res.isHost);
        useDisMessage(res.msg!);
      }
    });
  }, []);
};
