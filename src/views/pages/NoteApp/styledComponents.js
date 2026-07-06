import { styled } from '@linaria/react';

export const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;

  @media (min-width: 768px) {
    padding-left: 240px;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

export const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background: #f5f5f5;
  padding: 20px;
  overflow-y: auto;
  box-sizing: border-box;

  @media screen and (max-width: 768px) {
    width: 100%;
    height: auto;
    max-height: 30vh;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
`;

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const SidebarTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
`;

export const AddPageButton = styled.button`
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: #e0e0e0;
  }
`;

export const SidebarPageItem = styled.div`
  padding: 8px 12px;
  margin: 2px 0;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  background: ${props => props.$active ? '#e0e0e0' : 'transparent'};
  &:hover {
    background: #e8e8e8;
  }
`;

export const PageContainerWrapper = styled.div`
  flex: 1;
  padding: 40px;
  overflow-y: auto;

  @media screen and (max-width: 768px) {
    padding: 20px;
  }
`;

export const PageTitleInput = styled.input`
  font-size: 32px;
  font-weight: bold;
  border: none;
  outline: none;
  width: 100%;
  height: 60px;
  margin-bottom: 16px;
`;

export const BlockWrapper = styled.div`
  margin: 4px 0;
`;

export const BlockTextarea = styled.textarea`
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  overflow: hidden;
  font-size: 16px;
  line-height: 1.6;
  background: transparent;
  min-height: 28px;
  padding: 4px 0;
  font-family: inherit;
  box-sizing: border-box;

  &:focus {
    background: #fafafa;
  }
`;

export const BlockPreview = styled.div`
  margin-top: 4px;
  padding: 8px;
  background: #f9f9f9;
  border-radius: 4px;
  font-size: 16px;
  line-height: 1.6;
`;

export const TagInputWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  padding: 6px 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  min-height: 36px;

  &:focus-within {
    border-color: #aaa;
  }
`;

export const TagChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #e8e8e8;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.5;
`;

export const TagRemove = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  line-height: 1;
  color: #888;

  &:hover {
    color: #333;
  }
`;

export const TagInputField = styled.input`
  border: none;
  outline: none;
  flex: 1;
  min-width: 80px;
  font-size: 13px;
  padding: 2px 0;
`;

export const SidebarSearchInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  outline: none;
  box-sizing: border-box;
  margin-bottom: 8px;

  &:focus {
    border-color: #aaa;
  }
`;

export const LoadingText = styled.div`
  padding: 40px;
  font-size: 18px;
  color: #888;
`;
