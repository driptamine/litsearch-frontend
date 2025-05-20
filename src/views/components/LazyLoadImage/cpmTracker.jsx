import React, { Component } from "react";
import Observer from "@researchgate/react-intersection-observer";

class ImpressionClickTrackerHOC extends Component {
  handleChange = (event, unobserve) => {
    if (event.isIntersecting && event.intersectionRatio >= 1) {
     this.recordedTimeout = setTimeout(() => {
        // Send logs to server
        console.log("IMPRESSION" , {
          ...event.target.dataset
        });
        /** Use this for only tracking once per mount **/
        // if (event.isIntersecting) {
        //  unobserve();
        // }
      }, 1000); // Assuming impression is valid only after 1 second
    return;
    }
    clearTimeout(this.recordedTimeout);
  };
  handleClick = event => {
     // Send logs to server
     console.log(this.props.clickEvent || "UNKNOWN_CLICK_EVENT", {
      ...event.currentTarget.dataset
     });
  };
  render() {
    return (
      <Observer
        onChange={this.handleChange}
        onClick={this.handleClick}
        threshold={1}
        disabled={this.props.disableViewportTracking || false}
      >
        {React.cloneElement(this.props.children, {
          onClick: this.handleClick
        })}
      </Observer>
    );
  }
}

export default ImpressionClickTrackerHOC;

// Example
<ImpressionClickTrackerHOC
  clickEvent={`ADD-TO-CART`}
  disableViewportTracking={false}
>
    <div
      data-tracker-id={trackerId}
      data-display-name={displayName}
      data-listing-id={listingId}
    >
       ...
    </div>
</ImpressionClickTrackerHOC>
