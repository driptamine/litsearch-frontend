import axios from "axios";

export const getProgress = (taskId) => {
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

export const addData = (data) => (dispatch, getState) => {
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
