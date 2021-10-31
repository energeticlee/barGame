import { useEffect } from "react";
import { IAvailableGame } from "./Interface";

export const useFetchGames = (
  useDisAvailableGames: (payload: IAvailableGame) => void
) => {
  useEffect(() => {
    const fetchGames = async () => {
      const res = await fetch("http://localhost:5050/api/games/all-games", {
        mode: "cors",
      });
      const { data } = await res.json();
      if (res) {
        //* Room Successfully Created
        // history.push(`/room/${userData.roomName}`); //* Need params
        useDisAvailableGames(data);
      } else {
        //* Some other error
        console.log("ERROR");
        // setMessage("Room Taken");
        // clearMessage(setMessage, 2000);
      }
    };
    fetchGames();
  }, []);
};
