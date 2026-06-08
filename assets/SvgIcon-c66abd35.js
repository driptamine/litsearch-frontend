var c=Object.defineProperty;var d=(e,o,s)=>o in e?c(e,o,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[o]=s;var t=(e,o,s)=>(d(e,typeof o!="symbol"?o+"":o,s),s);import{F as u,aT as f,j as x,s as M}from"./index-249b96e3.js";const m=e=>`
  color: ${e.color};
  height: ${e.size}px;
  width: ${e.size}px;
  ${e.fillFromParent?"":`fill: ${e.hovered?e.hoverColor:e.color};`}
`,p=()=>m,S=M("svg")({name:"Svg",class:"s1qhsytd",propsAsIs:!1,vars:{"s1qhsytd-0":[p()]}});class g extends u.Component{constructor(){super(...arguments);t(this,"state",{hovered:!1});t(this,"handleMouseLeave",s=>{this.setState({hovered:!1}),this.props.onMouseLeave&&this.props.onMouseLeave(s)});t(this,"handleMouseEnter",s=>{this.setState({hovered:!0}),this.props.onMouseEnter&&this.props.onMouseEnter(s)})}render(){const{size:s,color:r,hoverColor:n,viewBox:a,fillFromParent:l,children:h,...i}=this.props,{hovered:v}=this.state;return x.jsx(S,{...i,size:s,fillFromParent:l,color:r,hoverColor:n||r,hovered:v,onMouseEnter:this.handleMouseEnter,onMouseLeave:this.handleMouseLeave,viewBox:a,children:h})}}t(g,"defaultProps",{color:f,size:24,fillFromParent:!1,viewBox:"0 0 24 24"});export{g as S};
