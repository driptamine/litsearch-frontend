// import React, { useState, useRef, useEffect } from "react";
// import { findDOMNode } from "react-dom";
// import ReactPlayer from "react-player";
// import screenful from "screenfull";
// import styled from "styled-components";
//

// // VIEWS
// import Controls from "./Controls";
// import { INITIAL_STATE, reducer } from 'views/components/video-player/reducer.js';
// // ICONS
// import { MdRemoveRedEye } from 'react-icons/md';
// import { FaEye } from 'react-icons/fa';
// import { FcLike, FcLikePlaceholder } from 'react-icons/fc';
//
// const DoubleClickFullScreenWrapper = styled.div`
//   padding: 200px;
// `;
//
// const ContainerStyled = styled.div`
//
// `;
//
//
// const Stats = styled.div`
//   display: grid;
//   grid-template-columns: repeat(2, 1fr);
//   grid-gap: 16em;
//   height: 100px;
//   background: black;
//   border-bottom-left-radius: 10px;
//   border-bottom-right-radius: 10px;
// `;
//
// const ViewsCounter = styled.div`
//   display: flex;
//   height: 30px;
//   align-items: center;
// `;
// const StyledFaEye = styled(FaEye)`
//   margin-right: 6px;
// `;
// const StyledSpan = styled.span`
//
// `;
// const LikesCounter = styled.div`
//   display: flex;
//   height: 30px;
//   align-items: center;
//   margin-left: 1em;
// `;
//
// const CommentsCounter = styled.div`
//
// `;
//
// const VideoPlayer = styled(ReactPlayer)`
//   background-color: black;
// `;
//
// const useStyles = makeStyles((theme) => ({
//   playerWrapper: {
//     width: "400px",
//     height: "400px",
//     // width: "100%",
//     // height: "100%",
//
//     position: "relative",
//     "&:hover": {
//       "& $controlsWrapper": {
//         visibility: "visible",
//       },
//     },
//   },
//
//   controlsWrapper: {
//     visibility: "hidden",
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     // background: "rgba(0,0,0,0.4)",
//     // background: "#37416c",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "space-between",
//   },
//   topControls: {
//     display: "flex",
//     justifyContent: "flex-end",
//     padding: theme.spacing(2),
//   },
//   middleControls: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   bottomWrapper: {
//     display: "flex",
//     flexDirection: "column",
//
//     // background: "rgba(0,0,0,0.6)",
//     // height: 60,
//     padding: theme.spacing(2),
//   },
//
//   bottomControls: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     // height:40,
//   },
//
//   button: {
//     margin: theme.spacing(1),
//   },
//   controlIcons: {
//     color: "#777",
//
//     fontSize: 50,
//     transform: "scale(0.9)",
//     "&:hover": {
//       color: "#fff",
//       transform: "scale(1)",
//     },
//   },
//
//   bottomIcons: {
//     color: "#999",
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
//   },
//   thumb: {
//     height: 24,
//     width: 24,
//     backgroundColor: "#fff",
//     border: "2px solid currentColor",
//     marginTop: -8,
//     marginLeft: -12,
//     "&:focus, &:hover, &$active": {
//       boxShadow: "inherit",
//     },
//   },
//   active: {},
//   valueLabel: {
//     left: "calc(-50% + 4px)",
//   },
//   track: {
//     height: 8,
//     borderRadius: 4,
//   },
//   rail: {
//     height: 8,
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
// const format = (seconds) => {
//   if (isNaN(seconds)) {
//     return `00:00`;
//   }
//   const date = new Date(seconds * 1000);
//   const hh = date.getUTCHours();
//   const mm = date.getUTCMinutes();
//   const ss = date.getUTCSeconds().toString().padStart(2, "0");
//   if (hh) {
//     return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
//   }
//   return `${mm}:${ss}`;
// };
//
// let count = 0;
//
// function VideoCard({url, viewsCount, likesCount}) {
//   // const classes = useStyles();
//
//   const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE)
//
//   const [showControls, setShowControls] = useState(false);
//   // const [count, setCount] = useState(0);
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const [timeDisplayFormat, setTimeDisplayFormat] = React.useState("normal");
//   const [bookmarks, setBookmarks] = useState([]);
//   const [playerstate, setPlayerState] = useState({
//     pip: false,
//     playing: false,
//     controls: false,
//     light: "https://images.unsplash.com/photo-1655601597743-7ddd6fdc2903?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80",
//     // light: true,
//     autoPlay: false,
//     muted: true,
//     played: 0,
//     duration: 0,
//     playbackRate: 1.0,
//     volume: 1,
//     loop: false,
//     seeking: false,
//   });
//
//   const playerRef = useRef(null);
//   const playerContainerRef = useRef(null);
//   const controlsRef = useRef(null);
//   const canvasRef = useRef(null);
//   const {
//     autoPlay,
//     playing,
//     controls,
//     light,
//
//     muted,
//     loop,
//     playbackRate,
//     pip,
//     played,
//     seeking,
//     volume,
//   } = playerstate;
//
//   const handlePlayPause = () => {
//     setPlayerState({ ...playerstate, playing: !playerstate.playing });
//   };
//
//   const handleRewind = () => {
//     playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
//   };
//
//   const handleFastForward = () => {
//     playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
//   };
//
//   const handleProgress = (changeState) => {
//     if (count > 3) {
//       controlsRef.current.style.visibility = "hidden";
//       count = 0;
//     }
//     if (controlsRef.current.style.visibility == "visible") {
//       count += 1;
//     }
//     if (!playerstate.seeking) {
//       setPlayerState({ ...playerstate, ...changeState });
//     }
//   };
//
//   const handleSeekChange = (e, newValue) => {
//     console.log({ newValue });
//     setPlayerState({ ...playerstate, played: parseFloat(newValue / 100) });
//   };
//
//   const handleSeekMouseDown = (e) => {
//     setPlayerState({ ...playerstate, seeking: true });
//   };
//
//   const handleSeekMouseUp = (e, newValue) => {
//     console.log({ value: e.target });
//     setPlayerState({ ...playerstate, seeking: false });
//     // console.log(sliderRef.current.value)
//     playerRef.current.seekTo(newValue / 100, "fraction");
//   };
//
//   const handleDuration = (duration) => {
//     setPlayerState({ ...playerstate, duration });
//   };
//
//   const handleVolumeSeekDown = (e, newValue) => {
//     setPlayerState({ ...playerstate, seeking: false, volume: parseFloat(newValue / 100) });
//   };
//   const handleVolumeChange = (e, newValue) => {
//     // console.log(newValue);
//     setPlayerState({
//       ...playerstate,
//       volume: parseFloat(newValue / 100),
//       muted: newValue === 0 ? true : false,
//     });
//   };
//
//   const toggleFullScreen = () => {
//     screenful.toggle(playerContainerRef.current);
//   };
//
//   const doubleClickToggleFullScreen = (event) => {
//     if (event.detail === 2) { // Double Click toggles screen
//       console.log('double click');
//       screenful.toggle(playerContainerRef.current);
//     } else { // Single Click activates Play/Pause
//       handlePlayPause();
//     }
//   }
//
//   const handleMouseMove = () => {
//     console.log("mousemove");
//     controlsRef.current.style.visibility = "visible";
//     count = 0;
//   };
//
//   const hanldeMouseLeave = () => {
//
//     controlsRef.current.style.visibility = "hidden";
//     if (!playing) {
//       controlsRef.current.style.visibility = "visible";
//     }
//     // if (!active) {
//     //   controlsRef.current.style.visibility = "hidden";
//     // }
//     count = 0;
//   };
//
//   const handleDisplayFormat = () => {
//     setTimeDisplayFormat(
//       timeDisplayFormat == "normal" ? "remaining" : "normal"
//     );
//   };
//
//   const handlePlaybackRate = (rate) => {
//     setPlayerState({ ...playerstate, playbackRate: rate });
//   };
//
//   const hanldeMute = () => {
//     setPlayerState({ ...playerstate, muted: !playerstate.muted });
//   };
//
//
//   const handlePreview = () => {
//     dispatch({ type: 'PLAY' });
//     dispatch({ type: 'LIGHT', payload: false });
//   };
//
//   const currentTime = playerRef && playerRef.current ? playerRef.current.getCurrentTime() : "00:00";
//
//   const duration = playerRef && playerRef.current ? playerRef.current.getDuration() : "00:00";
//
//   const elapsedTime = timeDisplayFormat == "normal" ? format(currentTime) : `-${format(duration - currentTime)}`;
//
//   const totalDuration = format(duration);
//
//   // const m3u8_url = "https://celestia.stream.voidboost.cc/3/1/0/2/1/0/214fd898a246ec9efbdea19ab65d8868:2021090107:b1hsaC83YXU2MFlJa2UzNnd6dkg3YXJEcmx4ZHV2bHIwTUVyMzd5ZXZtVlg0RWV2MlJwMk9MSTNEVjJjeHhFOGJmekFreWIrWUlLRUkvL1dQN3laWFE9PQ==/gxoqs.mp4:hls:manifest.m3u8"
//   // const m3u8_url = "https://mutantium.stream.voidboost.cc/1/5/1/6/7/2/b1507d3c8cf5bd6c36d090edb94cdbd6:2021091109:b1hsaC83YXU2MFlJa2UzNnd6dkg3YXJEcmx4ZHV2bHIwTUVyMzd5ZXZtVW9IUHY5Yy9TNVdZdVExSllYMXdyZXhqc2xsN0ZDanorY3ZhV2xwVjRlcXc9PQ==/goaum.mp4:hls:manifest.m3u8"
//
//   // big bunny
//   // const m3u8_url = "https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8"
//
//   // sintel
//   // const m3u8_url = "https://multiplatform-f.akamaihd.net/i/multi/april11/sintel/sintel-hd_,512x288_450_b,640x360_700_b,768x432_1000_b,1024x576_1400_m,.mp4.csmil/master.m3u8"
//   // const m3u8_url = "https://res.cloudinary.com/tylerdurden/video/upload/v1631714506/youutbeclone/pmc9juj3yuinesrz7kw0.mp4"
//
//   //  4K
//   // const m3u8_url = "https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa_video_1080_4800000.m3u8"
//   // const m3u8_url = "https://views-test-api.s3.us-west-1.amazonaws.com/Golden+dunes.mp4"
//   // const m3u8_url = "https://views-test-api.s3.us-west-1.amazonaws.com/Crystal+Castles+-+Kerosene(American+Psycho).mp4"
//
//
//   // useEffect(() => {
//   //   document.addEventListener('keydown', (e) => {
//   //     if (e.keyCode === 32) {
//   //       e.preventDefault();
//   //       // this.ref.player.pause();
//   //       handlePlayPause()
//   //     }
//   //   })
//   // })
//
//   return (
//     <>
//       {/*<AppBar position="fixed">
//         <Toolbar>
//           <Typography>React Video Player</Typography>
//         </Toolbar>
//       </AppBar>*/}
//       {/*<Toolbar />*/}
//
//
//       <ContainerStyled maxWidth="sm">
//         <div
//           onMouseMove={handleMouseMove}
//           onMouseLeave={hanldeMouseLeave}
//           ref={playerContainerRef}
//           className={classes.playerWrapper}
//
//         >
//           {/*<PlayArrowIcon
//             sx={{
//               color: 'white',
//               fontSize: '6rem',
//             }}
//           />*/}
//           {/*<DoubleClickFullScreenWrapper onClick={doubleClickToggleFullScreen} />*/}
//           <VideoPlayer
//             ref={playerRef}
//             // width="400px"
//             // height="400px"
//             autoPlay={autoPlay}
//             // playIcon={<PlayArrowIcon />}
//             // light="https://i.stack.imgur.com/zw9Iz.png"
//             width="100%"
//             height="100%"
//             // url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
//             // url="https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8"
//             // url="https://vimeo.com/243556536"
//             url={url}
//             pip={pip}
//             playing={playing}
//             controls={false}
//             light={light}
//             loop={loop}
//             playbackRate={playbackRate}
//             volume={volume}
//             muted={false}
//             onProgress={handleProgress}
//             onClickPreview={handlePreview}
//             config={{
//               file: {
//                 attributes: {
//                   crossorigin: "anonymous",
//                   // forceHLS:
//                 },
//               },
//             }}
//           />
//
//           <Controls
//             ref={controlsRef}
//             onSeek={handleSeekChange}
//             onSeekMouseDown={handleSeekMouseDown}
//             onSeekMouseUp={handleSeekMouseUp}
//             onDuration={handleDuration}
//             onRewind={handleRewind}
//             onPlayPause={handlePlayPause}
//             onFastForward={handleFastForward}
//
//             playing={playing}
//             played={played}
//             elapsedTime={elapsedTime}
//             totalDuration={totalDuration}
//             onMute={hanldeMute}
//             muted={false}
//             onVolumeChange={handleVolumeChange}
//             onVolumeSeekDown={handleVolumeSeekDown}
//             onChangeDispayFormat={handleDisplayFormat}
//             playbackRate={playbackRate}
//             onPlaybackRateChange={handlePlaybackRate}
//             onToggleFullScreen={toggleFullScreen}
//             doubleClickToggleFullScreen={doubleClickToggleFullScreen}
//             volume={volume}
//             // onBookmark={addBookmark}
//           />
//         </div>
//
//         <Stats>
//           <LikesCounter><FcLike /><StyledSpan>{likesCount}</StyledSpan> </LikesCounter>
//           <ViewsCounter><StyledFaEye /><StyledSpan>{viewsCount}</StyledSpan></ViewsCounter>
//
//         </Stats>
//
//       </ContainerStyled>
//
//     </>
//   );
// }
//
// export default VideoCard;
