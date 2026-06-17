import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@linaria/react';
import * as EmailValidator from 'email-validator';
import { updateUserAction, changePasswordAction } from 'core/actions';
import { selectors } from 'core/reducers';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.users);
  const authUser = useSelector(selectors.selectAuthUser);

  const [editUsername, setEditUsername] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  const [username, setUsername] = useState(authUser?.username || user.username || '');
  const [email, setEmail] = useState(authUser?.email || user.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [usernameMsg, setUsernameMsg] = useState('');
  const [emailMsg, setEmailMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    setUsernameMsg('');

    if (!username.trim()) {
      setUsernameMsg('Username cannot be empty');
      return;
    }

    dispatch(updateUserAction({ username: username.trim() }));
    setUsernameMsg('Saved!');
    setEditUsername(false);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setEmailMsg('');

    if (!EmailValidator.validate(email.trim())) {
      setEmailMsg('Invalid email address');
      return;
    }

    dispatch(updateUserAction({ email: email.trim() }));
    setEmailMsg('Saved!');
    setEditEmail(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordMsg('');

    if (!currentPassword) {
      setPasswordMsg('Current password is required');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg('Passwords do not match');
      return;
    }

    dispatch(changePasswordAction({
      oldPassword: currentPassword,
      newPassword: newPassword
    }));
    setPasswordMsg('Password changed!');
    setEditPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const currentUsername = authUser?.username || user.username || user.user__username;
  const currentEmail = authUser?.email || user.email;

  return (
    <Container>
      <Title>Settings</Title>

      <Section>
        <SectionTitle>Username</SectionTitle>
        <CurrentValue>@{currentUsername}</CurrentValue>
        {editUsername ? (
          <Form onSubmit={handleUsernameSubmit}>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="New username"
              autoFocus
            />
            <ButtonRow>
              <SaveBtn type="submit">Save</SaveBtn>
              <CancelBtn type="button" onClick={() => { setEditUsername(false); setUsername(currentUsername); setUsernameMsg(''); }}>Cancel</CancelBtn>
            </ButtonRow>
            {usernameMsg && <Msg>{usernameMsg}</Msg>}
          </Form>
        ) : (
          <EditBtn onClick={() => setEditUsername(true)}>Edit</EditBtn>
        )}
      </Section>

      <Section>
        <SectionTitle>Email</SectionTitle>
        <CurrentValue>{currentEmail}</CurrentValue>
        {editEmail ? (
          <Form onSubmit={handleEmailSubmit}>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="New email"
              autoFocus
            />
            <ButtonRow>
              <SaveBtn type="submit">Save</SaveBtn>
              <CancelBtn type="button" onClick={() => { setEditEmail(false); setEmail(currentEmail); setEmailMsg(''); }}>Cancel</CancelBtn>
            </ButtonRow>
            {emailMsg && <Msg>{emailMsg}</Msg>}
          </Form>
        ) : (
          <EditBtn onClick={() => setEditEmail(true)}>Edit</EditBtn>
        )}
      </Section>

      <Section>
        <SectionTitle>Password</SectionTitle>
        {editPassword ? (
          <Form onSubmit={handlePasswordSubmit}>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              autoFocus
            />
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
            />
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
            <ButtonRow>
              <SaveBtn type="submit">Change Password</SaveBtn>
              <CancelBtn type="button" onClick={() => { setEditPassword(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); setPasswordMsg(''); }}>Cancel</CancelBtn>
            </ButtonRow>
            {passwordMsg && <Msg>{passwordMsg}</Msg>}
          </Form>
        ) : (
          <EditBtn onClick={() => setEditPassword(true)}>Change</EditBtn>
        )}
      </Section>
    </Container>
  );
};

const Container = styled.div`
  max-width: 600px;
  margin: 2em auto;
  padding: 0 1em;
`;

const Title = styled.h1`
  color: white;
  font-family: Verdana;
  font-size: 24px;
  margin-bottom: 1.5em;
`;

const Section = styled.div`
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 1.5em;
  margin-bottom: 1em;
`;

const SectionTitle = styled.h2`
  color: white;
  font-family: Verdana;
  font-size: 16px;
  margin: 0 0 0.5em 0;
`;

const CurrentValue = styled.p`
  color: #888;
  font-family: Verdana;
  font-size: 14px;
  margin: 0 0 1em 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75em;
`;

const Input = styled.input`
  background: #111;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 12px 14px;
  color: white;
  font-size: 14px;
  font-family: Verdana;
  outline: none;
  box-sizing: border-box;
  width: 100%;

  &:focus {
    border-color: #686cb9;
  }

  &::placeholder {
    color: #555;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.75em;
`;

const SaveBtn = styled.button`
  background: #686cb9;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  color: white;
  font-family: Verdana;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #7b7fcf;
  }
`;

const CancelBtn = styled.button`
  background: transparent;
  border: 1px solid #555;
  border-radius: 8px;
  padding: 10px 20px;
  color: #aaa;
  font-family: Verdana;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    border-color: #888;
    color: white;
  }
`;

const EditBtn = styled.button`
  background: transparent;
  border: 1px solid #686cb9;
  border-radius: 8px;
  padding: 8px 16px;
  color: #686cb9;
  font-family: Verdana;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: #686cb9;
    color: white;
  }
`;

const Msg = styled.p`
  color: #4ade80;
  font-family: Verdana;
  font-size: 13px;
  margin: 0;
`;

export default SettingsPage;
