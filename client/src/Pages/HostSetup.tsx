import { useContext, useState } from "react";
import { handleCreateRoom } from "../Helper/SetupFunction";
import { ContextPackage } from "../App";
import { IUserInfo } from "../Helper/Interface";
import {
  Container,
  Box,
  Button,
  Typography,
  CssBaseline,
  TextField,
} from "@mui/material";
interface Props {}

const HostSetup = (props: Props) => {
  const [userData, setUserData] = useState<IUserInfo | undefined>();
  const [message, setMessage] = useState("");
  const ContactData = useContext(ContextPackage);
  if (!ContactData) return null;
  const { socket } = ContactData;

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
            onChange={(e) =>
              setUserData((data) => ({ ...data, username: e.target.value }))
            }
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
            onChange={(e) =>
              setUserData((data) => ({ ...data, roomName: e.target.value }))
            }
          />
          <TextField
            margin="normal"
            fullWidth
            id="password"
            label="Password (option)"
            name="password"
            sx={{ mb: 2 }}
            autoFocus
            onChange={(e) =>
              setUserData((data) => ({ ...data, password: e.target.value }))
            }
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => handleCreateRoom(userData, setMessage, socket)}
          >
            CREATE!
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default HostSetup;
