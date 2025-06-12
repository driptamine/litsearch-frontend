import React from 'react';
import styled from 'styled-components';

export const PlayIcon = (props) => (
  <svg
    fill="none"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
    >
    <path
      clip-rule="evenodd"
      d="M12 24a12 12 0 1 0 0-24 12 12 0 0 0 0 24zm5.02-11.13c.64-.39.64-1.36 0-1.74l-6.6-4C9.77 6.75 9 7.23 9 8v8c0 .76.78 1.25 1.41.87z"
      fill="currentColor"
      fill-rule="evenodd">
    </path>
  </svg>
);

export const FullScreenIcon = (props) => (
  <svg
    class="svg-icon"
    // style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg">

  <path
    d="M237.248 192H352a32 32 0 1 0 0-64H160a32 32 0 0 0-32 32v192a32 32 0 1 0 64 0v-114.752l137.36 137.36a32 32 0 1 0 45.232-45.264L237.248 192zM832 237.248V352a32 32 0 1 0 64 0V160a32 32 0 0 0-32-32H672a32 32 0 1 0 0 64h114.752l-137.36 137.36a32 32 0 1 0 45.264 45.232L832 237.248zM237.248 832H352a32 32 0 1 1 0 64H160a32 32 0 0 1-32-32V672a32 32 0 1 1 64 0v114.752l137.36-137.36a32 32 0 1 1 45.232 45.264L237.248 832zM832 786.752V672a32 32 0 1 1 64 0v192a32 32 0 0 1-32 32H672a32 32 0 1 1 0-64h114.752l-137.36-137.36a32 32 0 1 1 45.264-45.232L832 786.752z"
    />
  </svg>

);
export const SearchIcon = (props) => (
  <svg
    data-encore-id="icon"
    role="img" aria-hidden="true"
    class="Svg-sc-ytk21e-0 bHdpig TTmGm8qVTZIyhkzEGOqr"
    viewBox="0 0 24 24">
    <path
    d="M10.533 1.27893C5.35215 1.27893 1.12598 5.41887 1.12598 10.5579C1.12598 15.697 5.35215 19.8369 10.533 19.8369C12.767 19.8369 14.8235 19.0671 16.4402 17.7794L20.7929 22.132C21.1834 22.5226 21.8166 22.5226 22.2071 22.132C22.5976 21.7415 22.5976 21.1083 22.2071 20.7178L17.8634 16.3741C19.1616 14.7849 19.94 12.7634 19.94 10.5579C19.94 5.41887 15.7138 1.27893 10.533 1.27893ZM3.12598 10.5579C3.12598 6.55226 6.42768 3.27893 10.533 3.27893C14.6383 3.27893 17.94 6.55226 17.94 10.5579C17.94 14.5636 14.6383 17.8369 10.533 17.8369C6.42768 17.8369 3.12598 14.5636 3.12598 10.5579Z">
    </path>
  </svg>

);
const StyledSVG = styled.svg`
  fill: ${props => props.theme.text};
`;

