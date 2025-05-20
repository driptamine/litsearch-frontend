import { createGlobalStyle } from "styled-components";

const GlobalStyleThemeMode = createGlobalStyle`
	body {
		margin: 0;
		// background: #181818;
		// background: red;
		background: ${({ theme }) => theme.body};
		color: ${({ theme }) => theme.text};
	}



	::-webkit-scrollbar {
	  /* display: none; */
		background: transparent;
  }
	::-webkit-scrollbar-thumb {
	  /* display: none; */

		border: 5px solid transparent;
    background: hsla(0,0%,100%,.3);
		background-clip: content-box;
		border-radius: 10px;

  }
`;

export default GlobalStyleThemeMode;
