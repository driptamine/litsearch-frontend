import React, { useContext } from "react";

// MATERIAL DONE
// import { DialogTitle, Typography, Box, IconButton } from "@mui/material";
import { StyledDialogTitle, StyledTypography, StyledBox, StyledIconButton } from 'views/styledComponents';

// import CloseIcon from "@mui/icons-material/Close";
import {StyledCloseIcon} from 'views/styledComponents/icons';
// import { makeStyles } from "@mui/material/styles";

import { DialogContext } from "./BaseDialog";


// const useStyles = makeStyles(theme => ({
//   root: {
//     padding: theme.spacing(1, 2)
//   },
//   title: {
//     flex: 1
//   },
//   closeButton: {
//     marginRight: theme.spacing(1)
//   }
// }));

// const StyledDialogTitle = styled.title`
//
// `;
// const StyledTypography = styled.p`
//
// `;
// const StyledBox = styled.div`
//
// `;
// const StyledIconButton = styled.button`
//
// `;


function BaseDialogTitle({ title, titleRight }) {
  // const classes = useStyles();
  const { fullScreen, closeDialog } = useContext(DialogContext);

  return (
    <StyledDialogTitle
      // className={classes.root}
      disableTypography
    >
      <StyledBox display="flex" alignItems="center">
        {fullScreen && (
          <StyledIconButton
            // className={classes.closeButton}
            onClick={closeDialog}
          >
            <StyledCloseIcon />
          </StyledIconButton>
        )}
        <StyledTypography
          // className={classes.title}
          variant="h6" noWrap>
          {title}
        </StyledTypography>
        {titleRight}
      </StyledBox>
    </StyledDialogTitle>
  );
}

export default BaseDialogTitle;
