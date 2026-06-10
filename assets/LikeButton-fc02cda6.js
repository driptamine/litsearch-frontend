import{j as t,x,d as n}from"./index-cd9f76e9.js";import{L as f}from"./LikeIcon-32a8497b.js";const h=({isLiked:o,likesCount:l,onClick:s,size:a=18,showCount:c=!0,activeColor:e=x,inactiveColor:i="#71767b",hoverColor:p="#1d9bf0"})=>{const u=r=>{r.preventDefault(),r.stopPropagation(),s&&s()};return t.jsxs(L,{onClick:u,active:o,activeColor:e,hoverColor:p,inactiveColor:i,children:[t.jsx(f,{size:a,color:o?e:"currentColor",fill:o?e:"none"}),c&&t.jsx(v,{children:l||0})]})},k=o=>`
  color: ${o.active?o.activeColor:o.inactiveColor};
  &:hover {
    color: ${o.hoverColor};
  }
`,m=()=>k,L=n("button")({name:"LikeWrapper",class:"l1n0zxtl",propsAsIs:!1,vars:{"l1n0zxtl-0":[m()]}}),v=n("span")({name:"LikesCounter",class:"l17q8bi1",propsAsIs:!1});export{h as L};
