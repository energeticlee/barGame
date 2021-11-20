import { useState } from "react";
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
import { AccountBalanceWallet } from "@mui/icons-material";
import { IUserInfo, ICallBack, IRequest } from "../Helper/Interface";
import { UseStateContext } from "../store";
import LobbyBuyinDialog from "./LobbyBuyinDialog";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
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

//* Prompt Host For Approval

const ReqTable = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const { state, useDisMessage } = UseStateContext();
  const { socket, userData, roomInfo, request } = state;
  const { roomName } = roomInfo!;

  const handleConfirm = (req: IRequest) => {
    socket.emit(
      "topup-confirm",
      userData,
      { roomName },
      req,
      (res: ICallBack) => {
        if (!res.status) useDisMessage(res.msg);
      }
    );
  };

  const handleReject = (req: IRequest) => {
    socket.emit(
      "topup-reject",
      userData,
      { roomName },
      req,
      (res: ICallBack) => {
        if (!res.status) useDisMessage(res.msg);
      }
    );
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 1 }}>
      <LobbyBuyinDialog setOpenDialog={setOpenDialog} openDialog={openDialog} />
      <Table sx={{ width: "contentfit" }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Request Amount</StyledTableCell>
            <StyledTableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {request &&
            request.map(({ reqUsername, pending }, i) => (
              <StyledTableRow key={i}>
                <StyledTableCell component="th" scope="row">
                  {reqUsername}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {`$${pending}`}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleReject({ reqUsername, pending })}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={() => handleConfirm({ reqUsername, pending })}
                  >
                    Approve
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReqTable;
