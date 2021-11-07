import React, { useState } from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { UseStateContext } from "../../store";
import { AccountBalanceWallet } from "@mui/icons-material";
import TopupDialog from "../../Components/TopupDialog";

const InBetween = () => {
  const [openDialog, setOpenDialog] = useState(false);
  // const { roomName } = useParams<{ roomName?: string }>();
  const { state } = UseStateContext();
  const { userData } = state;
  const { issuedCards, turn, playerStatus, pot, stake, minBuyin } =
    state.gameState!;
  console.log("sstate", issuedCards, turn, playerStatus, pot, stake, minBuyin);
  // {playerName, stack, winnings} = playerStatus[]
  //* If player turn, show option, else display waiting...
  //* Show player status on modal
  //* show stake and minBuyin in setting

  //* Game Setup
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
        <Box>
          <Typography component="h1" variant="h6">
            {`Current Pot: $${pot}`}
          </Typography>
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
          <Button variant="contained" color="error">
            PASS
          </Button>
          <AccountBalanceWallet
            sx={{ cursor: "pointer" }}
            onClick={() => setOpenDialog(true)}
          />
          <Button variant="contained" color="success">
            HIT
          </Button>
        </Container>
      </Container>
    </Container>
  );
};

export default InBetween;
