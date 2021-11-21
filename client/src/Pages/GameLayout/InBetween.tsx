import React, { useState } from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { UseStateContext } from "../../store";
import { AccountBalanceWallet } from "@mui/icons-material";
import BetDialog from "../../Components/BetDialog";
import TopupDialog from "../../Components/TopupDialog";
import { ICallBack } from "../../Helper/Interface";
import ReqTable from "../../Components/ReqTable";

const InBetween = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [betDialog, setBetDialog] = useState(false);
  // const { roomName } = useParams<{ roomName?: string }>();
  const { state, useDisMessage, middleCard, isHost } = UseStateContext();
  const { socket, userData, roomInfo } = state!;
  const { issuedCards, turn, playerStatus, pot, stake, minBuyin } =
    state.gameState!;
  // {playerName, stack, winnings} = playerStatus[]
  //* If player turn, show option, else display waiting...
  //* Show player status on modal
  //* show stake and minBuyin in setting
  //* Show own stack
  //* Display other stack

  //* Game Setup
  const filteredUser = playerStatus.filter(
    (user) => user.playerName === userData?.username
  );

  //* Check if turn, else disable button
  const isTurn = playerStatus[turn].playerName === userData?.username;

  const handlePass = () => {
    //* Trigger Pass
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
        <BetDialog setBetDialog={setBetDialog} betDialog={betDialog} />
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
              {playerStatus[turn].playerName}
            </Typography>
          </Box>
        </Box>

        <Container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "100px",
          }}
        >
          <Box>{issuedCards[0]}</Box>
          <Box
            sx={{
              fontSize: "60px",
              color: "green",
            }}
          >
            {middleCard ? middleCard : "?"}
          </Box>
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
            onClick={handlePass}
          >
            PASS
          </Button>
          <Typography component="h1" variant="h6">
            Stack: {`$${filteredUser[0].stack}`}
          </Typography>
          <Button
            variant="contained"
            color="success"
            disabled={!isTurn}
            onClick={() => setBetDialog(true)}
          >
            HIT
          </Button>
        </Container>
        {isHost && <ReqTable confirmEndPoint={"rebuy-confirm"} />}
      </Container>
    </Container>
  );
};

export default InBetween;
