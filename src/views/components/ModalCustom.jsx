import React, { useEffect, useState } from 'react';
import styled from 'styled-components';


// MATERIAL DONE
// import { Dialog, DialogContent } from '@mui/material';
import { StyledDialog, StyledDialogContent } from 'views/styledComponents';
// import { makeStyles } from "@mui/material/styles";


// const useStyles = makeStyles(theme => ({
//   closesButton: {
//
//     maxwidth: "2000px",
//   },
//   // paper: { minWidth: "1280px" },
//   paper: { minWidth: "90%" }
// }));

const ReStyledDialog = styled.div`
  overflow-y: auto;

  margin-top: 0;
  position: fixed;
  z-index: 10;
  background: #191919cf;

  /* top: 4em;
  left: 10em;
  height: 50vh;
  width: 50vw; */


  display: block;
  /* padding: 0.75rem; */



  top: 0;
  left: 0;
  height: 91vh;


  width: 93%;
  padding: 2.75rem;
`;

const ReStyledDialogContent = styled.div`
  /* background: #09161c; */
  background: ${props => props.theme.navBg};
  padding-right: 2.75rem;
  padding-left: 2.75rem;
`;


function ModalCustom({ children, open, fullScreen, onExited, className, ...rest }) {
  const [showModal, setShowModal] = useState(false);
  // const classes = useStyles();
  useEffect(() => {
    if (open) {
      setShowModal(true);
    }
  }, [open]);

  function startExitAnimation() {
    setShowModal(false);
  }

  function onExitAnimationEnd() {
    onExited();
  }

  return (

    // <Dialog
    //   {...rest}
    //   open={showModal}
    //   className={classes.closesButton}
    //   classes={{ paper: classes.paper}}
    //   maxWidth="lg"
    //   onClose={startExitAnimation}
    //   onExited={onExitAnimationEnd}
    //   transitionDuration={0}
    // >
    //   <DialogContent>{children}</DialogContent>
    // </Dialog>

    <ReStyledDialog
      {...rest}
      open={showModal}
      // className={classes.closesButton}
      // classes={{ paper: classes.paper}}
      className={className}
      maxWidth="lg"
      onClose={startExitAnimation}
      onExited={onExitAnimationEnd}
      transitionDuration={0}
    >
      <ReStyledDialogContent>{children}</ReStyledDialogContent>
    </ReStyledDialog>
  );
}

// MuiModal.propTypes = {
//   ...Dialog.propTypes
// };

export default ModalCustom;
