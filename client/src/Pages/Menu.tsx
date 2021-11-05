import React from "react";
import { Link } from "react-router-dom";
import RouteButton from "../Components/RouteButton";
import { Container, Box, CssBaseline } from "@mui/material";

interface Props {}

const Menu = (props: Props) => {
  return (
    <>
      <CssBaseline />
      <Container>
        <Box
          component="form"
          sx={{
            mt: 8,
          }}
        >
          <RouteButton text="Create Room" routeTo="/host-setup" />
          <RouteButton text="Join Room" routeTo="/player-setup" />
        </Box>
      </Container>
    </>
  );
};

export default Menu;
