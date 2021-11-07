import { useHistory } from "react-router-dom";
import { UseStateContext } from "../store";
import { ICallBack } from "../Helper/Interface";
import {
  Container,
  Box,
  Button,
  Typography,
  CssBaseline,
  TextField,
} from "@mui/material";

const HostSetup = () => {
  const { state, useDisMessage, useDisUserData, useDisRoomInfo } =
    UseStateContext();
  const { socket, roomInfo, message, userData } = state;
  const { userId } = userData!;
  const history = useHistory();

  //*  Send socket request
  const handleCreate = () => {
    if (roomInfo) {
      socket.emit("create-room", roomInfo, (res: ICallBack) => {
        if (res.status) history.push(`/lobby/${roomInfo.roomName}`);
        else useDisMessage(res.msg);
      });
    }
  };

  //* REQ Topup. Display req table below

  return (
    <>
      <CssBaseline />
      <Container>
        {message && (
          <Typography component="h1" variant="h5">
            {message}
          </Typography>
        )}
        <Box
          component="form"
          sx={{
            mt: 8,
          }}
        >
          <Typography component="h1" variant="h5">
            Create A Room
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            sx={{ mb: 2 }}
            autoFocus
            onChange={(e) => {
              useDisUserData({ username: e.target.value });
              useDisRoomInfo({
                host: { hostName: e.target.value, hostId: userId! },
              });
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="roomName"
            label="Room Name"
            name="roomName"
            sx={{ mb: 2 }}
            autoFocus
            onChange={(e) => useDisRoomInfo({ roomName: e.target.value })}
          />
          <TextField
            margin="normal"
            fullWidth
            id="password"
            label="Password (optional)"
            name="password"
            sx={{ mb: 2 }}
            autoFocus
            onChange={(e) => useDisRoomInfo({ password: e.target.value })}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleCreate}
          >
            CREATE
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default HostSetup;
