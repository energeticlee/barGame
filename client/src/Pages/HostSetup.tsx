import { useHistory } from "react-router-dom";
import { UseStateContext } from "../store";
import {
  Container,
  Box,
  Button,
  Typography,
  CssBaseline,
  TextField,
} from "@mui/material";

const HostSetup = () => {
  const { state, useDisMessage, useDisUserData, useClearMessage } =
    UseStateContext();
  const { socket, userData, message } = state;
  const history = useHistory();

  const handleCreateRoom = async () => {
    //* Send socket request
    socket.emit("create-room", userData, (res: boolean) => {
      if (res) {
        //* Room Successfully Created
        history.push(`/room/${userData.roomName}`);
      } else {
        //* Some other error
        useDisMessage("Room Taken");
        useClearMessage(2000);
      }
    });
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
            onChange={(e) => useDisUserData({ roomName: e.target.value })}
          />
          <TextField
            margin="normal"
            fullWidth
            id="password"
            label="Password (optional)"
            name="password"
            sx={{ mb: 2 }}
            autoFocus
            onChange={(e) => useDisUserData({ password: e.target.value })}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleCreateRoom}
          >
            CREATE!
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default HostSetup;
