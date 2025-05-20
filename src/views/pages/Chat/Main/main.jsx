import React, { FC, useEffect, memo } from 'react';
import { getGlobal, withGlobal } from '../../lib/teact/teactn';

import { GlobalActions } from '../../global/types';
import { ApiMessage } from '../../api/types';



import LeftColumn from '../left/LeftColumn';
import MiddleColumn from '../middle/MiddleColumn';
import RightColumn from '../right/RightColumn';


import './Main.scss';


const ANIMATION_DURATION = 350;
const NOTIFICATION_INTERVAL = 1000;

let rightColumnAnimationTimeout;
let notificationInterval;

let DEBUG_isLogged = false;

const Main = ({


}) => {
  if (DEBUG && !DEBUG_isLogged) {
    DEBUG_isLogged = true;
    // eslint-disable-next-line no-console
    console.log('>>> RENDER MAIN');
  }

  // Initial API calls
  useEffect(() => {
    if (lastSyncTime) {
      updateIsOnline(true);
      loadAnimatedEmojis();
      loadNotificationSettings();
      loadNotificationExceptions();
    }
  }, [lastSyncTime, loadAnimatedEmojis, loadNotificationExceptions, loadNotificationSettings, updateIsOnline]);


  const className = buildClassName(
    middleColumnTransitionClassNames.replace(/([\w-]+)/g, 'middle-column-$1'),
    rightColumnTransitionClassNames.replace(/([\w-]+)/g, 'right-column-$1'),
  );

  useEffect(() => {
    // For animating Symbol Menu on mobile
    document.body.classList.toggle('is-middle-column-open', className.includes('middle-column-open'));
    // For animating components in portals (i.e. Notification)
    document.body.classList.toggle('is-right-column-shown', className.includes('right-column-open'));
  }, [className]);

  // Add `body` classes when toggling right column
  useEffect(() => {
    if (animationLevel > 0) {
      document.body.classList.add('animating-right-column');
      dispatchHeavyAnimationEvent(ANIMATION_DURATION + ANIMATION_END_DELAY);

      if (rightColumnAnimationTimeout) {
        clearTimeout(rightColumnAnimationTimeout);
        rightColumnAnimationTimeout = undefined;
      }

      rightColumnAnimationTimeout = window.setTimeout(() => {
        document.body.classList.remove('animating-right-column');
        rightColumnAnimationTimeout = undefined;
      }, ANIMATION_DURATION + ANIMATION_END_DELAY);
    }
  }, [animationLevel, isRightColumnShown]);

  useBackgroundMode(() => {
    updateIsOnline(false);
  }, () => {
    updateIsOnline(true);
  });

  // Browser tab indicators
  useBackgroundMode(() => {
    const initialUnread = selectCountNotMutedUnread(getGlobal());
    let index = 0;

    clearInterval(notificationInterval);
    notificationInterval = window.setInterval(() => {
      if (document.title.includes(INACTIVE_MARKER)) {
        updateIcon(false);
        return;
      }

      if (index % 2 === 0) {
        const newUnread = selectCountNotMutedUnread(getGlobal()) - initialUnread;
        if (newUnread > 0) {
          document.title = `${newUnread} notification${newUnread > 1 ? 's' : ''}`;
          updateIcon(true);
        }
      } else {
        document.title = PAGE_TITLE;
        updateIcon(false);
      }

      index++;
    }, NOTIFICATION_INTERVAL);
  }, () => {
    clearInterval(notificationInterval);
    notificationInterval = undefined;

    if (!document.title.includes(INACTIVE_MARKER)) {
      document.title = PAGE_TITLE;
    }

    updateIcon(false);
  });

  function stopEvent(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div id="Main" className={className} onDrop={stopEvent} onDragOver={stopEvent}>
      <LeftColumn />
      <MiddleColumn />
      <RightColumn />

    </div>
  );
};



export default memo(withGlobal(
  (global) => {
    const { chatId: audioChatId, messageId: audioMessageId } = global.audioPlayer;
    const audioMessage = audioChatId && audioMessageId
      ? selectChatMessage(global, audioChatId, audioMessageId)
      : undefined;

    return {
      animationLevel: global.settings.byKey.animationLevel,
      lastSyncTime: global.lastSyncTime,
      isLeftColumnShown: global.isLeftColumnShown,
      isRightColumnShown: selectIsRightColumnShown(global),
      isMediaViewerOpen: selectIsMediaViewerOpen(global),
      isForwardModalOpen: selectIsForwardModalOpen(global),
      hasNotifications: Boolean(global.notifications.length),
      hasErrors: Boolean(global.errors.length),
      audioMessage,
      safeLinkModalUrl: global.safeLinkModalUrl,
      isHistoryCalendarOpen: Boolean(global.historyCalendarSelectedAt),
    };
  },
  (setGlobal, actions) => pick(actions, [
    'loadAnimatedEmojis', 'loadNotificationSettings', 'loadNotificationExceptions', 'updateIsOnline',
  ]),
)(Main));
