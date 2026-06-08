import{w as d,k as u,u as k,a as p,b as h,j as e,N as x,c as A,a5 as a,a6 as t,s as l,a7 as B,l as f,m as C}from"./index-18aeb89d.js";import{B as L}from"./BaseImage-34361eb5.js";import{B as j}from"./BaseCard-4a3b2ffa.js";import{B as i}from"./BaseCardHeader-2c2b1668.js";import{L as b}from"./LikeIcon-a847d3df.js";function _({albumId:o,subheader:r,handleLikePhoto:n,handleUnLikePhoto:c}){const s=k(m=>p.selectAlbum(m,o));return h(),e.jsx(x,{to:`/album/${o}`,children:e.jsxs(j,{hasActionArea:!0,children:[e.jsx(L,{src:s.images[0]?s.images[0].url:"",alt:s.name,aspectRatio:A(3,3)}),s.name,e.jsx(i,{title:s.name,subheader:r}),e.jsx(i,{subheader:r}),e.jsxs(y,{likedByUser:s.is_liked,onClick:()=>s.is_liked?c(s.id):n(s.id),children:[e.jsx(b,{size:18,color:s.is_liked?a:t,hoverColor:s.is_liked?a:t}),e.jsx(I,{children:s.total_likes})]})]})})}const g=o=>`
  ${o.likedByUser?`
    background-color: ${t};
    color: ${a};
    &:hover {
      color: ${a};
      border-color: transparent !important;
    }
  `:""}
`,w=()=>B,$=()=>g,y=l(w())({name:"LikedBtn",class:"lsxmo2w",propsAsIs:!0,vars:{"lsxmo2w-0":[$()]}}),I=l("span")({name:"LikesCounter",class:"l16d424h",propsAsIs:!1}),z=d(u(null,{handleLikePhoto:f,handleUnLikePhoto:C})(_));export{z as A};
