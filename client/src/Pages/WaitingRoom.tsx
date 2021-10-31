import { useContext, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useFetchGames } from "../Helper/customHooks";
import { UseStateContext } from "../store";
import { IAvailableGame } from "../Helper/Interface";
import { clearMessage } from "../Helper/helperFunction";
import {
  Container,
  Box,
  Button,
  Typography,
  CssBaseline,
  TextField,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

interface Props {}

const WaitingRoom = (props: Props) => {
  const { roomName } = useParams<{ roomName: string }>();
  const {
    state,
    useDisMessage,
    useDisAvailableGames,
    useDisSelectedGame,
    useClearMessage,
  } = UseStateContext();
  const { socket, userData, selectedGame, message, availableGames } = state;
  const history = useHistory();

  useFetchGames(useDisAvailableGames);

  //* Listen for READY
  //* if all player ready, startGame enabled
  //* initialise game
  //* route to game board

  const handleStartGame = async () => {
    if (userData) {
      //* Send socket request
      socket.emit("create-room", userData, (res: boolean) => {
        if (res) {
          //* Room Successfully Created
          history.push(`/room/${userData.roomName}`); //* Need params
        } else {
          //* Some other error
          useDisMessage("Room Taken");
          useClearMessage(2000);
        }
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
            Create A Room
          </Typography>
          <InputLabel id="selectGame">Select Game</InputLabel>
          <Select
            labelId="selectGame"
            required
            fullWidth
            id="selectGame"
            value={selectedGame}
            onChange={(e) => useDisSelectedGame(e.target.value)}
            sx={{ mb: 2, textAlign: "left" }}
          >
            {availableGames &&
              availableGames.map((game: IAvailableGame, id: number) => {
                return (
                  <MenuItem key={id} value={game.gameName}>
                    {game.gameName}
                  </MenuItem>
                );
              })}
          </Select>

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleStartGame}
          >
            CREATE!
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default WaitingRoom;
