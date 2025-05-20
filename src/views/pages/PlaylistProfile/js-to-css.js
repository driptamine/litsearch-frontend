// PlaylistTracklistItem

const useStyles = makeStyles(theme => ({
  linkHover: {
    fontWeight: "bold",
    color: '#FFF',
    textDecoration: 'none',
    "&:hover": {
      textDecoration: "underline"
    }
    // "&:hover": {
    //   opacity: 0.7
    // },
    // "&:hover", "&:focus", "&:hover", "&:visited", "&:link", "&:active": {
    //   textDecoration: "underline"
    // }
  },
  linkHoverz: {
    fontWeight: "bold",
    color: '#FFF',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: "underline"
    }
  },
  root: {
    paddingTop: "0px",
    paddingBottom: "0px",
    display: "flex",
    cursor: "default",
    // flexDirection: "column"

  },
  icons: {
    display: "flex"
  },
  stepperIcon: {
    fontSize: theme.typography.h2.fontSize
  },
  active: {
    // display: "contents",
    fontWeight: "bold",

    // color: "#646498",
    color: "#6666d8",

    // color: "#5848f8;",
    textDecoration: 'none',
    '&:hover': {
      textDecoration: "underline"
    }

    // background: rgb(51, 51, 51);
  }
}));

const ListItemz = withStyles({
  root: {
    "&$selected": {
      backgroundColor: "green",

      // backgroundColor: "rgba(255,255,255,.3)",

      color: "white",
      "& .MuiListItemIcon-root": {
        color: "white"
      }
    },
    "&$selected:hover": {
      backgroundColor: "purple",
      // backgroundColor: "rgba(255,255,255,.3)",
      color: "white",
      "& .MuiListItemIcon-root": {
        color: "white"
      }
    },
    "&:hover": {
      backgroundColor: "blue",
      // backgroundColor: "rgba(255,255,255,.3)",

      color: "white",
      "& .MuiListItemIcon-root": {
        color: "white",
        // opacity: "0.1",
      }
    }
  },
  selected: {}
})(MuiListItem);

const mini_style = {
  fontSize: "20px",
  position: "relative",
  color: "#ccc",
  cursor: "default",
};

const album_cover = {
  display: "flex",
  alignItems: "center",
}
