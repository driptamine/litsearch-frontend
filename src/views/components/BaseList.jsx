import React from "react";
import styled from "styled-components";

// MATERIAL DONE
// import { List } from "@mui/material";
import { StyledList } from 'views/styledComponents';

// VIEWS
import LoadingIndicator from "./LoadingIndicator";


function BaseList({
  data,
  renderItem,
  loading,
  listEmptyMesage = "Nothing has been found"
}) {
  if (loading) {
    return <LoadingIndicator loading />;
  } else if (!data.length) {
    return listEmptyMesage;
  }

  return <StyledList>{data.map((item, index) => renderItem(item, index))}</StyledList>;
}

export default BaseList;
