import React, { useState, useEffect, useContext } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import styled, { css, keyframes } from 'styled-components';


import { fetchQuerySearch } from 'core/actions';
import { selectors } from 'core/reducers/index';

import { FaUpload } from 'react-icons/fa';
import { FaCloudUploadAlt } from 'react-icons/fa';

import { ImContrast } from 'react-icons/im';
// import { useDarkMode } from './components/useDarkMode'

// VIEWS
// import SearchApp from 'views/pages/MainSearch/searchbar/App';
// import Autocomplete from 'views/pages/MainSearch/autocomplete/Autocomplete';
import Autocomplete from 'views/pages/MainSearch/AppHeader/Autocomplete';
import { SearchBar } from 'views/pages/MainSearch/searchbar/SearchBar';
import { SearchResultsList } from 'views/pages/MainSearch/searchbar/SearchResultsList';


import RouterLink from './RouterLink';
import ModalLink from 'views/components/ModalLink';
import MovieAndPersonAutoSearch from 'views/components/MovieAndPersonAutoSearch';
import DrawerToggleButton from 'views/components/DrawerToggleButton';
import AvatarHover from 'views/components/AvatarHover';
// import litloopLogo from 'views/assets/litloopLogo3.png';
// import litLightLogo from 'views/assets/viewsLogos/purple-views-logo.png';
import litLightLogo from 'views/assets/viewsLogos/purple-views-logo-light.png';
import litNightLogo from 'views/assets/viewsLogos/views-logo-official.png';

import Dropdown from 'views/components/Dropdown/Dropdown';
import DropdownV2 from 'views/components/Dropdown/DropdownV2';
import DropdownPortal from 'views/components/Dropdown/DropdownPortal';
import DropDownNew from 'views/components/DropdownV2/DropDown';


import Toggle from 'views/components/Toggle/Toggler';
import { useThemeMode } from 'views/components/Toggle/useThemeMode'

import { TwitchContext, TwitchProvider } from 'views/pages/Auth/twitch/useToken';

// CORE
import useDetectMobile from 'core/hooks/useDetectMobile';
import HideOnScroll from './HideOnScroll';
import { getState } from 'core/store';

const authUser = getState().users;


