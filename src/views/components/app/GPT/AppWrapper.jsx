import React, { useState } from 'react';
import Sidebar from './Sidebar';
import SidebarToggleButton from './SidebarToggleButton';
import HeaderWithToggle from './HeaderWithToggle';
import ModalManager from './ModalManager';
import ModalRoutes from 'views/components/ModalRoutes';
import Container from 'views/styles/Container';
import { useLocation } from 'react-router-dom';

const AppWrapper = ({ theme, themeToggler, childMessage, playerControls }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { pathname } = useLocation();
  const showChatList = pathname.startsWith('/chat');
  const isAuthPage = ['/', '/login', '/signup', '/auth/twitch/callback', '/auth/google/callback'].includes(pathname);

  return (
    <>
      {!isAuthPage && (
        <>
          <HeaderWithToggle
            theme={theme}
            themeToggler={themeToggler}
            imgSrc={childMessage}
          />
          <SidebarToggleButton
            isOpen={isSidebarOpen}
            toggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <Sidebar isOpen={isSidebarOpen} />
        </>
      )}

      {isAuthPage ? (
        <ModalRoutes {...playerControls} />
      ) : (
        <Container gotsidebar={true}>
          <ModalRoutes {...playerControls} />
        </Container>
      )}

      <ModalManager
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  );
};

export default AppWrapper;
