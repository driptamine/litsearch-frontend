import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const conversationData = {
  conversation: [

    { id: 2, sender: "Janet", message: "Hey Alice! I'm good, just working on a project. 🚀", timestamp: "2025-03-30T10:01:15Z" },
    { id: 3, sender: "Emma", message: "Nice! What are you working on?", timestamp: "2025-03-30T10:02:30Z" },
    { id: 4, sender: "Charles", message: "A React app with a chat feature! 😃", timestamp: "2025-03-30T10:03:45Z" },
    { id: 10, sender: "George", message: "Hey Bob! How's it going? ", timestamp: "2025-03-30T10:00:00Z" },

    { id: 5, sender: "Tracey", message: "Hey Bob! How's it going? ", timestamp: "2025-03-30T10:00:00Z" },
    { id: 6, sender: "Michael", message: "Hey Alice! I'm good, just working on a project. 🚀", timestamp: "2025-03-30T10:01:15Z" },
    { id: 7, sender: "Lindsay", message: "Nice! What are you working on?", timestamp: "2025-03-30T10:02:30Z" },
    { id: 8, sender: "Tobias", message: "A React app with a chat feature! 😃", timestamp: "2025-03-30T10:03:45Z" },
    { id: 9, sender: "Byron", message: "A React app with a chat feature! 😃", timestamp: "2025-03-30T10:03:45Z" },
    //
    //
    //
    //
    //
  ]

};


const ChatList = ({ users, messages, emojiData }) => {
  // const [messages, setMessages] = useState([]);

  const latestMessages = {};

  conversationData.conversation.forEach((msg) => {
   latestMessages[msg.sender] = msg.message; // Overwrites to keep the latest message
  });

  return (
    <ChatListContainer>
      <Tabs>
        <AllTabs>All Tabs</AllTabs>
        {emojiData.emojis.map((emoji, index) => (
          <LinkStyled key={emoji.unicode}>
            <HoverWrapper>

              <>{emoji.emoji}</>

            </HoverWrapper>
          </LinkStyled>
        ))}
      </Tabs>

      {users.map((user) => (
        <LinkStyled key={user.id} to={`/chat/${user.id}`}>
          <HoverWrapper>
          <ImgWrap>
            <Avatar src={user.avatar}/>
          </ImgWrap>
          <UserWrapper>
            <User>{user.first_name} {user.last_name}</User>
            <LastMessage>{latestMessages[user.first_name] || "No messages yet"}</LastMessage>
          </UserWrapper>
          </HoverWrapper>
        </LinkStyled>
      ))}

    </ChatListContainer>
  );
};
const UserWrapper = styled.div`
  display: flex;
  /* align-items: center; */
  flex-direction: column;
`;
const AllTabs = styled.div`
  margin: auto;
  cursor: pointer;
`;

const LastMessage = styled.div`
  font-size: 12px;
  font-family: Verdana;
  color: #999;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const Tabs = styled.div`
  display: flex;
  overflow: auto;


`;
const ImgWrap = styled.div`
  padding-right: 12px;
`;
const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 10px;
`;
const LinkStyled = styled(Link)`
  text-decoration: none;
  display: flex;
  cursor: pointer;
  padding: 0.5625rem;
  &:hover {
    background-color: ${(props) => props.theme.chatHoverText};
    border-radius: 10px;
  }
`;
const HoverWrapper = styled.div`
  display: flex;
  &:hover {
    background-color: ${(props) => props.theme.chatHoverText};
  }
`;
const ChatListContainer = styled.div`
  width: 30%;
  background-color: ${(props) => props.theme.navBg};
  border-right: 1px solid #404040;
  padding: 20px;
  box-sizing: border-box;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  position: sticky;  /* Keeps it pinned */
  top: 0;           /* Sticks it to the top when scrolling */
  overflow-y: auto;

`;

const User = styled.div`
  font-size: 14px;
  font-family: Arial;
  /* background-color: ${({ isActive }) => (isActive ? '#ddd' : '#f4f4f4')}; */

  /* background-color: ${(props) => props.theme.navBg}; */
  color: ${(props) => props.theme.text};

  cursor: pointer;

`;

export default ChatList;
