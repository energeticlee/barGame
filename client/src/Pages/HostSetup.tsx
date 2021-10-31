import { UseStateContext } from "../store";
import {
  Container,
  Box,
  Button,
  Typography,
  CssBaseline,
  TextField,
} from "@mui/material";
import { useCreateRoom } from "../Helper/customHooks";

const HostSetup = () => {
  const { state, useDisUserData, useDisRoomInfo } = UseStateContext();
  const { message } = state;

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
              useDisRoomInfo({ host: e.target.value });
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
            onClick={useCreateRoom}
          >
            CREATE!
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default HostSetup;
