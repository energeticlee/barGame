import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { IUserInfo, ICallBack } from "./Interface";
import { UseStateContext } from "../store";

//* DIRECTORY
//? useWaitRoomSocket
//? useHandleReady

export const useWaitRoomSocket = (roomName: string, username: string) => {
  const {
    useDisMessage,
    useClearMessage,
    useDisAvailableGames,
    state,
    useDisPlayerStatus,
    useDisSelectedGame,
    updateHost,
  } = UseStateContext();
  const { socket } = state;

  useEffect(() => {
    const fetchGames = async () => {
      const res = await fetch("http://localhost:5050/api/games/all-games", {
        mode: "cors",
      });
      const { data, msg } = await res.json();
      if (res.ok) useDisAvailableGames(data);
      else {
        useDisMessage(msg);
        useClearMessage(2000);
      }
    };
    fetchGames();

    socket.on("new-join", (data: IUserInfo[]) => useDisPlayerStatus(data));

    socket.on("update-player-status", (data: IUserInfo[]) => {
      console.log("data", data);
      useDisPlayerStatus(data);
    });

    socket.on("update-game", (data: string) => {
      console.log("data", data);
      useDisSelectedGame(data);
    });

    socket.emit("get-players", roomName, (res: ICallBack) => {
      if (res.status) useDisPlayerStatus(res.data);
      else {
        //* Error
        useDisMessage(res.msg!);
        useClearMessage(2000);
      }
    });

    socket.emit("is-host", { roomName, username }, (res: ICallBack) => {
      if (res.status) updateHost(res.isHost);
      else {
        //* Error
        updateHost(res.isHost);
        useDisMessage(res.msg!);
        useClearMessage(2000);
      }
    });
  }, []);
};

export const useHandleReady = async (roomName: string) => {
  const { state, useDisMessage, useClearMessage } = UseStateContext();
  const { socket, userData, roomInfo } = state;

  //* Userdata validation
  if (roomInfo) {
    //* Send socket request
    socket.emit("set-ready", userData, roomName, (res: ICallBack) => {
      if (!res.status) {
        useDisMessage(res.msg);
        useClearMessage(2000);
      }
    });
  }
};

export const allPlayerReady = () => {
  const { state } = UseStateContext();
  const { playerStatus } = state;
  console.log("playerStatus", playerStatus);

  if (playerStatus)
    console.log(
      Object.values(playerStatus!).filter(
        (playerState) => playerState.readyState === false
      ).length === 0
    );
  return (
    Object.values(playerStatus!).filter(
      (playerState) => playerState.readyState === false
    ).length === 0
  );
};
