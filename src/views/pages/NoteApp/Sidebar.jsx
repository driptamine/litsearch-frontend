import React from "react";
import { SidebarContainer } from "./styledComponents";

const Sidebar = () => {
  return (
    <SidebarContainer>
      {[...Array(20)].map((_, i) => (
        <React.Fragment key={i}>
          <h3>Workspace</h3>
          <p>My Page</p>
        </React.Fragment>
      ))}
    </SidebarContainer>
  );
};

export default Sidebar;
