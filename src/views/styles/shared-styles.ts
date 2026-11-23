import { css } from '@linaria/core';

export const layout = props => `
  display: ${props.display || 'grid'};
  flex: ${props.flex || 'unset'};
  align-items: ${props.alignItems || 'stretch'};
  justify-content: ${props.justifyContent || 'flex-start'};
`;

export const spacing = props => `
  margin: ${props.m || 'unset'};
  margin-top: ${props.mt || props.my || props.m || 'unset'};
  margin-bottom: ${props.mb || props.my || props.m || 'unset'};
  margin-left: ${props.ml || props.mx || props.m || 'unset'};
  margin-right: ${props.mr || props.mx || props.m || 'unset'};
  padding: ${props.p || 'unset'};
  padding-top: ${props.pt || props.py || props.p || 'unset'};
  padding-bottom: ${props.pb || props.py || props.p || 'unset'};
  padding-left: ${props.pl || props.px || props.p || 'unset'};
  padding-right: ${props.pr || props.px || props.p || 'unset'};
`;

export const dimensions = props => `
  width: ${props.width || 'unset'};
  height: ${props.height || 'unset'};
`;
