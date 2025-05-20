import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { FullScreen } from "react-full-screen";
import { HotKeys } from "react-hotkeys";


// MATERIAL UNDONE
import { IconButton, Box, makeStyles } from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

import BaseDialog from "views/components/BaseDialog";
import YouTubePlayer from "./YouTubePlayer";
import MediaGalleryModalStepper from "./MediaGalleryModalStepper";
import MediaGalleryModalImageViewer from "./MediaGalleryModalImageViewer";

// CORE
import useHistoryPush from "core/hooks/useHistoryPush";
import useQueryString from "core/hooks/useQueryString";

const keyMap = {
  NEXT: ["right", "d"],
  PREVIOUS: ["left", "a"],
  FULL_SCREEN: ["fullscreen", "f"]
};

const useStyles = makeStyles(theme => ({
  fullScreenButton: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1)
  }
}));

function MediaGalleryModal({
  title,
  dataSource = [],
  queryParamName,
  isVideoPlayer = false
}) {
  // const classes = useStyles();
  const location = useLocation();
  const historyPush = useHistoryPush();

  const activeStep = useQueryString()[queryParamName];
  const activeStepIndex = dataSource.indexOf(activeStep);

  const [isVisible, setIsVisible] = useState(false);

  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    setIsVisible(!!activeStep);
  }, [activeStep]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  function handleExited() {
    historyPush(location.pathname, { keepScrollState: true });
  }

  const nextPath =
    activeStepIndex + 1 !== dataSource.length
      ? `${location.pathname}?${queryParamName}=${
          dataSource[activeStepIndex + 1]
        }`
      : null;

  const previousPath =
    activeStepIndex - 1 !== -1
      ? `${location.pathname}?${queryParamName}=${
          dataSource[activeStepIndex - 1]
        }`
      : null;

  function goToNextPath() {
    if (nextPath) {
      historyPush(nextPath, { keepScrollState: true });
    }
  }

  function goToPreviousPath() {
    if (previousPath) {
      historyPush(previousPath, { keepScrollState: true });
    }
  }

  const keyHandlers = {
    NEXT: goToNextPath,
    PREVIOUS: goToPreviousPath
  };

  return (
    <BaseDialog
      title={title}
      open={!!isVisible}
      onClose={handleClose}
      onExited={handleExited}
      zeroPaddingContent
    >
      <FullScreen
        enabled={!isVideoPlayer && isFullScreen}
        onChange={enabled => setIsFullScreen(enabled)}
      >
        <HotKeys keyMap={keyMap} handlers={keyHandlers} allowChanges={true}>
          <StyledBox position="relative">
            {isVideoPlayer ? (
              <YouTubePlayer youTubeId={dataSource[activeStepIndex]} />
            ) : (
              <MediaGalleryModalImageViewer
                filePath={dataSource[activeStepIndex]}
              />
            )}
            <MediaGalleryModalStepper
              onClickPrevious={previousPath ? goToPreviousPath : null}
              onClickNext={nextPath ? goToNextPath : null}
            />
            {!isVideoPlayer && (
              <IconButton
                className={classes.fullScreenButton}
                onClick={() => setIsFullScreen(!isFullScreen)}
              >
                {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            )}
          </StyledBox>
        </HotKeys>
      </FullScreen>
    </BaseDialog>
  );
}

export default MediaGalleryModal;
