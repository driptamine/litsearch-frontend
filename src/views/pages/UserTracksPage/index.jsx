import React from 'react';
import { useParams } from 'react-router-dom';
import UserTracks from 'views/pages/ProfilePage/UserTracks';

function UserTracksPage() {
  const { username } = useParams();
  return <UserTracks username={username} />;
}

export default UserTracksPage;
