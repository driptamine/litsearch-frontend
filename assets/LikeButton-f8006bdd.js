import{j as s,a6 as f,s as n}from"./index-3bf4b2d2.js";import{L as x}from"./LikeIcon-49bfc675.js";const j=({isLiked:o,likesCount:l,onClick:t,size:a=18,showCount:c=!0,activeColor:e=f,inactiveColor:i="#71767b",hoverColor:p="#1d9bf0"})=>{const u=r=>{r.preventDefault(),r.stopPropagation(),t&&t()};return s.jsxs(L,{onClick:u,active:o,activeColor:e,hoverColor:p,inactiveColor:i,children:[s.jsx(x,{size:a,color:o?e:"currentColor",fill:o?e:"none"}),c&&s.jsx(v,{children:l||0})]})},k=o=>`
  color: ${o.active?o.activeColor:o.inactiveColor};
  &:hover {
    color: ${o.hoverColor};
  }
`,m=()=>k,L=n("button")({name:"LikeWrapper",class:"l1n0zxtl",propsAsIs:!1,vars:{"l1n0zxtl-0":[m()]}}),v=n("span")({name:"LikesCounter",class:"l17q8bi1",propsAsIs:!1});export{j as L};