const AppHeader = React.forwardRef((props, ref) => {

  // const [results, setResults] = useState([]);
  // const [suggestions, setSuggestions] = useState([]);

  const [theme, themeToggler, mountedComponent] = useThemeMode();

  // const { themesArray, setActiveTheme, activeTheme } = useContext(ThemeContext);

  // const classes = useStyles();
  const isMobile = useDetectMobile();
  const { twitchProfileImage } = useContext(TwitchContext) || {};
  // const { twitchProfileImage } = useContext(TwitchContext);
  const [isMobileSearch, setIsMobileSearch] = useState(false);
  const [childMessage, setChildMessage] = useState("");

  const { userProfile } = props;

  const user = useSelector((state) => state.users);

  const authed = getState().users.access_token;
  const oauthed = getState().users.google_oauth.oauthed;


  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState(1);

  const changeState = (optionName) => {
    setState(optionName);
  };


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };


  useEffect(() => {
    if (!isMobile) {
      setIsMobileSearch(false);
    }
  }, [isMobile]);

  function showMobileSearch() {
    setIsMobileSearch(true);
  }

  function hideMobileSearch() {
    setIsMobileSearch(false);
  }

  // useEffect(() => {
  //   const childResponse = (event) => {
  //     if (event?.data) {
  //       // console.log(event.data);
  //       // setChildMessage(event.data);
  //       console.log(event.data.profileImg);
  //       setChildMessage(event.data.profileImg)
  //     }
  //   };
  //   window.addEventListener("message", childResponse);
  //   return () => window.removeEventListener("message", childResponse);
  //
  // }, []);

  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const handleDropdownOpen = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const handleMenuOne = () => {
    console.log('clicked one');
  };

  const handleMenuTwo = () => {
    console.log('clicked two');
  };


  const is_authorized = () => {

    console.log(user);
    console.log(oauthed);
    console.log(authed);
    if (oauthed) {
      <AvatarHover avatarUrl={getState().users.google_oauth.profileImg} />
    } else if (authed) {
      <AvatarHover avatarUrl={getState().users.avatar} />
    } else {
      <LoginWrapper>
        <LoginBtn
          // color="secondary"
          variant="contained"
          to="/login"
          // onClick={()=> {fetchAuthUser(data)}}
          >Log In
        </LoginBtn>
      </LoginWrapper>
    }
  }
  const is_oauthorized = () => {

    console.log(oauthed);
    console.log(authed);
    if (oauthed) {
      <DropDown
        options={['Profile', 'Switch Accounts', 'Liked', 'Settings']}
        defaultText={<AvatarHover avatarUrl={getState().users.avatar} />}
        changeOptionName={changeState}
      />
    } else if (authed) {
      <DropDown
        options={['Profile', 'Switch Accounts', 'Liked', 'Settings']}
        defaultText={<AvatarHover avatarUrl={getState().users.avatar} />}
        changeOptionName={changeState}
      />
    } else {
      <LoginWrapper>
        <LoginBtn
          // color="secondary"
          variant="contained"
          to="/login"
          // onClick={()=> {fetchAuthUser(data)}}
          >Log In
        </LoginBtn>
      </LoginWrapper>
    }
  }

  // console.log(user.google_oauth);
  const is_authorized_v2 = () => {

    console.log(user);
    // console.log(oauthed);
    // console.log(authed);
    console.log(user.google_oauth.oauthed);
    console.log(user.google_oauth.service);

    if (user.google_oauth.oauthed) {
      <AvatarHover avatarUrl={user.google_oauth.profileImg} />
    } else if (authed) {
      <AvatarHover avatarUrl={user.avatar} />
    } else {
      <LoginWrapper>
        <LoginBtn
          // color="secondary"
          variant="contained"
          to="/login"
          // onClick={()=> {fetchAuthUser(data)}}
          >Log In
        </LoginBtn>
      </LoginWrapper>
    }
  }
  const is_oauthorized_v2 = () => {

    console.log(oauthed);
    console.log(authed);
    if (oauthed) {
      <DropDown
        options={['Profile', 'Switch Accounts', 'Liked', 'Settings']}
        defaultText={<AvatarHover avatarUrl={getState().users.avatar} />}
        changeOptionName={changeState}
      />
    } else if (authed) {
      <DropDown
        options={['Profile', 'Switch Accounts', 'Liked', 'Settings']}
        defaultText={<AvatarHover avatarUrl={getState().users.avatar} />}
        changeOptionName={changeState}
      />
    } else {
      <LoginWrapper>
        <LoginBtn
          // color="secondary"
          variant="contained"
          to="/login"
          // onClick={()=> {fetchAuthUser(data)}}
          >Log In
        </LoginBtn>
      </LoginWrapper>
    }
  }


  const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', ]
  const dispatch = useDispatch();
  const [results, setResults] = useState([]);

  const [value, setValue] = useState('')
  const [searchValue, setSearchValue] = useState("");

  const movieIds = useSelector(state => selectors.selectMovieSearchResultIds(state, searchValue)) || [];
  const albumIds = useSelector(state => selectors.selectAlbumSearchResultIds(state, searchValue)) || [];
  const queryIds = useSelector(state => selectors.selectQuerySearchResultIds(state, searchValue)) || [];
  const movies = useSelector(state => selectors.selectMovies(state, movieIds));
  const albums = useSelector(state => selectors.selectAlbums(state, albumIds));
  const queries = useSelector(state => selectors.selectQueries(state, queryIds));

  let suggestionz = [
    ...movies.slice(0, 3).map(movie => ({ ...movie, suggestionType: "movie" })),
    ...albums.slice(0, 3).map(album => ({ ...album, suggestionType: "album" })),
    ...queries.slice(0, 20).map(query => ({ ...query, suggestionType: "query" })),
  ];
  useEffect(() => {
    dispatch(fetchQuerySearch(searchValue));
  }, [dispatch, searchValue]);

  function handleInputValueChange(inputValue) {
    setSearchValue(inputValue);
  }


  return (
    // <HideOnScroll>

      <StyledAppBar ref={ref}>
        <StyledToolbar
          // className={classes.toolbar}
        >

          {(!isMobile || !isMobileSearch) && (
            <Logo>

              <LogoSpan className="LitLoop">
                <LinkStyled
                  to={"/"}
                  color="inherit"
                >
                  {/*<LitLoopLogo src={props.theme  ? 'nuk' : litLightLogo } />*/}
                  <LitLoopLogo className="ToggleLogo" src={props.themez === 'light'  ? litNightLogo : litLightLogo } />
                  {/*<LitLoopLogo className="ToggleLogo" src={props.themez.imgSrc} />*/}


                  {/*<div className="litloop_logo_title">
                    LitSearch
                  </div>*/}
                </LinkStyled>
              </LogoSpan>
            </Logo>
          )}

          {isMobile ? (
            isMobileSearch ? (
              <>
                <StyledIconButton
                  // className={classes.closeMobileSearchButton}
                  onClick={hideMobileSearch}
                >
                  <StyledCloseIcon />
                </StyledIconButton>
                {/*<MovieAndPersonAutoSearch autoFocus />*/}
              </>
            ) : (
              <>
                <StyledBox flex={1} />
                <StyledIconButton onClick={showMobileSearch}>
                  <StyledSearchIcon />
                </StyledIconButton>
              </>
            )
          ) : (
            <StyledBox
              flex={1}
              mx={2}

              justifyContent="center"
              >
              {/*<MovieAndPersonAutoSearch />*/}
              <StyledDiv className="aaa">

              <Autocomplete
                suggestions={suggestionz}
                output={(e) => setValue(e)}
                // suggestions={months}
                // suggestions={suggestionz}
                clearIcon={true}
                renderInput={(params, ref) => (
                  <InputStyled
                    {...params}
                    ref={ref}

                    placeholder={'Search '}
                    type='text'
                    // value={value}

                    // value={query || ''}

                    // onChange={(e) => {
                    //     setQuery(e.target.value);
                    //     handleChange(e.target.value);
                    // }}
                    // value={searchValue || ''}

                  />
                )}

                onInputValueChange={handleInputValueChange}
              />
                {/*<StyledSearchBar setResults={setResults} />*/}
                {/*{results && results.length > 0 && <StyledSearchResultsList results={results} />}*/}


              </StyledDiv>

            </StyledBox>
          )}


          {/*<Dropdown
            trigger={<button onClick={handleDropdownOpen}>Dropdown</button>}
            menu={[
              <button >Menu 1</button>,
              <button >Menu 2</button>,
            ]}
          />*/}

          {is_authorized_v2()}


          {/*<ThemeSelector />*/}
          {/*<ThemeToggler />*/}
          {/*<Toggle theme={props.themez} toggleTheme={props.themeToggler} />*/}
          {props.children}

          <RouterLink to="/s3upload">
            <UploadButtonS3 />
          </RouterLink>
          <RouterLink to="/ax">
            <UploadButton />
          </RouterLink>

          {/*<AvatarHover avatarUrl={user.google_oauth.profileImg} />*/}




          {/*{is_oauthorized()}*/}
          <DropDownNew
            options={['Profile', 'Switch Accounts', 'Liked', 'Settings']}
            // defaultText={<AvatarHover avatarUrl={getState().users.avatar} />}
            // defaultText={<AvatarHover avatarUrl={user.avatar} />}
            defaultText={<AvatarHover avatarUrl={user.google_oauth.profileImg} />}
            changeOptionName={changeState}
          />

          {/*{(!isMobileSearch && authed || oauthed) ?

            (<AvatarHover avatarUrl={getState().users.avatar} />) :

            <LoginWrapper>
              <LoginBtn
                variant="contained"
                to="/login"
                >Log In
              </LoginBtn>
            </LoginWrapper>
          }*/}

        </StyledToolbar>
      </StyledAppBar>
    // </HideOnScroll>
  );
});

