import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import styled, { keyframes, css } from 'styled-components';

const VideoCard = ({ video, loading }) => {
  // Removed const [data, setData] = useState([]); as it was unused

  if (loading) {
    return (
      <Card>
        <ThumbnailSkeleton /> {/* Renamed Thumbnail to ThumbnailSkeleton for clarity */}
        <TitleSkeleton />
        <ChannelSkeleton />
      </Card>
    );
  }

  return (
    <StyledLink to={`video/1`}>
    <Card>

        {/* Use an actual img tag for the thumbnail */}
        <ThumbnailImage src={video.thumbNail} alt="Video Thumbnail" />
        {/*
          Reminder: video.title and video.channel are not present in your sample_api_data.
          You might want to display video.viewsCount and video.likesCount here instead,
          or add title/channel to your data.
        */}
        <Title>Video Title</Title>  
        <Channel>Channel Name</Channel>
        <InfoRow>
          <Count>{video.viewsCount} views</Count>
          <Count>{video.likesCount} likes</Count>
        </InfoRow>

    </Card>
    </StyledLink>
  );
};

const pulse = keyframes`
  0% { background-color: #e0e0e0; }
  50% { background-color: #f0f0f0; }
  100% { background-color: #e0e0e0; }
`;

const Card = styled.div`
  width: 100%;
  max-width: 320px;
   /* Add pointer cursor for interactivity */
`;

const SkeletonBox = styled.div`
  animation: ${pulse} 1.5s infinite; /* Uncommented the animation */
  border-radius: 4px;
`;

// New styled component for the actual image thumbnail
const ThumbnailImage = styled.img`
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 4px;
  object-fit: cover; /* Ensures the image covers the area without distortion */
`;

// Renamed for clarity in loading state
const ThumbnailSkeleton = styled(SkeletonBox)`
  width: 100%;
  aspect-ratio: 16 / 9;
`;

const Title = styled.h3`
  margin: 8px 0 4px;
  font-size: 16px;
  white-space: nowrap; /* Prevent text wrapping */
  overflow: hidden; /* Hide overflow */
  text-overflow: ellipsis; /* Add ellipsis for overflowed text */
`;

const Channel = styled.p`
  font-size: 14px;
  color: #606060;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 13px;
  color: #606060;
`;

const Count = styled.span`
  margin-right: 8px;
`;


const TitleSkeleton = styled(SkeletonBox)`
  height: 16px;
  width: 80%;
  margin: 8px 0 4px;
`;

const ChannelSkeleton = styled(SkeletonBox)`
  height: 14px;
  width: 60%;
`;

const StyledLink = styled(Link)`
  color: ${props => props.theme.text};
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: none;
    cursor: pointer;
  }
  font-family: Verdana;
`;
export default VideoCard;
