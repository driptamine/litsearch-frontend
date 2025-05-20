import React from "react";
// import { StyledHome } from "../pages/Home";
import VideoGrid from "views/styles/VideoGrid";
import { SkeletonLine, VideoCardSkeleton } from "views/styles/Skeleton";

const HomeSkeleton = ({ title }) => {
  return (
    <div>
      {title && <SkeletonLine width="350px" height="30px" mb="30px" />}
      {!title && <div style={{ marginTop: "2rem" }} />}
      <VideoGrid>
        <VideoCardSkeleton width="350px" height="350px"/>
        <VideoCardSkeleton width="350px" height="350px"/>
        <VideoCardSkeleton width="350px" height="350px"/>
        <VideoCardSkeleton width="350px" height="350px"/>
        <VideoCardSkeleton width="350px" height="350px"/>
        <VideoCardSkeleton width="350px" height="350px"/>
        <VideoCardSkeleton width="350px" height="350px"/>
        <VideoCardSkeleton width="350px" height="350px"/>
        <VideoCardSkeleton width="350px" height="350px"/>
      </VideoGrid>
    </div>
  );
};

export default HomeSkeleton;