// export default AppHeader;
const mapStateToProps = state => ({
  // photos: state.items.photos,
  // nextPhotosLink: state.items.photosAttr.next,
  userProfile: state.users.response,
});

// const mapDispatchToProps = dispatch => {
//     return {
//         login: (creds) => {
//             dispatch(fetchLoginUser(creds))
//         },
//
//     }
// }


// STYLED
const StyledDiv = styled.div`
  margin-top: 8px;

`;
const StyledAppBar = styled.div`
  user-select: none;
  width: 100%;
  /* background: #0a0a0a; */
  /* background: white; */
  height: 60px;
  z-index: 3;
  position: fixed;
  background-color: ${(props) => props.theme.navBg};
  border-bottom: ${(props) => props.theme.navBorderColor};

`;
const StyledAppBarCSS = css`
  width: 100%;

  background: var(--navigationbarBackground);
  height: 60px;
  z-index: 3;
  position: fixed;

`;
const StyledToolbar = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  /* grid-gap: 11em; */
  /* grid-template-columns: 540px 600px 99px; */
  /* grid-gap: 100px; /*
`;
const StyledTypography = styled.p`

`;
const StyledLink = styled.a`

`;
const StyledBox = styled.div`
  height: 100%;
  width: 100%;
  padding-left: 9em;
  padding-right: 12em;

  @media screen and (max-width: 1200px) {
    padding-left: 9em;
    padding-right: 12em;
  }
  @media screen and (max-width: 800px) {
    padding-left: 9em;
    padding-right: 12em;
  }
  @media screen and (max-width: 600px) {
    padding-left: 9em;
    padding-right: 12em;
  }
  @media screen and (max-width: 450px) {
    padding-left: 1em;
    padding-right: 1em;

  }
`;
const StyledIconButton = styled.button`

`;
const StyledButton = styled.button`

`;

const StyledSearchIcon = styled.div`

`;
const StyledCloseIcon = styled.div`

`;
const LoginWrapper = styled.div`
  padding-right: 1em;
`;

const LitLoopLogo = styled.img`
  /* width: 48px; */
  display: block;

  /* width: 30px; */
  height: 20px;
  margin-top: auto;
  margin-bottom: auto;

  /* margin-left: auto; */
  /* margin-right: auto; */

