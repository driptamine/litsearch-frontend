import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
// import Subscriptions from './Subscriptions';
import { HomeIcon, TrendingIcon, SubIcon, LibIcon, HistoryIcon, VidIcon, LikeIcon, EarthIcon } from './Icons';
import { closeSidebar } from 'core/reducers/sidebar';
import { FiClock, FiBookmark, FiMessageCircle } from 'react-icons/fi';
import { FaFilm } from 'react-icons/fa';
import { FaMusic, FaImage } from 'react-icons/fa';

import { TbMessageCircle } from 'react-icons/tb';
import { FaHistory, FaWpexplorer } from 'react-icons/fa';
import { MdVideoLibrary, MdAlbum } from 'react-icons/md';
import { BsBook } from 'react-icons/bs';
import { BsFillFileRichtextFill } from "react-icons/bs";
import { CiHashtag } from "react-icons/ci";
import { FaHashtag } from "react-icons/fa";
import { CiBoxList } from "react-icons/ci";
import { BsUiChecks } from "react-icons/bs";
import { LuLayoutList } from "react-icons/lu";


const Sidebar = () => {
  const dispatch = useDispatch();

  // const { sidebar: open } = useSelector((state) => state.sidebar);
  const open = useSelector((state) => state.sidebar);

  const handleCloseSidebar = () => {
    dispatch(closeSidebar());
  };

  return (
    <SidebarWrapper open={open}>
      <StyledUl>
        <StyledLi id="Feed">
          <LinkStyled onClick={handleCloseSidebar} to="/feed">
            <StyledDivIcon className="icon">
              <SCEarthIcon />

            </StyledDivIcon>
            <span>Feed</span>
          </LinkStyled>
        </StyledLi>

        <StyledLi id="WarpNode">
          <LinkStyled
            onClick={handleCloseSidebar}
            to="/notes"
            // activeClassName="active"
          >
            <StyledDivIcon className="icon">
              {/*<FiBookmark />*/}
              {/*<FaHistory />*/}
              <BsFillFileRichtextFill />


            </StyledDivIcon>
            <span className="mymusic">NetNode</span>
          </LinkStyled>
        </StyledLi>



        <StyledLi id="JustDoList">
          <LinkStyled
            onClick={handleCloseSidebar}
            to="/todo"
            // activeClassName="active"
          >
            <StyledDivIcon className="icon">
              {/*<FiBookmark />*/}
              {/*<FaHistory />*/}
              {/*<CiBoxList />*/}
              {/*<BsUiChecks />*/}
              <LuLayoutList />

            </StyledDivIcon>
            <span className="mymusic">JustDoList</span>
          </LinkStyled>
        </StyledLi>

        {/*<StyledLi id="Trending">
          <LinkStyled onClick={handleCloseSidebar} to="/feed/trending">
            <StyledDivIcon className="icon">
              <SCTrendingIcon />

            </StyledDivIcon>
            <span>Trending</span>
          </LinkStyled>
        </StyledLi>*/}

        {/*<StyledLi id="Explore">
          <LinkStyled
            onClick={handleCloseSidebar}
            to="/explore"
            // activeClassName="active"
          >
            <StyledDivIcon className="icon">
              <VidIcon />
              <FaWpexplorer />

            </StyledDivIcon>
            <span>Explore</span>
          </LinkStyled>
        </StyledLi>*/}

        <StyledLi id="Messages">
          <LinkStyled onClick={handleCloseSidebar} to="/chat/im">
            <StyledDivIcon className="icon">
              {/*<MessagesIcon />*/}
              {/*<FiMessageCircle />*/}
              <TbMessageCircle />

            </StyledDivIcon>
            <span>Messages</span>
          </LinkStyled>
        </StyledLi>
        {/*<div className="ruler"></div>*/}

        {/*<LinkStyled
          onClick={handleCloseSidebar}
          to="/feed/library"
          // activeClassName="active"
        >
          <div className="icon">
            <LibIcon />
            <MdVideoLibrary />
            <span>Library</span>
          </div>
        </LinkStyled>*/}

        {/*<StyledLi id="History">
          <LinkStyled
            onClick={handleCloseSidebar}
            to="/feed/history"
            // activeClassName="active"
          >
            <StyledDivIcon className="icon">

              <FiClock />


            </StyledDivIcon>
            <span>History</span>
          </LinkStyled>
        </StyledLi>*/}

        {/*<StyledLi id="Albums">
          <LinkStyled
            onClick={handleCloseSidebar}
            to="/albums"
          >
            <StyledDivIcon className="icon">
              <MdAlbum />


            </StyledDivIcon>
            <span>New Albums</span>
          </LinkStyled>
        </StyledLi>*/}

        {/*<StyledLi id="Bookmarks">
          <LinkStyled
            onClick={handleCloseSidebar}
            to="/bookmarks"
            // activeClassName="active"
          >
            <StyledDivIcon className="icon">
              <FiBookmark />
              <FaHistory />

            </StyledDivIcon>
            <span>Bookmarks</span>
          </LinkStyled>
        </StyledLi>*/}

        <StyledLi id="VideosSidebar">
          <LinkStyled
            onClick={handleCloseSidebar}
            to="/videos"
            // activeClassName="active"
          >
            <StyledDivIcon className="icon">
              {/*<FiBookmark />*/}
              {/*<FaHistory />*/}
              <FaFilm />
            </StyledDivIcon>
            <span>Videos</span>
          </LinkStyled>
        </StyledLi>

        <StyledLi id="Music">
          <LinkStyled
            onClick={handleCloseSidebar}
            to="/musicv2"
            // activeClassName="active"
          >
            <StyledDivIcon className="icon">
              {/*<FiBookmark />*/}
              {/*<FaHistory />*/}
              <FaMusic />

            </StyledDivIcon>
            <span className="mymusic">Music</span>
          </LinkStyled>
        </StyledLi>
        <StyledLi id="Photos">
          <LinkStyled
            onClick={handleCloseSidebar}
            to="/photos"
            // activeClassName="active"
          >
            <StyledDivIcon className="icon">
              {/*<FiBookmark />*/}
              {/*<FaHistory />*/}
              <FaImage />

            </StyledDivIcon>
            <span className="mymusic">Photos</span>
          </LinkStyled>
        </StyledLi>

        <StyledLi id="LinkTag">
          <LinkStyled
            onClick={handleCloseSidebar}
            to="/linktag/all"
            // activeClassName="active"
          >
            <StyledDivIcon className="icon">
              {/*<FiBookmark />*/}
              {/*<FaHistory />*/}
              <FaHashtag />


            </StyledDivIcon>
            <span className="mymusic">LinkTag</span>
          </LinkStyled>
        </StyledLi>



        {/*<StyledLi>
          <LinkStyled
            onClick={handleCloseSidebar}
            to="/feed/liked"
            // activeClassName="active"
          >
            <div className="icon">
              // <LikeIcon />

            </div>
            <span>Liked</span>
          </LinkStyled>
        </StyledLi>*/}







        <div className="ruler"></div>

        {/*<Subscriptions />*/}
      </StyledUl>
    </SidebarWrapper>
  );
};


