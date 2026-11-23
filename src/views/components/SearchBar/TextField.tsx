// REFERENCE https://github.com/atahani/reactjs-unsplash

import React from 'react';
import { styled } from '@linaria/react';
import { lighten, darken } from 'polished';
import { inputBgColor, textColor2, errorColor, warnColor, successColor, } from 'views/style/colors';

const inputStyles = props => `
  width: ${props.fullWidth ? '100%' : '65%'};
  border-radius: ${props.rounded ? '10px' : '3px'};
  ${props.disabled ? 'opacity: 0.6;' : ''}
  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px ${props.msgColor ? lighten(0.27, props.msgColor) : inputBgColor} inset;
  }
`;

const Input = styled.input`
  border: none;
  background-color: var(--searchBarColor);
  box-shadow: none;
  position: relative;
  padding: 12px;
  height: 36px;
  ${inputStyles}
  box-sizing: border-box;
  font-family: inherit;
  font-size: 14px;
  font-weight: normal;
  outline: none;
  line-height: 16px;
  color: var(--text);
  &:focus {
    border-color: ${darken(0.1, inputBgColor)};
    color: black;
    background-color: var(--searchBarFocus);
  }
`;

const areaInputStyles = props => `
  background-color: ${props.msgColor ? lighten(0.27, props.msgColor) : inputBgColor};
  width: ${props.fullWidth ? '100%' : 'none'};
  border: ${props.msgColor ? `1px solid${darken(0.1, props.msgColor)}` : '0px'};
  padding: ${props.multiLanguage ? '10px 10px 24px 10px' : '10px'};
  ${props.disabled ? 'opacity: 0.6;' : ''}
`;

const AreaInput = styled.textarea`
  resize: none;
  ${areaInputStyles}
  box-shadow: none;
  position: relative;
  border-radius: 3px;
  box-sizing: border-box;
  font-family: IRANSans, Helvetica, Verdana, sans-serif;
  font-size: 14px;
  font-weight: normal;
  outline: none;
  color: ${textColor2};
  &:focus {
    outline: ${`${darken(0.35, inputBgColor)} auto 1px !important`};
    background-color: var(--searchBarFocus);
  }
`;

const messgaeStyles = props => `
  color: ${props.color};
`;

const Messgae = styled.p`
  ${messgaeStyles}
  font-size: 13px;
  padding: 6px 3px;
`;

const getColorOfMessage = msgType => {
  switch (msgType) {
    case 'error':
      return errorColor;
    case 'warn':
      return warnColor;
    default:
      // 'success'
      return successColor;
  }
};

// type Props = {
//   wrapperStyle?: Object,
//   disabled?: boolean,
//   fullWidth?: boolean,
//   rounded?: boolean,
//   hintText?: string,
//   multiLine?: boolean,
//   message?: ?string,
//   messageType?: 'error' | 'warn' | 'success',
//   messageColor?: string,
// };

const TextInput = ({
  className,
  wrapperStyle,
  disabled,
  fullWidth,
  hintText,
  multiLine,
  message,
  messageType,
  messageColor,
  rounded,
  ...others
}) => {
  const msgColor = messageColor ? messageColor : getColorOfMessage(messageType);
  const input = () => {
    if (multiLine) {
      return (
        <AreaInput
          {...others}
          className={className}
          disabled={disabled}
          placeholder={hintText}
          fullWidth={fullWidth}
          msgColor={message ? msgColor : void 0}
          {...others}
        />
      );
    }
    return (
      <Input
        {...others}
        type="text"
        disabled={disabled}
        placeholder={hintText}
        className={className}
        rounded={rounded}
        msgColor={message ? msgColor : void 0}
        fullWidth={fullWidth}
        {...others}
      />
    );
  };
  const msg = () => {
    if (message) {
      return <Messgae>{message}</Messgae>;
    }
  };
  return (
    <div className={className} style={wrapperStyle}>
      {input()}
      {msg()}
    </div>
  );
};

TextInput.defaultProps = {
  wrapperStyle: {},
  fullWidth: false,
  rounded: false,
  disabled: false,
  hintText: '',
  multiLine: false,
  message: null,
  messageType: 'error',
  messageColor: errorColor,
};

export default TextInput;
