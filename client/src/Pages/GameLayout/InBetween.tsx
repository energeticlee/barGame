import React, { useState } from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { UseStateContext } from "../../store";
import { AccountBalanceWallet } from "@mui/icons-material";
import TopupDialog from "../../Components/TopupDialog";
import { ICallBack } from "../../Helper/Interface";

const InBetween = () => {
  const [openDialog, setOpenDialog] = useState(false);
  // const { roomName } = useParams<{ roomName?: string }>();
  const { state, useDisMessage } = UseStateContext();
  const { socket, userData, roomInfo } = state!;
  const { issuedCards, turn, playerStatus, pot, stake, minBuyin } =
    state.gameState!;
  console.log(
    "sstate",
    issuedCards,
    turn,
    playerStatus,
    userData,
    pot,
    stake,
    minBuyin
  );
  // {playerName, stack, winnings} = playerStatus[]
  //* If player turn, show option, else display waiting...
  //* Show player status on modal
  //* show stake and minBuyin in setting
  //* Show own stack
  //* Display other stack

  //* Game Setup
  const filteredUser = playerStatus.filter(
    (user) => user.username === userData?.username
  );

  //* Check if turn, else disable button
  const isTurn = playerStatus[turn].username === userData?.username;

  const handleHit = () => {
    socket.emit("hit", userData, roomInfo, (res: ICallBack) => {
      if (!res.status) useDisMessage(res.msg);
    });
  };

  const handlePass = () => {
    socket.emit("pass", userData, roomInfo, (res: ICallBack) => {
      if (!res.status) useDisMessage(res.msg);
    });
  };

  return (
    <Container sx={{ height: "100vh" }}>
      <Container
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          border: "1px solid black",
        }}
      >
        <TopupDialog setOpenDialog={setOpenDialog} openDialog={openDialog} />
        <Box
          sx={{
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography component="h1" variant="h6">
              {`Current Pot: $${pot}`}
            </Typography>
            <AccountBalanceWallet
              sx={{ cursor: "pointer", transform: "scale(2)", ml: 3 }}
              onClick={() => setOpenDialog(true)}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography component="h1" variant="h6">
              Action on:
            </Typography>
            <Typography
              component="h1"
              variant="h6"
              sx={{ color: "green", ml: 1 }}
            >
              {playerStatus[turn].username}
            </Typography>
          </Box>
        </Box>

        <Container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "120px",
          }}
        >
          <Box>{issuedCards[0]}</Box>
          <Box>{issuedCards[1]}</Box>
        </Container>
        <Container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Button
            variant="contained"
            color="error"
            disabled={!isTurn}
            onClick={handleHit}
          >
            PASS
          </Button>
          <Typography component="h1" variant="h6">
            Stack: {`$${filteredUser[0].buyin}`}
          </Typography>
          <Button
            variant="contained"
            color="success"
            disabled={!isTurn}
            onClick={handlePass}
          >
            HIT
          </Button>
        </Container>
      </Container>
    </Container>
  );
};

export default InBetween;
