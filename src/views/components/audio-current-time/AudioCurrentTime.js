import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { getPlayerTimes } from 'core/reducers/selectors';
import FormattedTime from '../formatted-time';


const mapStateToProps = createSelector(
  getPlayerTimes,
  times => ({
    value: times.currentTime
  })
);

export default connect(
  mapStateToProps
)(FormattedTime);
