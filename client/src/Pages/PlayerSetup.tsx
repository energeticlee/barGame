import { useHistory } from "react-router-dom";
import { UseStateContext } from "../store";
import { IUserInfo, ICallBack } from "../Helper/Interface";
import {
  Container,
  Box,
  Button,
  Typography,
  CssBaseline,
  TextField,
} from "@mui/material";

const PlayerCreation = () => {
  const { state, useDisMessage, useDisUserData, useDisRoomInfo } =
    UseStateContext();
  const { socket, userData, roomInfo, message } = state;
  const history = useHistory();

  //  Send socket request
  const handleJoin = () => {
    if (roomInfo) {
      socket.emit("join-room", roomInfo, userData, (res: ICallBack) => {
        if (res.status) history.push(`/lobby/${roomInfo.roomName}`);
        else useDisMessage(res.msg);
      });
    }
  };

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
            Join A Room
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
            onChange={(e) => useDisUserData({ username: e.target.value })}
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
            onClick={handleJoin}
          >
            JOIN ROOM
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default PlayerCreation;
