import React, { Component } from "react";
import { connect } from "react-redux";
// import { addData } from "../../../actions";
// import { addData } from "core/api/upload";
import ProgressBarUi from "views/components/upload/ProgressBarUI";

import axios from "axios";

const getProgress = (taskId) => {
  return (dispatch) => {
    return axios
      .get(`http://localhost:8000/celery-progress/${taskId}`)
      .then((res) => {
        dispatch({
          type: "PROGRESS_BAR",
          payload: { taskid: taskId, ...res.data },
        });
        if (!res.data.complete && !res.data?.progess?.pending) {
        // if (!res.data.success && !res.data?.progess?.pending) {
          return dispatch(getProgress(taskId));
        }
      })
      .catch((err) =>
        console.log(err)
      );
  };
};

const addData = (data) => (dispatch, getState) => {
  axios
    .post(`http://localhost:8000/api/data/`, data)
    .then((res) => {
      dispatch({
        type: "ADD_DATA",
        payload: res.data,
      });

      const task_id = res.data?.task_id;
      dispatch(getProgress(task_id));
    })
    .catch((err) =>
      console.log(err)
    );
};

class AddData extends Component {
  onSubmit = (e) => {
    const data = {
      key1: "value1",
      key2: "value2",
    };
    // this.props.addExposure(data);
    this.props.addData(data);
  };

  render() {
    const { progress } = this.props;

    return (
      <div>
        {/* your progress bar goes here  */}
        {progress?.progress && !progress?.complete && (
          <ProgressBarUi percent={progress.progress?.percent} />
        )}

        ...
        ...
        ...
        {/* data submit button */}
        <input type="submit" value="Add data" onSubmit={this.onSubmit} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  progress: state.progress,
});

export default connect(mapStateToProps, {
  addData,
})(AddData);
