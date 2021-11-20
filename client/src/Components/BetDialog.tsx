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
  betDialog: boolean;
  setBetDialog: Dispatch<SetStateAction<boolean>>;
}

const BetDialog: FC<IProp> = ({ setBetDialog, betDialog }) => {
  const [betValue, setBetValue] = useState(0);
  const { state, useDisMessage } = UseStateContext();
  const { socket, userData, roomInfo } = state;

  const handleHit = () => {
    socket.emit("hit", userData, roomInfo, betValue, (res: ICallBack) => {
      if (!res.status) useDisMessage(res.msg);
    });
    setBetDialog(false);
  };

  return (
    <Dialog open={betDialog} onClose={() => setBetDialog(false)}>
      <DialogContent>
        <DialogContentText>Place Your Bets</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="amount"
          type="number"
          fullWidth
          variant="standard"
          onChange={(e) => setBetValue(+e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setBetDialog(false)}>Cancel</Button>
        <Button onClick={handleHit}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BetDialog;
