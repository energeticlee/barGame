import { IUserInfo } from "./Interface";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { useHistory } from "react-router-dom";
import { clearMessage } from "./helperFunction";

//* FOR HOST

export const handleCreateRoom = async (
  userData: IUserInfo | undefined,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap>
) => {
  if (userData) {
    const history = useHistory();
    //* Send socket request
    socket.emit("create-room", userData, (res: boolean) => {
      if (res) {
        //* Room Successfully Created
        history.push(`/room/${userData.roomName}`); //* Need params
      } else {
        //* Some other error
        setMessage("Room Taken");
        clearMessage(setMessage, 2000);
      }
    });
  }
};
