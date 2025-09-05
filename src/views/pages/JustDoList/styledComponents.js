import styled from "styled-components";

export const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
`;

export const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background: #f5f5f5;
  padding: 20px;
  overflow-y: auto;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
`;

export const PageContainerWrapper = styled.div`
  flex: 1;
  padding: 40px;
  overflow-y: auto;
`;

export const PageTitleInput = styled.input`
  font-size: 32px;
  font-weight: bold;
  border: none;
  outline: none;
  width: 100%;
  height: 100px;
`;

export const BlockWrapper = styled.div`
  margin: 20px 0;
`;

export const BlockTextarea = styled.div`
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  font-size: 16px;
  line-height: 1.6;
  background: transparent;
`;
