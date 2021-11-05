import { FC } from "react";
import { Link } from "react-router-dom";
import { IRouteButton } from "../Helper/Interface";
import { Button } from "@mui/material";

const RouteButton: FC<IRouteButton> = ({ text, routeTo }) => {
  return (
    <Link to={routeTo} style={{ textDecoration: "none" }}>
      <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        {text}
      </Button>
    </Link>
  );
};

export default RouteButton;
