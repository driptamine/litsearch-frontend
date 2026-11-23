import { styled } from '@linaria/react';
import { dimensions, spacing } from 'views/styles/shared-styles';

const SkeletonPulse = styled.div`
  display: block;
  height: 100%;
  width: 100%;
  background: linear-gradient(-90deg, #121212 0%, #161616 50%, #121212 100%);
  background-size: 400% 400%;
  animation: pulse 1s linear;

  @keyframes pulse {
    0% {
      background-position: 0% 0%;
    }

    100% {
      background-position: -135% 0%;
    }
  }
`;

export const SkeletonLine = styled(SkeletonPulse)`
  ${spacing}
  ${dimensions}
  border-radius: 4px;

  &::before {
    content: "\\00a0";
  }
`;

export const VideoCardSkeleton = styled(SkeletonLine)`
	${dimensions}
	animation: pulse 1s linear;

  @keyframes pulse {
    0% {
      background-position: 0% 0%;
    }

    100% {
      background-position: -135% 0%;
    }
  }
	
  @media screen and (max-width: 600px) {
    height: 250px;
  }

  @media screen and (max-width: 420px) {
    height: 200px;
  }
`;

export const TrendingCardSkeleton = styled(SkeletonLine)`
  width: 250px;
  height: 140px;

  @media screen and (max-width: 645px) {
    width: 100%;
    height: 300px;
  }

  @media screen and (max-width: 530px) {
    width: 100%;
    height: 250px;
  }

  @media screen and (max-width: 420px) {
    width: 100%;
    height: 200px;
  }
`;

export const ChannelInfoSkeleton = styled(SkeletonLine)`
	width: 134px;
	height: 134px;
	border-radius: 67px;
	margin-right: 1.2rem;

	@media screen and (max-width: 580px) {
		width: 100px;
		height: 100px;
	}

	@media screen and (max-width: 400px) {
		width: 50px;
		height: 50px;
		position: relative;
		top: -16px;
  }
`;
