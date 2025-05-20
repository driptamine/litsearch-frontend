// import React from "react";
// import { useDropzone } from "react-dropzone";
// import clsx from "clsx";
// import axios from "axios";
//
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import CssBaseline from "@mui/material/CssBaseline";
// import Container from "@mui/material/Container";
// import Paper from "@mui/material/Paper";
// import Grid from "@mui/material/Grid";
// import Divider from "@mui/material/Divider";
// // import RootRef from "@mui/material/RootRef";
// import { makeStyles } from "@mui/material/styles";
// import CircularProgress from "@mui/material/CircularProgress";
// import { green } from "@mui/material/colors";
// import Button from "@mui/material/Button";
// import Fab from "@mui/material/Fab";
// import CheckIcon from "@mui/icons-material/Check";
// import CloudUpload from "@mui/icons-material/CloudUpload";
// import { LinearProgress } from "@mui/material";
//
//
//
// // import CropImage from "./CropImage";
// axios.defaults.xsrfCookieName = 'csrftoken'
// axios.defaults.xsrfHeaderName = 'X-CSRFToken'
//
// const useStyles = makeStyles((theme) => ({
//   dropzoneContainer: {
//     height: 300,
//     background: "#efefef",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     borderStyle: "dashed",
//     borderColor: "#aaa",
//   },
//   preview: {
//     width: 250,
//     height: 250,
//     margin: "auto",
//     display: "block",
//     marginBottom: theme.spacing(2),
//     objectFit: "contain",
//   },
//   wrapper: {
//     margin: theme.spacing(1),
//     position: "relative",
//   },
//   buttonSuccess: {
//     backgroundColor: green[500],
//     "&:hover": {
//       backgroundColor: green[700],
//     },
//   },
//   fabProgress: {
//     color: green[500],
//     position: "absolute",
//     top: -6,
//     left: -6,
//     zIndex: 1,
//   },
//   buttonProgress: {
//     color: green[500],
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     marginTop: -12,
//     marginLeft: -12,
//   },
// }));
//
// // const chunkSize = 3 * 1024;
// const chunkSize = 1048576 * 3;//its 3MB, increase the number measure in mb
//
// function FileUpload() {
//   // const classes = useStyles();
//   const [loading, setLoading] = React.useState(false);
//   const [success, setSuccess] = React.useState(false);
//   const [file, setFile] = React.useState();
//
//   const [qqfile, setqqfile] = React.useState();
//   const [qquuid, setqquuid] = React.useState();
//   const [qqfilename, setqqfilename] = React.useState();
//   const [qqpartindex, setqqpartindex] = React.useState();
//   const [qqchunksize, setqqchunksize] = React.useState();
//   const [qqtotalparts, setqqtotalparts] = React.useState();
//   const [qqtotalfilesize, setqqtotalfilesize] = React.useState();
//   const [qqpartbyteoffset, setqqpartbyteoffset] = React.useState();
//
//   const [preview, setPreview] = React.useState();
//   const [percent, setPercent] = React.useState(0);
//   const [downloadUri, setDownloadUri] = React.useState();
//   const [selectedImageFile, setSelectedImageFile] = React.useState();
//
//   const buttonClassname = clsx({
//     [classes.buttonSuccess]: success,
//   });
//
//   const onDrop = React.useCallback((acceptedFiles) => {
//     const fileDropped = acceptedFiles[0];
//     if (fileDropped["type"].split("/")[0] === "image") {
//       setSelectedImageFile(fileDropped);
//       return;
//     }
//     setFile(fileDropped);
//     const previewUrl = URL.createObjectURL(fileDropped);
//     setPreview(previewUrl);
//     setSuccess(false);
//     setPercent(0);
//   });
//
//   const { getRootProps, getInputProps } = useDropzone({
//     multiple: false,
//     onDrop,
//   });
//
//   const { ref, ...rootProps } = getRootProps();
//
//   const uploadFile = async () => {
//     try {
//       setSuccess(false);
//       setLoading(true);
//       const formData = new FormData();
//
//       qqtotalparts = Math.ceil(file.size / chunkSize);
//       // formData.append("file", file);
//       // formData.append("file", file);
//       formData.append("qqfile", file);
//       // formData.append("qquuid", file);
//       // formData.append("qqfilename", file);
//
//       // formData.append("qqpartindex", file);
//       formData.append("qqchunksize", chunkSize);
//       formData.append("qqtotalparts", qqtotalparts);
//       // formData.append("qqtotalfilesize", file);
//       // formData.append("qqpartbyteoffset", file);
//
//       // const API_URL = "http://localhost:8080/files";
//       const API_URL = "http://localhost:8000/fu/upload";
//
//       const response = await axios.post(API_URL, formData, {
//         onUploadProgress: (progressEvent) => {
//           const percentCompleted = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           );
//           setPercent(percentCompleted);
//         },
//       });
//       // const response = await axios({
//       //   method: 'POST',
//       //   url: API_URL,
//       //   data: formData,
//       //   {
//       //     onUploadProgress: (progressEvent) => {
//       //       const percentCompleted = Math.round(
//       //         (progressEvent.loaded * 100) / progressEvent.total
//       //       );
//       //       setPercent(percentCompleted);
//       //     }
//       //   }
//       // })
//       setDownloadUri(response.data.fileDownloadUri);
//       setSuccess(true);
//       setLoading(false);
//     } catch (err) {
//       alert(err.message);
//     }
//   };
//
//   const onCropSave = ({ file, preview }) => {
//     setPreview(preview);
//     setFile(file);
//     setSuccess(false);
//     setPercent(0);
//   };
//
//   return (
//     <>
//       {/*<CssBaseline />*/}
//       {/*<AppBar position="fixed">
//         <Toolbar>
//           <Typography variant="h6">React File Upload</Typography>
//         </Toolbar>
//       </AppBar>*/}
//       {/*<Toolbar />*/}
//       {/*<Toolbar />*/}
//
//       <Container maxWidth="md">
//         <Paper elevation={4}>
//           <Grid container>
//             <Grid item xs={12}>
//               <Typography align="center" style={{ padding: 16 }}>
//                 File Upload
//               </Typography>
//               <Divider />
//             </Grid>
//
//             <Grid item xs={6} style={{ padding: 16 }}>
//               <button ref={ref}>
//                 <Paper
//                   {...rootProps}
//                   elevation={0}
//                   className={classes.dropzoneContainer}
//                 >
//                   <input {...getInputProps()} />
//                   <p style={{color: 'black'}}>Drag 'n' drop some files here, or click to select files</p>
//                 </Paper>
//               </button>
//             </Grid>
//
//             <Grid item xs={6} style={{ padding: 16 }}>
//               <Typography align="center" variant="subtitle1">
//                 Preview
//               </Typography>
//               <img
//                 onLoad={() => URL.revokeObjectURL(preview)}
//                 className={classes.preview}
//                 src={preview || "https://via.placeholder.com/250"}
//               />
//
//               {/*  */}
//               {file && (
//                 <>
//                   <Divider />
//                   <Grid
//                     container
//                     style={{ marginTop: 16 }}
//                     alignItems="center"
//                     spacing={3}
//                   >
//                     <Grid item xs={2}>
//                       <div className={classes.wrapper}>
//                         <Fab
//                           aria-label="save"
//                           color="primary"
//                           className={buttonClassname}
//                           onClick={uploadFile}
//                         >
//                           {success ? <CheckIcon /> : <CloudUpload />}
//                         </Fab>
//                         {loading && (
//                           <CircularProgress
//                             size={68}
//                             className={classes.fabProgress}
//                           />
//                         )}
//                       </div>
//                     </Grid>
//
//                     <Grid item xs={10}>
//                       {file && (
//                         <Typography variant="body">{file.name}</Typography>
//                       )}
//                       {loading && (
//                         <div>
//                           <LinearProgress
//                             variant="determinate"
//                             value={percent}
//                           />
//                           <div
//                             style={{
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                             }}
//                           >
//                             <Typography variant="body">{percent}%</Typography>
//                           </div>
//                         </div>
//                       )}
//
//                       {success && (
//                         <Typography>
//                           File Upload Success!{" "}
//                           <a href={downloadUri} target="_blank">
//                             File Url
//                           </a>
//                         </Typography>
//                       )}
//                     </Grid>
//                   </Grid>
//                 </>
//               )}
//               {/*  */}
//             </Grid>
//           </Grid>
//         </Paper>
//       </Container>
//
//       {/*<CropImage onSave={onCropSave} selectedFile={selectedImageFile} />*/}
//     </>
//   );
// }
//
// export default FileUpload;
//
// // qqfile
// // qquuid
// // qqfilename
// // qqpartindex
// // qqchunksize
// // qqtotalparts
// // qqtotalfilesize
// // qqpartbyteoffset
//
// // fu/upload?done
// // qquuid: b201717c-9f77-452b-8d22-9d9f452f6988
// // qqfilename: ardegraph.mov
// // qqtotalfilesize: 81203011
// // qqtotalparts: 41
