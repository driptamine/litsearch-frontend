// https://chatgpt.com/c/67eade15-c244-800c-bf0a-2710a1ee3e75
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  width: 60px;
  height: 60px;
  display: grid;
  /* grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr); */
  gap: 5px;
`;

const Square = styled.div`
  width: 100%;
  height: 100%;
  /* background-color: #3498db; */
  display: flex;
  align-items: center;
  /* justify-content: center; */
  overflow: hidden;
`;

const Avatar = styled.img`
  width: 80%;
  height: 80%;
  border-radius: 50%;
  object-fit: cover;
`;

const Empty = styled.div`
  width: 100%;
  height: 100%;
`;

const CrossLayout = ({avatars}) => {
  // const [avatars, setAvatars] = useState([]);

  // useEffect(() => {
  //   axios.get("https://reqres.in/api/users?page=1")
  //     .then(response => {
  //       const fetchedAvatars = response.data.data.slice(0, 5).map(user => user.avatar);
  //       setAvatars(fetchedAvatars);
  //     })
  //     .catch(error => console.error("Error fetching avatars:", error));
  // }, []);

  return (
    <Container>
      {/*<Empty />
      <Square>
        {avatars[0] && <Avatar src={avatars[0]} alt="Avatar 1" />}
      </Square>
      <Empty />*/}
      <Square>
        {avatars[1] && <Avatar src={avatars[0]} alt="Avatar 2" />}
      </Square>
      {/*<Square>
        {avatars[2] && <Avatar src={avatars[2]} alt="Avatar 3" />}
      </Square>
      <Square>
        {avatars[3] && <Avatar src={avatars[3]} alt="Avatar 4" />}
      </Square>
      <Empty />
      <Square>
        {avatars[4] && <Avatar src={avatars[4]} alt="Avatar 5" />}
      </Square>
      <Empty />*/}
    </Container>
  );
};

export default CrossLayout;
