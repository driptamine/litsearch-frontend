import React, { useState, useEffect } from 'react';
import { styled } from '@linaria/react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { getAxiosReq } from 'core/api/rest-helper';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23333' rx='8'/%3E%3Ccircle cx='24' cy='18' r='8' fill='%23999'/%3E%3Cpath d='M8 44c0-8.84 7.16-16 16-16s16 7.16 16 16' fill='%23999'/%3E%3C/svg%3E";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async (query = '', isInitial = false) => {
    if (isInitial || users.length === 0) setLoading(true);
    try {
      let url = `${LITLOOP_API_URL}/users/list/`;
      if (query) {
        url = `${LITLOOP_API_URL}/users/search/?q=${encodeURIComponent(query)}`;
      }
      const response = await getAxiosReq(url);
      const data = response.data;
      const userList = Array.isArray(data) ? data : (data.users || data.results || []);
      setUsers(userList);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers('', true);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(searchQuery);
  };

  return (
    <PageContainer>
      <Header>
        <Title>Explore Users</Title>
        <SearchForm onSubmit={handleSearch}>
          <SearchInput 
            type="text" 
            placeholder="Search users..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchButton type="submit">
            <FaSearch />
          </SearchButton>
        </SearchForm>
      </Header>

      {loading ? (
        <Message>Loading users...</Message>
      ) : users.length === 0 ? (
        <Message>No users found.</Message>
      ) : (
        <UserGrid>
          {users.map((user) => {
            const rawAvatar = user.avatar || user.profileImg;
            const avatarUrl = rawAvatar 
              ? (rawAvatar.startsWith('http') ? rawAvatar : `${LITLOOP_API_URL}${rawAvatar.startsWith('/') ? '' : '/'}${rawAvatar}`)
              : DEFAULT_AVATAR;

            return (
              <UserCard key={user.id} to={`/${user.username}`}>
                <Avatar 
                  src={avatarUrl} 
                  alt={user.username} 
                  onError={(e) => { 
                    if (e.target.src !== DEFAULT_AVATAR) {
                      e.target.src = DEFAULT_AVATAR;
                    }
                  }}
                />
                <UserInfo>
                  <Username>{user.username}</Username>
                  <FullName>
                    {user.first_name || user.last_name 
                      ? `${user.first_name || ''} ${user.last_name || ''}`.trim() 
                      : `@${user.username}`}
                  </FullName>
                </UserInfo>
              </UserCard>
            );
          })}
        </UserGrid>
      )}
    </PageContainer>
  );
};

const PageContainer = styled.div`
  padding: 40px;
  background-color: var(--navBg, #141414);
  min-height: 100vh;
  color: var(--text, white);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
`;

const SearchForm = styled.form`
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 30px;
  padding: 5px 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
  max-width: 400px;
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: white;
  padding: 10px;
  flex: 1;
  font-size: 1rem;
  &:focus {
    outline: none;
  }
`;

const SearchButton = styled.button`
  background: transparent;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 0 10px;
  display: flex;
  align-items: center;
  &:hover {
    color: white;
  }
`;

const UserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 25px;
`;

const UserCard = styled(Link)`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 15px;
  padding: 20px;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s, background 0.2s;
  border: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
  border: 3px solid rgba(255, 255, 255, 0.1);
`;

const UserInfo = styled.div`
  text-align: center;
`;

const Username = styled.div`
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 5px;
`;

const FullName = styled.div`
  font-size: 0.9rem;
  color: #888;
`;

const Message = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  color: #888;
`;

export default UsersPage;
