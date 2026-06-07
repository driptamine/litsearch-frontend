import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@linaria/react';
import { css } from '@linaria/core';
import { FaUpload, FaCloudUploadAlt, FaSearch, FaTimes } from 'react-icons/fa';
import { ImContrast } from 'react-icons/im';
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";

import { fetchQuerySearch, fetchLogout } from 'core/actions';
import { selectors } from 'core/reducers/index';
import history from 'core/services/history';
import { toggleSidebar } from 'core/reducers/sidebar';

import Autocomplete from 'views/pages/MainSearch/AppHeader/Autocomplete';
import { SearchBar } from 'views/pages/MainSearch/searchbar/SearchBar';
import { SearchResultsList } from 'views/pages/MainSearch/searchbar/SearchResultsList';

import RouterLink from './RouterLink';
import ModalLink from 'views/components/ModalLink';
import MovieAndPersonAutoSearch from 'views/components/MovieAndPersonAutoSearch';
import DrawerToggleButton from 'views/components/DrawerToggleButton';
import AvatarHover from 'views/components/AvatarHover';
import litLightLogo from 'views/assets/viewsLogos/purple-views-logo-light.png';
import litNightLogo from 'views/assets/viewsLogos/views-logo-official.png';

import Dropdown from 'views/components/Dropdown/Dropdown';
import DropdownV2 from 'views/components/Dropdown/DropdownV2';
import DropdownPortal from 'views/components/Dropdown/DropdownPortal';
import DropDownNew from 'views/components/DropdownV2/DropDown';
import DropdownApps from 'views/components/DropdownApps/DropdownApps';

import Toggle from 'views/components/Toggle/Toggler';
import { useThemeMode } from 'views/components/Toggle/useThemeMode'
import { TwitchContext } from 'views/pages/Auth/twitch/useToken';
import useDetectMobile from 'core/hooks/useDetectMobile';
import useSelectAuthUser from 'core/hooks/useSelectAuthUser';
import themeVars from 'views/styles/theme-vars';

