import React from "react";
import { Switch } from "react-router-dom";
import useScrollRestoration from "core/hooks/useScrollRestoration";
import useScrollMemory from "core/hooks/useScrollMemory";

function SwitchWithScrollRestoration({ children, location }) {
  useScrollRestoration();
  // useScrollMemory();
  // console.log("location:"+ location.key);
  return (
    <Switch location={location}>
      {children}
    </Switch>
  );
}

export default SwitchWithScrollRestoration;
