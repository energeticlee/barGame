import { useState, Dispatch, SetStateAction, FC } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { UseStateContext } from "../store";
import { ICallBack } from "../Helper/Interface";

interface IProp {
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
}

const LobbyBuyinDialog: FC<IProp> = ({ setOpenDialog, openDialog }) => {
  const [buyinValue, setBuyinValue] = useState<string>("");
  const { state, useDisMessage } = UseStateContext();
  const { socket, userData, roomInfo } = state;

  // Send request to host
  // Listen how request confirmation
  const handleBuyin = () => {
    socket.emit(
      "topup-request",
      userData,
      roomInfo,
      buyinValue,
      (res: ICallBack) => {
        if (!res.status) useDisMessage(res.msg);
      }
    );
    setOpenDialog(false);
  };

  return (
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
      <DialogContent>
        <DialogContentText>
          Please enter the amount you want to buyin.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="buyin"
          type="number"
          fullWidth
          variant="standard"
          onChange={(e) => setBuyinValue(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        <Button onClick={handleBuyin}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LobbyBuyinDialog;
