import styled from 'styled-components';

export const FlexBoxAttachments = styled.div`
  display: flex;
`;

export const Attachments = styled.div``;

export const FlexBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 600px;
  background: ${(props) => props.theme.cardColor};
`;

export const DropZone = styled.div`
  position: absolute;
  top: 81px;
  width: 597px;
  height: 142px;
  background: rgba(240, 248, 255, 0.85);
  border: 2px dashed #4a90e2;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  color: #333;
  transition: all 0.2s ease;
`;

export const Button = styled.div`
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CreatePostButton = styled.button`
  cursor: pointer;
  margin-left: auto;
  color: white;
  height: 40px;
  background: #7886c9;
  border-radius: 5px;
  border: none;
`;

export const WrapperContent = styled.div`
  cursor: pointer;
  margin: auto;
  border-radius: 5px;

  &:hover {
    background-color: ${(props) => props.theme.attachmentColor};
  }
`;

export const TextArea = styled.textarea`
  box-sizing: border-box;
  display: block;
  background: ${(props) => props.theme.cardColor};
  color: ${(props) => props.theme.text};
  width: 100%;
  padding: 10px;
  resize: none;
  outline: none;
  border-bottom: 1px solid ${(props) => props.theme.textareaBorderColor};
  border-left: none;
  border-top: none;
  border-right: none;

  &:focus {
    border-bottom: 1px solid ${(props) => props.theme.textareaBorderColor};
  }
`;
