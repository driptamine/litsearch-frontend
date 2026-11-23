import React, { useEffect, useRef } from 'react';
import { styled } from '@linaria/react';

const MENU_WIDTH = 200;
const MENU_ITEM_HEIGHT = 40;

const clampMenuPosition = (x, y, count) => {
  const width = MENU_WIDTH;
  const height = count * MENU_ITEM_HEIGHT + 8;
  return {
    x: Math.max(8, Math.min(x, window.innerWidth - width - 8)),
    y: Math.max(8, Math.min(y, window.innerHeight - height - 8)),
  };
};

// Long-press (touch) that behaves like a right-click. Returns bind props for
// the message row: press-and-hold fires onMenu, any move/scroll cancels it.
export const useLongPressMenu = (onMenu, message, { delay = 550 } = {}) => {
  const timer = useRef(null);
  const startPos = useRef(null);
  const firedAt = useRef(0);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const cancel = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    startPos.current = null;
  };

  return {
    onTouchStart: (e) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      startPos.current = { x: touch.clientX, y: touch.clientY };
      timer.current = setTimeout(() => {
        timer.current = null;
        firedAt.current = Date.now();
        if (navigator.vibrate) {
          try { navigator.vibrate(15); } catch (_) {}
        }
        onMenu(touch.clientX, touch.clientY, message, true);
      }, delay);
    },
    onTouchMove: (e) => {
      if (!startPos.current) return;
      const touch = e.touches[0];
      if (Math.abs(touch.clientX - startPos.current.x) > 10 ||
          Math.abs(touch.clientY - startPos.current.y) > 10) {
        cancel();
      }
    },
    onTouchEnd: cancel,
    onTouchCancel: cancel,
    onContextMenu: (e) => {
      // Mobile browsers may fire contextmenu right after a long-press.
      if (Date.now() - firedAt.current < 1200) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      onMenu(e.clientX, e.clientY, message, false);
    },
  };
};

const MessageContextMenu = ({ x, y, items, onSelect, onClose, guardTouch }) => {
  const menuRef = useRef(null);
  const pos = clampMenuPosition(x, y, items.length);
  // After a long-press the finger lifting off synthesizes a click that lands
  // on the freshly opened menu (usually the first item). Swallow early taps.
  const openedAt = useRef(Date.now());
  const isFreshTap = () => guardTouch && Date.now() - openedAt.current < 450;

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const handleScroll = () => onClose();
    document.addEventListener('keydown', handleKey, true);
    document.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', onClose);
    return () => {
      document.removeEventListener('keydown', handleKey, true);
      document.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', onClose);
    };
  }, [onClose]);

  return (
    <Overlay onClick={() => { if (!isFreshTap()) onClose(); }} onContextMenu={(e) => { e.preventDefault(); onClose(); }}>
      <Menu
        ref={menuRef}
        style={{ left: pos.x, top: pos.y }}
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.stopPropagation()}
      >
        {items.map(item => (
          <MenuItem
            key={item.key}
            danger={item.danger}
            disabled={item.disabled}
            onClick={() => { if (!item.disabled && !isFreshTap()) { onClose(); onSelect(item.key); } }}
          >
            {item.icon && <ItemIcon>{item.icon}</ItemIcon>}
            <ItemLabel>{item.label}</ItemLabel>
          </MenuItem>
        ))}
      </Menu>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
`;

const Menu = styled.div`
  position: fixed;
  width: ${MENU_WIDTH}px;
  background: #242424;
  border: 1px solid #444;
  border-radius: 10px;
  padding: 4px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: ${MENU_ITEM_HEIGHT}px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: ${({ danger }) => (danger ? '#ff5252' : '#eee')};
  font-size: 14px;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  text-align: left;
  &:hover {
    background: ${({ disabled }) => (disabled ? 'transparent' : 'rgba(255, 255, 255, 0.08)')};
  }
`;

const ItemIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  color: #4db6ac;
`;

const ItemLabel = styled.span`
  flex: 1;
`;

export default MessageContextMenu;