const StyledDivIcon = styled.div`
  margin-right: 10px;

  svg {
    height: 16px;
    width: 16px;
    color: ${props => props.theme.text};
  }

`;
const SCEarthIcon = styled(EarthIcon)`


    height: 16px;
    width: 16px;



`;
const SCTrendingIcon = styled(TrendingIcon)`


    height: 16px;
    width: 16px;
    fill: ${props => props.theme.text};


`;
const SidebarWrapper = styled.div`
  position: fixed;
  /* top: 6em; */
  top: 0;
  padding-top: 4em;
  left: 0;
  /* height: 100vh; */
  height: 100%;
  width: 240px;
  /* background: ${(props) => props.theme.grey}; */
  /* background: #212121; */
  background: ${(props) => props.theme.sideBarColor};
  /* padding-top: 1rem; */


  /* overflow: auto; */
  overflow-y: auto;

  padding-bottom: 1.5rem;
  transition: all 0.3s;
  z-index: 2;

  &::-webkit-scrollbar {
    width: 0;
  }

  .icon {
    display: flex;
    align-items: center;
    padding: 0.7rem 0;
    padding-left: 1.5rem;
    /* margin-bottom: 0.4rem; */
  }

  .icon:not(.hover-disable):hover {
    background: ${(props) => props.theme.darkGrey};
    cursor: pointer;
  }

  .active div {
    background: ${(props) => props.theme.darkGrey};
    cursor: pointer;
  }

  .active svg {
    fill: #fff;
  }

  .icon span {
    padding-left: 1rem;
    position: relative;
    top: 1px;
  }

  @media screen and (max-width: 1093px) {
    transform: translateX(-100%);

    ${(props) =>
      props.open &&
      css`
        transform: translateX(-100%);
      `}
  }
`;

const StyledUl = styled.ul`
  align-items: flex-start;
  list-style: none;
  padding-right: 10px;
`;

const StyledLi = styled.li`
  margin-top: 15px;
  &:hover {
    background-color: ${props => props.theme.sideBarHoverColor};
    border-radius: 12px;
  }
  /* border-style: dotted */
`;

const LinkStyled = styled(Link)`
  align-items: center;
  color: ${props => props.theme.text};
  text-decoration: none;
  &:hover: {
    text-decoration: underline;
  }

  /* display: grid; */

  /* grid-gap: 1em; */
   /* grid-template-columns: 20px 29px minmax(81px,0fr); */
  display: flex;

  span {
    font-family: Helvetica;
  }
`;

// const links = [
//   {
//     iconName:"",
//     path: "/trending"
//   },
//   {
//     path: "/explore"
//   },
//   {
//     path: "/messages"
//   },
//   {
//     path: "/history"
//   },
//   {
//     path: "/"
//   },
//
//
//   {
//     path: "/playlists"
//   },
//   {
//     path: "/playlist/1iC9VT69XLLRPtrkBA7tCT"
//   },
//   {
//     path: "/playlist/1a4WG4Bm6WsfcXMxQ3F1Zr"
//   },
//   {
//     path: "/playlist/3NcpCaLNsoz4HOjzUCWwSl"
//   },
//   {
//     path: "/playlist/7I38G6zePIPIBaV1WvjFOI"
//   },
//   {
//     path: "/playlist/2T2srNcQWBiVj6v0CYOD2n"
//   }
// ];

// const link_to = links.map((link) => {
//   <LinkStyled
//     to={link.path}
//     onClick={handleCloseSidebar}
//     >
//     <${link.iconName}Icon/>
//   </LinkStyled
// })

export default Sidebar;
