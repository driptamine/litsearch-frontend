import{w as m,e as u,u as k,s as p,a as h,j as e,M as x,g as A,x as a,y as t,d as l,B,h as C,i as L}from"./index-9ffe7954.js";import{B as f,a as i}from"./BaseCardHeader-c55862dd.js";import{B as j}from"./BaseCard-810beb94.js";import{L as _}from"./LikeIcon-6a72133b.js";function b({albumId:o,subheader:r,handleLikePhoto:n,handleUnLikePhoto:c}){const s=k(d=>p.selectAlbum(d,o));return h(),e.jsx(x,{to:`/album/${o}`,children:e.jsxs(j,{hasActionArea:!0,children:[e.jsx(f,{src:s.images[0]?s.images[0].url:"",alt:s.name,aspectRatio:A(3,3)}),s.name,e.jsx(i,{title:s.name,subheader:r}),e.jsx(i,{subheader:r}),e.jsxs($,{likedByUser:s.is_liked,onClick:()=>s.is_liked?c(s.id):n(s.id),children:[e.jsx(_,{size:18,color:s.is_liked?a:t,hoverColor:s.is_liked?a:t}),e.jsx(I,{children:s.total_likes})]})]})})}const g=o=>`
  ${o.likedByUser?`
    background-color: ${t};
    color: ${a};
    &:hover {
      color: ${a};
      border-color: transparent !important;
    }
  `:""}
`,w=()=>B,y=()=>g,$=l(w())({name:"LikedBtn",class:"lsxmo2w",propsAsIs:!0,vars:{"lsxmo2w-0":[y()]}}),I=l("span")({name:"LikesCounter",class:"l16d424h",propsAsIs:!1}),M=m(u(null,{handleLikePhoto:C,handleUnLikePhoto:L})(b));export{M as A};
