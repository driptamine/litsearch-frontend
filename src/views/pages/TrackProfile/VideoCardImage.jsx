// Styles
import { Wrapper } from './Card.styles';


const Card = ({ logo, video }) => {
  const handleOnMouseOver = (e) => {
    e.currentTarget.play();
  };

  const handleOnMouseOut = (e) => {
    e.currentTarget.pause();
  };

  return (
    <Wrapper>
      <div className="border" />
      <img src={logo} alt='logo' />
      <video
        loop
        preload='none'
        muted // Needs to be there to be able to play
        onMouseOver={handleOnMouseOver}
        onMouseOut={handleOnMouseOut}
      >
        <source src={video} type='video/mp4' />
      </video>
    </Wrapper>
  );
};

export default Card;
