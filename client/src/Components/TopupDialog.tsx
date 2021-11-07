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

const TopupDialog: FC<IProp> = ({ setOpenDialog, openDialog }) => {
  const [topUpValue, setTopUpValue] = useState<string>("");
  const { state, useDisMessage } = UseStateContext();
  const { socket, userData, roomInfo } = state;

  const handleTopup = () => {
    socket.emit(
      "topup-request",
      userData,
      roomInfo,
      topUpValue,
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
          Please enter the amount you want to topup.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="amount"
          type="number"
          fullWidth
          variant="standard"
          onChange={(e) => setTopUpValue(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        <Button onClick={handleTopup}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TopupDialog;
