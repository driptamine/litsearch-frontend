import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { IoAppsOutline } from "react-icons/io5";


const DropdownApps = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const apps = [
    { name: 'App 1', path: '/app1', logo: 'https://via.placeholder.com/40?text=A1' },
    { name: 'App 2', path: '/app2', logo: 'https://via.placeholder.com/40?text=A2' },
    { name: 'App 3', path: '/app3', logo: 'https://via.placeholder.com/40?text=A3' },
    { name: 'App 4', path: '/app4', logo: 'https://via.placeholder.com/40?text=A4' },
    { name: 'App 5', path: '/app5', logo: 'https://via.placeholder.com/40?text=A5' },
    { name: 'App 6', path: '/app6', logo: 'https://via.placeholder.com/40?text=A6' },
    { name: 'App 7', path: '/app7', logo: 'https://via.placeholder.com/40?text=A7' },
    { name: 'App 8', path: '/app8', logo: 'https://via.placeholder.com/40?text=A8' },
    { name: 'App 9', path: '/app9', logo: 'https://via.placeholder.com/40?text=A9' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownButton onClick={() => setOpen(!open)}>
        <IoAppsOutline />
      </DropdownButton>

      <DropdownContent open={open}>
        {apps.map((app) => (
          <GridItem to={app.path} key={app.name} onClick={() => setOpen(false)}>
            <Logo src={app.logo} alt={app.name} />
            <Label>{app.name}</Label>
          </GridItem>
        ))}
      </DropdownContent>
    </DropdownContainer>
  );
};


// Container
const DropdownContainer = styled.div`
  position: relative;
`;

// Button
const DropdownButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
`;

// Content Grid
const DropdownContent = styled.div`
  display: ${({ open }) => (open ? 'grid' : 'none')};
  position: absolute;
  background-color: white;
  padding: 12px;
  border: 1px solid #ddd;
  box-shadow: 0px 8px 16px rgba(0,0,0,0.2);
  top: 62px;
  right: 0;
  z-index: 1;

  grid-template-columns: repeat(3, 80px);
  grid-gap: 12px;
`;

// Each grid item
const GridItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: black;

  &:hover {
    background-color: #f5f5f5;
    border-radius: 4px;
  }
`;

// Logo
const Logo = styled.img`
  width: 40px;
  height: 40px;
  margin-bottom: 4px;
`;

const Label = styled.span`
  font-size: 12px;
  text-align: center;
`;

export default DropdownApps;