export const EarthIcon = (props) => (
  // https://www.svgrepo.com/svg/327751/earth?edit=true
  <StyledSVG
    // fill={props => props.theme.text}

    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg">
    <g id="SVGRepo_bgCarrier"
    strokeWidth="0"></g>
    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
    <title>ionicons-v5-k</title>
    <path
      d="M414.39,97.74A224,224,0,1,0,97.61,414.52,224,224,0,1,0,414.39,97.74ZM64,256.13a191.63,191.63,0,0,1,6.7-50.31c7.34,15.8,18,29.45,25.25,45.66,9.37,20.84,34.53,15.06,45.64,33.32,9.86,16.21-.67,36.71,6.71,53.67,5.36,12.31,18,15,26.72,24,8.91,9.08,8.72,21.52,10.08,33.36a305.36,305.36,0,0,0,7.45,41.27c0,.1,0,.21.08.31C117.8,411.13,64,339.8,64,256.13Zm192,192a193.12,193.12,0,0,1-32-2.68c.11-2.71.16-5.24.43-7,2.43-15.9,10.39-31.45,21.13-43.35,10.61-11.74,25.15-19.68,34.11-33,8.78-13,11.41-30.5,7.79-45.69-5.33-22.44-35.82-29.93-52.26-42.1-9.45-7-17.86-17.82-30.27-18.7-5.72-.4-10.51.83-16.18-.63-5.2-1.35-9.28-4.15-14.82-3.42-10.35,1.36-16.88,12.42-28,10.92-10.55-1.41-21.42-13.76-23.82-23.81-3.08-12.92,7.14-17.11,18.09-18.26,4.57-.48,9.7-1,14.09.68,5.78,2.14,8.51,7.8,13.7,10.66,9.73,5.34,11.7-3.19,10.21-11.83-2.23-12.94-4.83-18.21,6.71-27.12,8-6.14,14.84-10.58,13.56-21.61-.76-6.48-4.31-9.41-1-15.86,2.51-4.91,9.4-9.34,13.89-12.27,11.59-7.56,49.65-7,34.1-28.16-4.57-6.21-13-17.31-21-18.83-10-1.89-14.44,9.27-21.41,14.19-7.2,5.09-21.22,10.87-28.43,3-9.7-10.59,6.43-14.06,10-21.46,1.65-3.45,0-8.24-2.78-12.75q5.41-2.28,11-4.23a15.6,15.6,0,0,0,8,3c6.69.44,13-3.18,18.84,1.38,6.48,5,11.15,11.32,19.75,12.88,8.32,1.51,17.13-3.34,19.19-11.86,1.25-5.18,0-10.65-1.2-16a190.83,190.83,0,0,1,105,32.21c-2-.76-4.39-.67-7.34.7-6.07,2.82-14.67,10-15.38,17.12-.81,8.08,11.11,9.22,16.77,9.22,8.5,0,17.11-3.8,14.37-13.62-1.19-4.26-2.81-8.69-5.42-11.37a193.27,193.27,0,0,1,18,14.14c-.09.09-.18.17-.27.27-5.76,6-12.45,10.75-16.39,18.05-2.78,5.14-5.91,7.58-11.54,8.91-3.1.73-6.64,1-9.24,3.08-7.24,5.7-3.12,19.4,3.74,23.51,8.67,5.19,21.53,2.75,28.07-4.66,5.11-5.8,8.12-15.87,17.31-15.86a15.4,15.4,0,0,1,10.82,4.41c3.8,3.94,3.05,7.62,3.86,12.54,1.43,8.74,9.14,4,13.83-.41a192.12,192.12,0,0,1,9.24,18.77c-5.16,7.43-9.26,15.53-21.67,6.87-7.43-5.19-12-12.72-21.33-15.06-8.15-2-16.5.08-24.55,1.47-9.15,1.59-20,2.29-26.94,9.22-6.71,6.68-10.26,15.62-17.4,22.33-13.81,13-19.64,27.19-10.7,45.57,8.6,17.67,26.59,27.26,46,26,19.07-1.27,38.88-12.33,38.33,15.38-.2,9.81,1.85,16.6,4.86,25.71,2.79,8.4,2.6,16.54,3.24,25.21A158,158,0,0,0,407.43,374,191.75,191.75,0,0,1,256,448.13Z">
    </path>
    </g>
  </StyledSVG>
);

export const HomeIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
    focusable="false"
    height="22"
    width="22"
    fill="#AAAAAA"
  >
    <g>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8"></path>
    </g>
  </svg>
);

export const TrendingIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
    focusable="false"
    height="22"
    width="22"
    // fill="#ffffff"
  >
    <g>
      <path d="M17.53 11.2c-.23-.3-.5-.56-.76-.82-.65-.6-1.4-1.03-2.03-1.66-1.46-1.46-1.78-3.87-.85-5.72-.9.23-1.75.75-2.45 1.32C8.9 6.4 7.9 10.07 9.1 13.22c.04.1.08.2.08.33 0 .22-.15.42-.35.5-.22.1-.46.04-.64-.12-.06-.05-.1-.1-.15-.17-1.1-1.43-1.28-3.48-.53-5.12C5.87 10 5 12.3 5.12 14.47c.04.5.1 1 .27 1.5.14.6.4 1.2.72 1.73 1.04 1.73 2.87 2.97 4.84 3.22 2.1.27 4.35-.12 5.96-1.6 1.8-1.66 2.45-4.3 1.5-6.6l-.13-.26c-.2-.45-.47-.87-.78-1.25zm-3.1 6.3c-.28.24-.73.5-1.08.6-1.1.38-2.2-.16-2.88-.82 1.2-.28 1.9-1.16 2.1-2.05.17-.8-.14-1.46-.27-2.23-.12-.74-.1-1.37.2-2.06.15.38.35.76.58 1.06.76 1 1.95 1.44 2.2 2.8.04.14.06.28.06.43.03.82-.32 1.72-.92 2.26z"></path>
    </g>
  </svg>
);
export const PicIcon = (props) => (
  <svg focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0h24v24H0z" fill="none">
    </path>
    <path d="M14 13l4 5H6l4-4 1.79 1.78L14 13zm-6.01-2.99A2 2 0 0 0 8 6a2 2 0 0 0-.01 4.01zM22 5v14a3 3 0 0 1-3 2.99H5c-1.64 0-3-1.36-3-3V5c0-1.64 1.36-3 3-3h14c1.65 0 3 1.36 3 3zm-2.01 0a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h7v-.01h7a1 1 0 0 0 1-1V5z">
    </path>
  </svg>
);