`;
const Logo = styled.div`
  display: flex;
  height: 100%;
  padding-left: 1em;

`;
const LogoSpan = styled.span`
  /* display: flex; */
`;

const LinkStyled = styled(RouterLink)`
  display: flex;
  color: white;
  text-decoration: none;
  font-family: Verdana;
  height: 100%;

  div.litloop_logo_title {
    margin-left: 5px;
    margin-top: auto;
    margin-bottom: auto;
    color: ${props => props.theme.text};
  }

`;
const MyButton = styled(RouterLink)`
  /* background: linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%); */
  background: linear-gradient(45deg, #673ab7 30%, #3f51b5 90%);
  border: 0;
  border-radius: 3px;
  /* box-shadow: 0 3px 5px 2px rgba(255, 105, 135, .3); */
  color: white;
  height: 48px;
  /* padding: 0 30px; */
  padding: 15px 30px;
  text-decoration: none;
`;
const LoginBtn = styled(ModalLink)`
  user-select: none;
  display: flex;
  font-family: Verdana;
  color: white;
  background: #686cb9;
  /* background: linear-gradient(45deg, #673ab7 30%, #3f51b5 90%); */


  /* box-shadow: 0 3px 5px 2px rgba(255, 105, 135, .3); */

  width: 52px;
  border-radius: 13px;
  padding: 12px 23px;
  text-decoration: none;

`;

const BurgerMenu = styled.div`
  cursor: pointer;
  margin-left: 1em;
  svg.BurgerIcon {
   fill: ${props => props.theme.text};
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 0px;
  }
`;

const BentoMenu = styled.div`
  cursor: pointer;
  margin-left: 2em;

  .bento-menu {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-column-gap: 2px;
    grid-row-gap: 2px;
    height : 22px;
    width : 22px;
  }

  .bento-dot {
    width : 4px;
    height: 4px;
    border-radius: 999px;
    background: white;
    overflow: hidden;
  }
`;

const StyledImg = styled.img`
  width: 40px;
  border-radius: 30px;
  cursor: pointer;
`;

const UploadButton = styled(FaUpload)`
  /* font-size: 20px; */
  color: ${props => props.theme.text};
  margin-right: 3em;
  cursor: pointer;
`;
const UploadButtonS3 = styled(FaCloudUploadAlt)`
  /* font-size: 20px; */
  color: ${props => props.theme.text};
  margin-right: 3em;
  cursor: pointer;
`;
const ThemeToggler = styled(ImContrast)`
  font-size: 40px;
  color: white;
  margin-right: 3em;
  cursor: pointer;
`;

const DropdownToggle = styled.div`
  color: white;
  cursor: pointer;
`;

const StyledSearchBar = styled(SearchBar)`

  .input-wrapper {
    margin-top: 10em;
    width: 100%;
    height: 2.5rem;
    border: none;
    border-radius: 10px;
    padding: 0 15px;
    box-shadow: 0px 0px 8px #ddd;
    background-color: white;
    display: flex;
    align-items: center;
  }

  input {
    background-color: transparent;
    border: none;
    height: 100%;
    font-size: 1.25rem;
    width: 100%;
    margin-left: 5px;
  }

  input:focus {
    outline: none;
  }

  #search-icon {
    color: royalblue;
  }

`;
const StyledSearchResultsList = styled(SearchResultsList)`

  margin-top: 10em;

`;

const InputStyled = styled.input`
  color: ${(props) => props.theme.inputTextColor};
  background-color: ${(props) => props.theme.inputBg};


  width: 550px;
  @media screen and (max-width: 1200px) {
    width: 550px;
  }
  @media screen and (max-width: 800px) {
    width: 60px;
  }
  @media screen and (max-width: 600px) {
    width: 40px;
  }
  @media screen and (max-width: 450px) {
    width: 100px;

  }


  border-radius: 10px;
  height: 40px;
  padding-left: 10px;
  border: ${(props) => props.theme.inputBorderColor};

  margin-left: 0px;
  font-size: 16px;
`;

export default connect(mapStateToProps, null)(AppHeader)

// export default connect(null, mapDispatchToProps)(withStyles(styles)(Header));
