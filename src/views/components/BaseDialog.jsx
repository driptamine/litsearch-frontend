import React, { useMemo } from "react";
import styled from "styled-components";

// MATERIAL DONE
// import { makeStyles } from "@mui/material/styles";
// import { Dialog, DialogContent, Box } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
import BaseDialogTitle from "./BaseDialogTitle";

const DEFAULT_CONTENT_PADDING_Y = 1;
const DEFAULT_CONTENT_PADDING_X = 3;



const StyledDialog = styled.div`

`;
const StyledDialogContent = styled.div`

`;
const StyledBox = styled.div`

`;
const StyledCloseIcon = styled.div`
  position: fixed;
  top: ${props => props.theme.spacing};
  right: ${props => props.theme.spacing};
  cursor: pointer;
`;
// const useStyles = makeStyles(theme => ({
//   closeButton: {
//     position: "fixed",
//     top: theme.spacing(1),
//     right: theme.spacing(3),
//     cursor: "pointer"
//   }
// }));
export const DialogContext = React.createContext();

function BaseDialog({
  open,
  fullScreen,
  title,
  titleRight,
  onClose,
  onExited,
  zeroPaddingContent,
  children
}) {
  // const classes = useStyles();

  const contextValue = useMemo(() => ({ fullScreen, closeDialog: onClose }), [
    fullScreen,
    onClose
  ]);

  return (
    <StyledDialog
      open={open}
      scroll="body"
      fullWidth
      fullScreen={fullScreen}
      maxWidth="lg"
      onClose={onClose}
      onExited={onExited}
    >
      <DialogContext.Provider value={contextValue}>
        {!fullScreen && (
          <StyledCloseIcon onClick={onClose} />
        )}
        <BaseDialogTitle title={title} titleRight={titleRight} />
        <StyledDialogContent>
          {zeroPaddingContent ? (
            <StyledBox
              marginY={-DEFAULT_CONTENT_PADDING_Y}
              marginX={-DEFAULT_CONTENT_PADDING_X}
            >
              {children}
            </StyledBox>
          ) : (
            children
          )}
        </StyledDialogContent>
      </DialogContext.Provider>
    </StyledDialog>
  );
}

export default BaseDialog;
