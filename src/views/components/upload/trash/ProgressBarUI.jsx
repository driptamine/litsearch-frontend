import React, { Component } from "react";
import { connect } from "react-redux";
// import { ProgressBar } from "react-bootstrap";
// import { LinearProgressWithLabel } from "@mui/material"

class ProgressBarUi extends Component {
  render() {
    const { percent } = this.props;
    return (
      <div
        now={percent}
        animated
        variant="success"
        label={`${percent}%`}
      />

      // <LinearProgressWithLabel
      //   value={progress}
      // />
    );
  }
}

export default ProgressBarUi;
