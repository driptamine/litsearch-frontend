import React from 'react'
import ReactDOM from 'react-dom'
import ViewTracker from './view-tracker'

const sendTrackingEvent = () => {
  // Send tracking event
}
const images = data.map(item => (
  <Image
    key={item.id}
    src={item.thumbnailUrl}
    fallbackSrc={fallbackImage}
    isLazy
    style={{
      display: 'block',
      height: '150px',
      width: '150px',
      margin: 'auto',
      marginBottom: '15px'
    }}
    alt='thumbnails'
  />
))

const App = () => (
  <div>
    <ViewTracker key="some-unique-key" onView={sendTrackingEvent}>
      <SomeComponent />
      {images}
    </ViewTracker>
  </div>
)