const AppHeader = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state.sidebar?.sidebar);
  const { authUser, isSignedIn } = useSelectAuthUser();
  const user = useSelector((state) => state.users) || {};

  const authed = isSignedIn || !!props.imgSrc;
  const oauthed = user.google_oauth?.oauthed || user.google?.oauthed || !!user.google_oauth?.profileImg || !!user.profileImg || !!props.imgSrc;

  const isMobile = useDetectMobile();
  const [searchValue, setSearchValue] = useState('');
  const [isMobileSearch, setIsMobileSearch] = useState(false);


  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState(1);

  const changeState = (optionName) => {
    setState(optionName);
  };


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    switch (option) {
      case 'Switch Accounts':
        // This is now handled internally by DropDownNew to show the sub-menu
        break;
      case 'Add Account':
        history.push('/login');
        break;
      case 'Profile':
        const username = authUser?.username || authUser?.user?.username || authUser?.user__username || user.username;
        if (username) {
          history.push(`/${username}`);
        } else {
          history.push('/login');
        }
        break;
      case 'Settings':
        history.push('/settings');
        break;
      case 'Liked':
        history.push('/liked');
        break;
      case 'Dark Theme':
        if (props.themez !== 'dark') props.themeToggler();
        break;
      case 'Light Theme':
        if (props.themez !== 'light') props.themeToggler();
        break;
      default:
        break;
    }
  };

  const handleAccountSwitch = (accountId) => {
    dispatch({ type: 'user/switchAccount', payload: accountId });
  };


  useEffect(() => {
    if (!isMobile) {
      setIsMobileSearch(false);
    }
  }, [isMobile]);

  useEffect(() => {
    dispatch(fetchQuerySearch(searchValue));
  }, [dispatch, searchValue]);

  const movieIds = useSelector(state => selectors.selectMovieSearchResultIds(state, searchValue)) || [];
  const albumIds = useSelector(state => selectors.selectAlbumSearchResultIds(state, searchValue)) || [];
  const queryIds = useSelector(state => selectors.selectQuerySearchResultIds(state, searchValue)) || [];
  const movies = useSelector(state => selectors.selectMovies(state, movieIds)) || [];
  const albums = useSelector(state => selectors.selectAlbums(state, albumIds)) || [];
  const queries = useSelector(state => selectors.selectQueries(state, queryIds)) || [];

  const suggestionz = [
    ...movies.slice(0, 3).map(movie => ({ ...movie, suggestionType: "movie" })),
    ...albums.slice(0, 3).map(album => ({ ...album, suggestionType: "album" })),
    ...queries.slice(0, 20).map(query => ({ ...query, suggestionType: "query" })),
  ];

  const renderHeaderUser = () => {
    if (!authed && !oauthed) return <AvatarHover />;
    
    const displayUsername = authUser?.username || authUser?.user?.username || authUser?.user__username || user.username || 'User';

    return (
      <UserHeaderWrapper>
        <UsernameText>{displayUsername}</UsernameText>
        <AvatarHover avatarUrl={user.djangoAvatar || user.avatar || user.profileImg || user.google_oauth?.profileImg || authUser?.djangoAvatar || authUser?.avatar || authUser?.profileImg || props.imgSrc} />
      </UserHeaderWrapper>
    );
  };

  return (
    <StyledAppBar ref={ref}>
      <StyledToolbar>
        {(!isMobile || !isMobileSearch) && (
          <HeaderLeftSection>
            {!isMobile && (
              <SidebarToggleWrapper gotsidebar={sidebarOpen}>
                <StyledIconButton onClick={() => dispatch(toggleSidebar())}>
                  {sidebarOpen ? <LuPanelLeftClose size={24} /> : <LuPanelLeftOpen size={24} />}
                </StyledIconButton>
              </SidebarToggleWrapper>
            )}

            <LogoWrapper>
              <LinkStyled to="/">
                <LitLoopLogo src={props.themez === 'light' ? litNightLogo : litLightLogo} />
              </LinkStyled>
            </LogoWrapper>
          </HeaderLeftSection>
        )}

        {isMobile ? (
          isMobileSearch ? (
            <StyledBox flex={1} mx={1} display="flex" alignItems="center">
              <StyledIconButton onClick={() => setIsMobileSearch(false)}>
                <FaTimes />
              </StyledIconButton>
              <Autocomplete
                suggestions={suggestionz}
                output={(e) => setValue(e)}
                clearIcon={true}
                renderInput={(params, ref) => (
                  <InputStyled {...params} ref={ref} placeholder="Search " autoFocus />
                )}
                onInputValueChange={(val) => setSearchValue(val)}
              />
            </StyledBox>
          ) : (
            <>
              <StyledBox flex={1} />
              <StyledIconButton onClick={() => setIsMobileSearch(true)}>
                <FaSearch />
              </StyledIconButton>
            </>
          )
        ) : (
          <StyledBox flex={1} mx={2} justifyContent="center">
            <StyledDiv>
              <Autocomplete
                suggestions={suggestionz}
                output={(e) => setValue(e)}
                clearIcon={true}
                renderInput={(params, ref) => (
                  <InputStyled {...params} ref={ref} placeholder="Search " />
                )}
                onInputValueChange={(val) => setSearchValue(val)}
              />
            </StyledDiv>
          </StyledBox>
        )}

        {/*{renderAvatar()}*/}
        {props.children}

        <HeaderActionWrapper>
          <RouterLink to="/s3upload"><UploadButtonS3 /></RouterLink>
          <RouterLink to="/ax"><UploadButton /></RouterLink>
          <DropdownApps />
        </HeaderActionWrapper>

        {authed || oauthed ? (
          <DropDownNew
            options={['Profile', 'Switch Accounts', 'Liked', 'Settings']}
            defaultText={renderHeaderUser()}
            accounts={user.accounts || []}
            activeAccountId={user.activeAccountId}
            onOptionClick={handleOptionClick}
            onAccountSwitch={handleAccountSwitch}
          />
        ) : (
          <AvatarHover />
        )}
      </StyledToolbar>
    </StyledAppBar>
  );
});

const UserHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 24px;
  margin-right: 16px;

  &:hover {
    background-color: ${themeVars.sideBarHoverColor};
  }
`;

const UsernameText = styled.span`
  color: var(--text);
  margin-right: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  
  @media screen and (max-width: 800px) {
    display: none;
  }
`;

const StyledDiv = styled.div`
  margin-top: 8px;

`;
const StyledAppBar = styled.div`
  box-sizing: border-box;
  user-select: none;
  width: 100%;
  /* background: #0a0a0a; */
  /* background: white; */
  height: 60px;
  z-index: 3;
  position: fixed;
  background-color: var(--navBg);
  border-bottom: var(--navBorderColor);

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
const styledBoxStyles = props => `
  display: ${props.display || 'block'};
  align-items: ${props.alignItems || 'stretch'};
  flex: ${props.flex || 'unset'};
`;

const StyledBox = styled.div`
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  padding-left: 1em;
  padding-right: 1em;
  ${styledBoxStyles}

  @media screen and (min-width: 1200px) {
    padding-left: 9em;
    padding-right: 12em;
  }
`;
const StyledIconButton = styled.button`
  background: none;
  border: none;
  color: var(--text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  font-size: 1.2em;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
`;
const StyledButton = styled.button`

`;

const StyledSearchIcon = styled(FaSearch)`
  color: var(--text);
`;
const StyledCloseIcon = styled(FaTimes)`
  color: var(--text);
`;
const LoginWrapper = styled.div`
  padding-right: 1em;
`;

const HeaderActionWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1em;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const HeaderLeftSection = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

const sidebarToggleWrapperStyles = props => `
  padding-left: ${props.gotsidebar ? '0' : '1em'};
  margin-left: ${props.gotsidebar ? '240px' : '0'};
`;

const SidebarToggleWrapper = styled.div`
  display: flex;
  height: 100%;
  ${sidebarToggleWrapperStyles}
  transition: margin-left 0.3s ease-in-out;
  align-items: center;
  flex-shrink: 0;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-left: 1em;
  height: 100%;
`;

const StyledToggleIcon = styled.div`
  font-size: 24px;
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LitLoopLogo = styled.img`
  display: block;
  height: 20px;
  margin-top: auto;
  margin-bottom: auto;
  cursor: pointer;
`;
const LogoSpan = styled.span`
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
    color: var(--text);
  }

`;
const MyButton = styled(RouterLink)`
  background: linear-gradient(45deg, #673ab7 30%, #3f51b5 90%);
  border: 0;
  border-radius: 3px;
  color: white;
  height: 48px;
  padding: 15px 30px;
  text-decoration: none;
`;
const LoginBtn = styled(ModalLink)`
  user-select: none;
  display: flex;
  font-family: Verdana;
  color: white;
  background: #686cb9;

  width: 52px;
  border-radius: 13px;
  padding: 12px 23px;
  text-decoration: none;

`;

const BurgerMenu = styled.div`
  cursor: pointer;
  margin-left: 1em;
  svg.BurgerIcon {
   fill: var(--text);
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
  color: var(--text);
  margin-right: 1.5em;
  cursor: pointer;
`;
const UploadButtonS3 = styled(FaCloudUploadAlt)`
  color: var(--text);
  margin-right: 1.5em;
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
  color: var(--inputTextColor);
  background-color: var(--inputBg);

  width: 100%;
  max-width: 550px;

  @media screen and (min-width: 768px) {
    width: 300px;
  }

  @media screen and (min-width: 1024px) {
    width: 550px;
  }

  border-radius: 10px;
  height: 40px;
  padding-left: 10px;
  border: var(--inputBorderColor);

  margin-left: 0px;
  font-size: 16px;
`;

export default AppHeader;

// export default connect(null, mapDispatchToProps)(withStyles(styles)(Header));
