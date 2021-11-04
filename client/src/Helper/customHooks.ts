import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { IUserInfo, ICallBack } from "./Interface";
import { UseStateContext } from "../store";

//* DIRECTORY
//? useFetchGames
//? useWaitRoomSocket
//? useHandleReady

export const useFetchGames = () => {
  const { useDisMessage, useClearMessage, useDisAvailableGames } =
    UseStateContext();

  useEffect(() => {
    const fetchGames = async () => {
      const res = await fetch("http://localhost:5050/api/games/all-games", {
        mode: "cors",
      });
      const { data, msg } = await res.json();
      if (res.ok) {
        //* Fetch Successful
        useDisAvailableGames(data);
      } else {
        //* Error
        useDisMessage(msg);
        useClearMessage(2000);
      }
    };
    fetchGames();
  }, []);
};

export const useWaitRoomSocket = () => {
  const { state, useDisPlayerStatus, useDisSelectedGame } = UseStateContext();
  const { socket } = state;

  useEffect(() => {
    socket.on("new-join", (data: IUserInfo[]) => {
      useDisPlayerStatus(data);
    });

    socket.on("player-status", (data: IUserInfo[]) => useDisPlayerStatus(data));

    socket.on("update-game", (data: string) => {
      console.log("data", data);
      useDisSelectedGame(data);
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

export const useGetPlayers = (roomName: string) => {
  const { state, useDisPlayerStatus, useDisMessage, useClearMessage } =
    UseStateContext();
  const { socket } = state;
  useEffect(() => {
    socket.emit("get-players", roomName, (res: ICallBack) => {
      if (res.status) useDisPlayerStatus(res.data);
      else {
        //* Error
        useDisMessage(res.msg!);
        useClearMessage(2000);
      }
    });
  }, []);
};

export const useIsHost = (roomName: string, username: string) => {
  const { state, useDisMessage, useClearMessage, updateHost } =
    UseStateContext();
  const { socket } = state;

  useEffect(() => {
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

export const allPlayerReady = (): boolean => {
  const { state } = UseStateContext();
  const { playerStatus } = state;

  return (
    Object.values(playerStatus!).filter(
      (playerState) => playerState.readyState === false
    ).length === 0
  );
};
