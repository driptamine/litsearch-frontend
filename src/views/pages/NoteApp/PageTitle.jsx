import React from "react";
import { PageTitleInput } from "./styledComponents";

const PageTitle = ({ value, onChange }) => {
  return <PageTitleInput value={value} onChange={onChange} />;
};

export default PageTitle;
