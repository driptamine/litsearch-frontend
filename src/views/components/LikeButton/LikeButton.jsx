// import React from 'react';
// import './LikeButton.css';
// import  { connect } from 'react-redux';
// // import ClickNHold from 'react-click-n-hold';
// // import  ReactHoldButton from 'react-long-press';
// import { likeTrackAction } from '../../core/tracklists/actions';
//
// class LikeButton extends React.Component {
//   constructor(props) {
//     super(props);
//     this.handleClick = this._handleClick.bind(this);
//     this.onReviewsClick = this._onReviewsClick.bind(this);
//     this.likeClick = this._likeClick.bind(this);
//   }
//
//   _handleClick(event) {
//     event.preventDefault();
//     if (this.props.liked) {
//       this.props.onDislike();
//     } else {
//       this.props.onLike();
//     }
//   }
//
//   _onReviewsClick(event) {
//     console.log('REVIEWS');
//   }
//
//   _likeClick(e) {
//     e.preventDefault();
//     console.log('LIKE')
//     this.props.onClick(this.props.track.id)
//   }
//
//   start(e) {
//     console.log('start')
//   }
//   end(e, enough) {
//     console.log('end');
//     // console.log(enough ? 'Click released after enough time': 'Click released too soon');
//   }
//
//   clickNHold(e) {
//     console.log('dislike')
//   }
//
//   doubleClick(e){
//     e.preventDefault();
//     console.log('DOUBLE');
//   }
//
//
//   render() {
//     const defBtn = require(`./../images/black-mascot.png`);
//     const likedBtn = require(`./../images/purple-mascot-pale.png`);
//     const dislikedBtn = require(`./../images/heartbreak-mascot-red.png`);
//     let button = null;
//     let count = null;
//
//     if (this.props.liked) {
//       button = <img src={likedBtn} className="LikeButton__icon LikeButton__icon--liked"/>
//       count = <span className="track-card__views">{this.props.likesCount}</span>
//     } else if (this.props.disliked) {
//       button = <img src={dislikedBtn} className="LikeButton__icon LikeButton__icon--liked"/>
//       count = <span className="track-card__views">{this.props.dislikesCount}</span>
//     } else if (!this.props.disliked && !this.props.liked) {
//       button = <img src={defBtn} className="LikeButton__icon LikeButton__icon--liked"/>
//       count = <span className="track-card__views">{this.props.viewsCount}</span>
//     }
//
//     return (
//       <div className="TEST">
//         <button className="track-card__btn LikeButton__root"
//           onClick={this.likeClick}
//           onDoubleClick={this.onReviewsClick}>
//           {button}
//           <span className="track-card__views">1979</span>
//         </button>
//       </div>
//     );
//   }
// }
//
// const mapStateToProps = (state) => ({
//   // tracks: state.tracks.get('tracks'),
//   error: state.tracks.get('error')
// });
//
// export default connect(
//   mapStateToProps, {likeTrackAction}
// )(LikeButton);
