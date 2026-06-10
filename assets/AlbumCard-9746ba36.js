import{w as m,e as u,u as k,s as p,a as h,j as e,M as x,g as A,v as a,x as t,d as l,B,h as C,i as L}from"./index-cd9f76e9.js";import{B as f,a as i}from"./BaseCardHeader-d24b0255.js";import{B as j}from"./BaseCard-e6aaf29e.js";import{L as _}from"./LikeIcon-32a8497b.js";function b({albumId:o,subheader:r,handleLikePhoto:n,handleUnLikePhoto:c}){const s=k(d=>p.selectAlbum(d,o));return h(),e.jsx(x,{to:`/album/${o}`,children:e.jsxs(j,{hasActionArea:!0,children:[e.jsx(f,{src:s.images[0]?s.images[0].url:"",alt:s.name,aspectRatio:A(3,3)}),s.name,e.jsx(i,{title:s.name,subheader:r}),e.jsx(i,{subheader:r}),e.jsxs(y,{likedByUser:s.is_liked,onClick:()=>s.is_liked?c(s.id):n(s.id),children:[e.jsx(_,{size:18,color:s.is_liked?a:t,hoverColor:s.is_liked?a:t}),e.jsx(v,{children:s.total_likes})]})]})})}const g=o=>`
  ${o.likedByUser?`
    background-color: ${t};
    color: ${a};
    &:hover {
      color: ${a};
      border-color: transparent !important;
    }
  `:""}
`,w=()=>B,$=()=>g,y=l(w())({name:"LikedBtn",class:"lsxmo2w",propsAsIs:!0,vars:{"lsxmo2w-0":[$()]}}),v=l("span")({name:"LikesCounter",class:"l16d424h",propsAsIs:!1}),M=m(u(null,{handleLikePhoto:C,handleUnLikePhoto:L})(b));export{M as A};
