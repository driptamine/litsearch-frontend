// https://stackoverflow.com/questions/47921532/style-a-slider-thumb-with-styled-components/47932710#47932710

const ScrollContainer = styled.div`
  width: 100%;
  height: 500px;
  overflow-y: auto;
  position: relative;
  &::-webkit-scrollbar {
    width: 10px;
    border: 1px solid black;
  }
`;

const FaderInput = styled.input`

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 15px;
    height: 15px;
    border:1px solid black;
  }
`
