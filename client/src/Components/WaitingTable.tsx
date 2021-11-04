import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { IUserInfo, ICallBack } from "../Helper/Interface";
import { UseStateContext } from "../store";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

//* Matched username able to toggle button, else show status
//* Backend validation if user matched (Require accounts/identification)
//* Display user at the top of table
//* filter userInfo from playerState

const WaitingTable = ({ playerStatus }: { playerStatus: IUserInfo[] }) => {
  const { state, useDisMessage } = UseStateContext();
  const { socket, userData, roomInfo } = state;
  const { roomName } = roomInfo!;
  const { username } = userData!;

  // const filteredPlayer = (arr: IUserInfo[], username: string) =>
  //   arr.filter((friend) => friend.username !== username);

  const handleClick = (ready: boolean) => {
    socket.emit("update-ready", username, roomName, ready, (res: ICallBack) => {
      if (!res.status) useDisMessage(res.msg);
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: "contentfit" }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="right">Status</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {playerStatus &&
            playerStatus.map(({ username, readyState }) => (
              <StyledTableRow key={username}>
                <StyledTableCell component="th" scope="row">
                  {username}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {readyState ? (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleClick(false)}
                    >
                      READY!
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={() => handleClick(true)}
                    >
                      Waiting...
                    </Button>
                  )}
                </StyledTableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WaitingTable;
