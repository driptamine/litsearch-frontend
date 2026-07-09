import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@linaria/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import Subscriptions from './Subscriptions';
import { HomeIcon, TrendingIcon, SubIcon, LibIcon, HistoryIcon, VidIcon, LikeIcon, EarthIcon } from './Icons';
import { FiClock, FiBookmark, FiMessageCircle } from 'react-icons/fi';
import { FaFilm, FaUsers } from 'react-icons/fa';
import { FaMusic, FaImage, FaRocket } from 'react-icons/fa';

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
import { useNotifications } from 'core/context/NotificationContext';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';


const Sidebar = () => {
  const open = useSelector((state) => state.sidebar.sidebar);
  const username = useSelector((state) => state.users?.username || state.users?.user__username);
  const isSignedIn = useSelector((state) => state.users?.isAuthorized || !!state.users?.access_token);
  const { unreadChatCount } = useNotifications();
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    if (!isSignedIn) return;
    axios.get(`${LITLOOP_API_URL}/communities/`, { headers: authHeader() })
      .then((res) => {
        const mine = (res.data.communities || []).filter((c) => c.user_is_member);
        setCommunities(mine);
      })
      .catch(() => {});
  }, [isSignedIn]);

  return (
    <SidebarWrapper open={open}>
      <StyledUl>
        <StyledLi id="Feed">
          <LinkStyled  to="/feed/movies">
            <StyledDivIcon className="icon">
              <SCEarthIcon />

            </StyledDivIcon>
            <span>Feed</span>
          </LinkStyled>
        </StyledLi>

        <StyledLi id="UserPosts">
          <LinkStyled to="/feed">
            <StyledDivIcon className="icon">
              <FaRocket />
            </StyledDivIcon>
            <span>User Posts</span>
          </LinkStyled>
        </StyledLi>

        <StyledLi id="FYP">
          <LinkStyled to="/fyp">
            <StyledDivIcon className="icon">
              <FaRocket />
            </StyledDivIcon>
            <span>FYP</span>
          </LinkStyled>
        </StyledLi>

        <StyledLi id="WarpNode">
          <LinkStyled

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
          <LinkStyled to="/feed/trending">
            <StyledDivIcon className="icon">
              <SCTrendingIcon />

            </StyledDivIcon>
            <span>Trending</span>
          </LinkStyled>
        </StyledLi>*/}

        {/*<StyledLi id="Explore">
          <LinkStyled
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
          <LinkStyled  to="/chat/im">
            <StyledDivIcon className="icon">
              {/*<MessagesIcon />*/}
              {/*<FiMessageCircle />*/}
              <TbMessageCircle />

            </StyledDivIcon>
            <span>Messages</span>
            {unreadChatCount > 0 && <Badge>{unreadChatCount}</Badge>}
          </LinkStyled>
        </StyledLi>
        {/*<div className="ruler"></div>*/}

        {/*<LinkStyled
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

            to={`/${username}/tracks`}
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
        <StyledLi id="Albums">
          <LinkStyled
            to={`/${username}/albums`}
          >
            <StyledDivIcon className="icon">
              <MdAlbum />
            </StyledDivIcon>
            <span className="mymusic">Albums</span>
          </LinkStyled>
        </StyledLi>

        <StyledLi id="Photos">
          <LinkStyled
            to={`/${username}/photos`}
          >
            <StyledDivIcon className="icon">
              <FaImage />
            </StyledDivIcon>
            <span className="mymusic">Photos</span>
          </LinkStyled>
        </StyledLi>

        <StyledLi id="Videos">
          <LinkStyled
            to={`/${username}/videos`}
          >
            <StyledDivIcon className="icon">
              <FaFilm />
            </StyledDivIcon>
            <span className="mymusic">Videos</span>
          </LinkStyled>
        </StyledLi>

        <StyledLi id="Users">
          <LinkStyled

            to="/users"
            // activeClassName="active"
          >
            <StyledDivIcon className="icon">
              <FaUsers />
            </StyledDivIcon>
            <span className="mymusic">Users</span>
          </LinkStyled>
        </StyledLi>

        <StyledLi id="LinkTag">
          <LinkStyled

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

        <StyledLi id="Communities">
          <LinkStyled to="/communities">
            <StyledDivIcon className="icon">
              <FaUsers />
            </StyledDivIcon>
            <span className="mymusic">Communities</span>
          </LinkStyled>
          {open && communities.length > 0 && (
            <SubUl>
              {communities.map((c) => (
                <StyledSubLi key={c.id}>
                  <SubLink to={`/communities/${c.id}`}>
                    {c.icon ? (
                      <SubIconImg src={c.icon} alt="" />
                    ) : (
                      <SubIconPlaceholder />
                    )}
                    <span>{c.name}</span>
                  </SubLink>
                </StyledSubLi>
              ))}
            </SubUl>
          )}
        </StyledLi>



        {/*<StyledLi>
          <LinkStyled
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
  display: flex;
  align-items: center;

  svg {
    height: 16px;
    width: 16px;
    color: var(--text);
  }
`;
const Badge = styled.span`
  background-color: #0084ff;
  color: white;
  font-size: 10px;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  margin-left: auto;
  margin-right: 10px;
`;

const SCEarthIcon = styled(EarthIcon)`


    height: 16px;
    width: 16px;



`;
const SCTrendingIcon = styled(TrendingIcon)`


    height: 16px;
    width: 16px;
    fill: var(--text);


`;
const SidebarWrapper = styled.div`
  position: fixed;
  left: 0;
  top: 5em;
  bottom: 0;
  z-index: 2;
  height: auto;
  width: ${({ open }) => open ? '240px' : '0'};
  overflow: hidden;
  white-space: nowrap;
  background: var(--sideBarColor);

  overflow-y: auto;

  padding-bottom: 1.5rem;
  transition: width 0.3s ease-in-out;

  &::-webkit-scrollbar {
    width: 0;
  }

  .icon:not(.hover-disable):hover {
    background: var(--darkGrey);
    cursor: pointer;
  }

  .active div {
    background: var(--darkGrey);
    cursor: pointer;
  }

  .active svg {
    fill: #fff;
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
    background-color: var(--sideBarHoverColor);
    border-radius: 12px;
  }
  /* border-style: dotted */
`;

const LinkStyled = styled(Link)`
  align-items: center;
  color: var(--text);
  text-decoration: none;
  display: flex;
  gap: 12px;
  padding: 0.7rem 0;
  padding-left: 1.5rem;

  &:hover {
    text-decoration: underline;
  }

  span {
    font-family: Helvetica;
  }
`;

const SubUl = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const StyledSubLi = styled.li`
  &:hover {
    background-color: var(--sideBarHoverColor);
    border-radius: 8px;
  }
`;

const SubLink = styled(Link)`
  align-items: center;
  color: var(--text);
  text-decoration: none;
  display: flex;
  gap: 10px;
  padding: 0.4rem 0;
  padding-left: 2.8rem;
  font-size: 0.85rem;

  &:hover {
    text-decoration: underline;
  }

  span {
    font-family: Helvetica;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const SubIconImg = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
`;

const SubIconPlaceholder = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: var(--darkGrey);
  flex-shrink: 0;
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
//     >
//     <${link.iconName}Icon/>
//   </LinkStyled
// })

export default Sidebar;