export const SubIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
    focusable="false"
    height="22"
    width="22"
    fill="#AAAAAA"
  >
    <g>
      <path d="M18.7 8.7H5.3V7h13.4v1.7zm-1.7-5H7v1.6h10V3.7zm3.3 8.3v6.7c0 1-.7 1.6-1.6 1.6H5.3c-1 0-1.6-.7-1.6-1.6V12c0-1 .7-1.7 1.6-1.7h13.4c1 0 1.6.8 1.6 1.7zm-5 3.3l-5-2.7V18l5-2.7z"></path>
    </g>
  </svg>
);

export const LibIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
    focusable="false"
    height="22"
    width="22"
    fill="#AAAAAA"
  >
    <g>
      <path fill="none" d="M0 0h24v24H0z"></path>
      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"></path>
    </g>
  </svg>
);

export const HistoryIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
    focusable="false"
    height="22"
    width="22"
    fill="#ffffff"
  >
    <g>
      <path d="M11.9 3.75c-4.55 0-8.23 3.7-8.23 8.25H.92l3.57 3.57.04.13 3.7-3.7H5.5c0-3.54 2.87-6.42 6.42-6.42 3.54 0 6.4 2.88 6.4 6.42s-2.86 6.42-6.4 6.42c-1.78 0-3.38-.73-4.54-1.9l-1.3 1.3c1.5 1.5 3.55 2.43 5.83 2.43 4.58 0 8.28-3.7 8.28-8.25 0-4.56-3.7-8.25-8.26-8.25zM11 8.33v4.6l3.92 2.3.66-1.1-3.2-1.9v-3.9H11z"></path>
    </g>
  </svg>
);

export const VidIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
    focusable="false"
    height="22"
    width="22"
    fill="#AAAAAA"
  >
    <g>
      <path d="M18.4 5.6v12.8H5.6V5.6h12.8zm0-1.8H5.6a1.8 1.8 0 0 0-1.8 1.8v12.8a1.8 1.8 0 0 0 1.8 1.9h12.8a1.8 1.8 0 0 0 1.9-1.9V5.6a1.8 1.8 0 0 0-1.9-1.8z"></path>
      <path d="M10.2 9v6.5l5-3.2-5-3.2z"></path>
    </g>
  </svg>
);

export const WatchIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
    focusable="false"
    height="22"
    width="22"
    fill="#AAAAAA"
  >
    <g>
      <path d="M12 3.67c-4.58 0-8.33 3.75-8.33 8.33s3.75 8.33 8.33 8.33 8.33-3.75 8.33-8.33S16.58 3.67 12 3.67zm3.5 11.83l-4.33-2.67v-5h1.25v4.34l3.75 2.25-.67 1.08z"></path>
    </g>
  </svg>
);

export const MoreIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
    focusable="false"
    height="22"
    width="22"
    fill="#AAAAAA"
  >
    <g>
      <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
    </g>
  </svg>
);

export const HamburgerIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
    focusable="false"
    height="22"
    width="22"
    fill="#FFF"
  >
    <g>
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
    </g>
  </svg>
);

export const UploadIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
    height="27"
    width="27"
    fill="#FFF"
    focusable="false"
  >
    <g>
      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"></path>
    </g>
  </svg>
);

export const NotificationIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
    focusable="false"
    height="27"
    fill="#FFF"
    width="27"
  >
    <g>
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path>
    </g>
  </svg>
);

export const CloseIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
    focusable="false"
  >
    <g>
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
    </g>
  </svg>
);

export const SignoutIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
    fill=""
  >
    <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5a2 2 0 00-2 2v4h2V5h14v14H5v-4H3v4a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
  </svg>
);

export const LikeIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
    focusable="false"
    fill="#AAAAAA"
    width="22"
    height="22"
  >
    <g>
      <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"></path>
    </g>
  </svg>
);

export const DislikeIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
    focusable="false"
    width="22"
    height="22"
  >
    <g>
      <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"></path>
    </g>
  </svg>
);
