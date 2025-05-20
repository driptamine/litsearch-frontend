// // REFERENCE https://github.com/vivekjne/video-player-react-youtube
//
// import React, { forwardRef, useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import styled from "styled-components";
//
//
// // MATERIAL
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import IconButton from "@mui/material/IconButton";
// import Grid from "@mui/material/Grid";
// import Slider from "@mui/material/Slider";
//
// import BookmarkIcon from "@mui/icons-material/Bookmark";
// import FastRewindIcon from "@mui/icons-material/FastRewind";
// import FastForwardIcon from "@mui/icons-material/FastForward";
// import PlayArrowIcon from "@mui/icons-material/PlayArrow";
// import PauseIcon from "@mui/icons-material/Pause";
// import Tooltip from "@mui/material/Tooltip";
//
// import VolumeUp from "@mui/icons-material/VolumeUp";
// import VolumeDown from "@mui/icons-material/VolumeDown";
// import VolumeMute from "@mui/icons-material/VolumeOff";
// import FullScreen from "@mui/icons-material/Fullscreen";
// import Popover from "@mui/material/Popover";
// import { makeStyles, withStyles } from "@mui/material/styles";
//
//
// import { TbArrowsDiagonal } from 'react-icons/tb'
// // const OG_NETFLIX = #43455f
// // const OG_TWITTER = #37416c
// // const OG_TWITTER = #353555
// // const LIT_LOOP = #6b57ea
// const VolumeSlider = styled.div`
//
// `;
//
// const DarkDivPlayToggle = styled.div`
//   /* background-color: #00000085; */
//   position: absolute;
//   padding: 200px;
//   width: 100%;
//   height: 100%;
// `;
//
// const ControlsWrapper = styled.div`
//   /* visibility: hidden; */
//
//
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   height: 100%;
//   /* background: rgba(0,0,0,0.3); */
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
// `;
//
// const StyledPlay = styled(IconButton)`
//   visibility: ${props => props.visible ? "visible" : "hidden"};
// `;
//
// const StyledGridBottom = styled(Grid)`
//   /* visibility: hidden */
//
//   /* visibility: ${props => props.playing ? "visible" : "hidden"}; */
//   padding: 6px;
// `;
//
// const useStyles = makeStyles((theme) => ({
//   button: {
//     margin: theme.spacing(1),
//   },
//   controlIcons: {
//     color: "#ffffff",
//     backgroundColor: "#00000082",
//     fontSize: 50,
//     transform: "scale(0.9)",
//     "&:hover": {
//       color: "#fff",
//       transform: "scale(1)",
//     },
//   },
//
//   bottomIcons: {
//     // color: "#999",
//     color: "#fff",
//     "&:hover": {
//       color: "#fff",
//     },
//   },
//
//   volumeSlider: {
//     width: 100,
//   },
// }));
//
// const PrettoSlider = withStyles({
//   root: {
//     height: 8,
//     // color: "#37416c",
//     // color: "#353555",
//     // color: "#4b37d7",
//     color: "#ffffff",
//     // color: "red",
//     // color: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
//     // background: "radial-gradient(circle at 20% 50%, rgba(12.55%, 24.71%, 34.51%, 0.98) 0%, rgba(12.55%, 24.71%, 34.51%, 0.88) 100%)",
//     // color: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
//
//   },
//   thumb: {
//     height: 12,
//     width: 12,
//     backgroundColor: "#fff",
//     color: "white",
//     border: "2px solid currentColor",
//     marginTop: -4,
//     marginLeft: -6,
//     "&:focus, &:hover, &$active": {
//       boxShadow: "inherit",
//     },
//   },
//   active: {},
//   valueLabel: {
//     left: "calc(-50% + 4px)",
//   },
//   track: {
//     height: 5,
//     borderRadius: 4,
//   },
//   rail: {
//     height: 5,
//     borderRadius: 4,
//   },
// })(Slider);
//
// function ValueLabelComponent(props) {
//   const { children, open, value } = props;
//
//   return (
//     <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
//       {children}
//     </Tooltip>
//   );
// }
//
// const Controls = forwardRef(
//   (
//     {
//       onSeek,
//       onSeekMouseDown,
//       onSeekMouseUp,
//       onDuration,
//       onRewind,
//       onPlayPause,
//       onFastForward,
//       playing,
//       played,
//       elapsedTime,
//       totalDuration,
//       onMute,
//       muted,
//       onVolumeSeekDown,
//       onChangeDispayFormat,
//       playbackRate,
//       onPlaybackRateChange,
//       onToggleFullScreen,
//       doubleClickToggleFullScreen,
//       volume,
//       onVolumeChange,
//       onBookmark,
//     },
//     ref
//   ) => {
//     // const classes = useStyles();
//     const [anchorEl, setAnchorEl] = React.useState(null);
//     const handleClick = (event) => {
//       setAnchorEl(event.currentTarget);
//     };
//
//     // useEffect(() => {
//     //   document.addEventListener('keydown', (e) => {
//     //     if (e.keyCode === 32) {
//     //       e.preventDefault();
//     //       // this.ref.player.pause();
//     //       onPlayPause()
//     //     }
//     //   })
//     // })
//
//
//
//     const handleClose = () => {
//       setAnchorEl(null);
//     };
//
//     const open = Boolean(anchorEl);
//     const id = open ? "simple-popover" : undefined;
//     const [hide, setHide] = useState(false);
//     return (
//
//       <ControlsWrapper ref={ref}>
//         <Grid
//           container
//           direction="column"
//           justify="space-between"
//           style={{ flexGrow: 1 }}
//         >
//           <Grid
//             container
//             direction="row"
//             alignItems="center"
//             justify="space-between"
//             style
//             style={{ padding: 16 }}
//             onClick={onPlayPause}
//           >
//             {/*<Grid item>
//               <Typography variant="h5" style={{ color: "#fff" }}>
//                 Crystal Castles - Kerosene
//               </Typography>
//             </Grid>*/}
//             {/*<Grid item>
//               <Button
//                 onClick={onBookmark}
//                 variant="contained"
//                 // color="#4b37d7"
//                 style={{
//                   backgroundColor: "#117468",
//                   // backgroundColor: "#4b37d7"
//                 }}
//                 startIcon={<BookmarkIcon />}
//               >
//
//               </Button>
//             </Grid>*/}
//           </Grid>
//
//           <Grid container  direction="row" alignItems="center" justify="center">
//             {/*<IconButton
//               onClick={onRewind}
//               className={classes.controlIcons}
//               aria-label="rewind"
//             >
//               <FastRewindIcon
//                 className={classes.controlIcons}
//                 fontSize="inherit"
//               />
//             </IconButton>*/}
//
//             {/*{!playing ? (
//               <StyledPlay
//                 onClick={onPlayPause}
//                 className={classes.controlIcons}
//                 visible
//                 >
//                 <PlayArrowIcon fontSize="large" />
//               </StyledPlay>
//             ) : null}*/}
//
//             {/*<IconButton
//               onClick={onPlayPause}
//               className={classes.controlIcons}
//               // aria-label="play"
//             >
//               {playing ? (
//                 <PauseIcon fontSize="large" />
//               ) : (
//                 <PlayArrowIcon fontSize="large" />
//               )}
//
//
//             </IconButton>*/}
//
//             {/*<IconButton
//               onClick={onFastForward}
//               className={classes.controlIcons}
//               aria-label="forward"
//             >
//               <FastForwardIcon fontSize="inherit" />
//             </IconButton>*/}
//           </Grid>
//
//           {/*<DarkDivPlayToggle onClick={doubleClickToggleFullScreen} />*/}
//           {/* bottom controls */}
//           <StyledGridBottom
//             // playing={playing}
//             container
//             direction="row"
//             justify="space-between"
//             alignItems="center"
//             // visible
//             // style={{ padding: 6 }}
//           >
//             <Grid item xs={12}>
//               <PrettoSlider
//                 aria-label="custom thumb label"
//                 min={0}
//                 max={100}
//                 ValueLabelComponent={(props) => (
//                   <ValueLabelComponent {...props} value={elapsedTime} />
//                 )}
//
//                 value={played * 100}
//                 onChange={onSeek}
//                 onMouseDown={onSeekMouseDown}
//                 onChangeCommitted={onSeekMouseUp}
//                 onDuration={onDuration}
//               />
//             </Grid>
//
//             <Grid item>
//               <Grid container alignItems="center">
//                 <IconButton
//                   onClick={onPlayPause}
//                   className={classes.bottomIcons}
//                 >
//                   {playing ? (
//                     <PauseIcon fontSize="small" />
//                   ) : (
//                     <PlayArrowIcon fontSize="small" />
//                   )}
//                 </IconButton>
//
//
//                 <Button
//                   variant="text"
//                   onClick={
//                     onChangeDispayFormat
//                     //     () =>
//                     //   setTimeDisplayFormat(
//                     //     timeDisplayFormat == "normal" ? "remaining" : "normal"
//                     //   )
//                   }
//                 >
//                   <Typography
//                     variant="body1"
//                     style={{ color: "#fff", marginLeft: 16 }}
//                   >
//                     {elapsedTime}/{totalDuration}
//                   </Typography>
//                 </Button>
//               </Grid>
//             </Grid>
//
//             <Grid item>
//               {/* Playback Rate */}
//
//               {/*<Button
//                 onClick={handleClick}
//                 aria-describedby={id}
//                 className={classes.bottomIcons}
//                 variant="text"
//               >
//                 <Typography>{playbackRate}X</Typography>
//               </Button>
//
//               <Popover
//                 container={ref.current}
//                 open={open}
//                 id={id}
//                 onClose={handleClose}
//                 anchorEl={anchorEl}
//                 anchorOrigin={{
//                   vertical: "top",
//                   horizontal: "left",
//                 }}
//                 transformOrigin={{
//                   vertical: "bottom",
//                   horizontal: "left",
//                 }}
//               >
//                 <Grid container direction="column-reverse">
//                   {[0.5, 1, 1.5, 2].map((rate) => (
//                     <Button
//                       key={rate}
//                       //   onClick={() => setState({ ...state, playbackRate: rate })}
//                       onClick={() => onPlaybackRateChange(rate)}
//                       variant="text"
//                     >
//                       <Typography
//                         color={rate === playbackRate ? "secondary" : "inherit"}
//                       >
//                         {rate}X
//                       </Typography>
//                     </Button>
//                   ))}
//                 </Grid>
//               </Popover>*/}
//               <IconButton
//                 // onClick={() => setState({ ...state, muted: !state.muted })}
//                 onClick={onMute}
//                 className={`${classes.bottomIcons} ${classes.volumeButton}`}
//               >
//                 {muted ? (
//                   <VolumeMute fontSize="small" />
//                 ) : volume > 0.5 ? (
//                   <VolumeUp fontSize="small" />
//                 ) : (
//                   <VolumeDown fontSize="large" />
//                 )}
//               </IconButton>
//               {/*<VolumeSlider
//                 <Slider
//                   min={0}
//                   max={100}
//                   value={muted ? 0 : volume * 100}
//                   onChange={onVolumeChange}
//                   aria-labelledby="input-slider"
//                   className={classes.volumeSlider}
//                   onMouseDown={onSeekMouseDown}
//                   onChangeCommitted={onVolumeSeekDown}
//                 />
//               </VolumeSlider>*/}
//               <IconButton
//                 onClick={onToggleFullScreen}
//                 className={classes.bottomIcons}
//               >
//                 <TbArrowsDiagonal fontSize="medium" />
//               </IconButton>
//             </Grid>
//           </StyledGridBottom>
//         </Grid>
//       </ControlsWrapper>
//     );
//   }
// );
//
// Controls.propTypes = {
//   onSeek: PropTypes.func,
//   onSeekMouseDown: PropTypes.func,
//   onSeekMouseUp: PropTypes.func,
//   onDuration: PropTypes.func,
//   onRewind: PropTypes.func,
//   onPlayPause: PropTypes.func,
//   onFastForward: PropTypes.func,
//   onVolumeSeekDown: PropTypes.func,
//   onChangeDispayFormat: PropTypes.func,
//   onPlaybackRateChange: PropTypes.func,
//   onToggleFullScreen: PropTypes.func,
//   onMute: PropTypes.func,
//   playing: PropTypes.bool,
//   played: PropTypes.number,
//   elapsedTime: PropTypes.string,
//   totalDuration: PropTypes.string,
//   muted: PropTypes.bool,
//   playbackRate: PropTypes.number,
// };
// export default Controls;
