import { InView } from 'react-intersection-observer';

<ScrollWrapper indicators="all">
  <InView
    onChange={function noRefCheck(){}}
    threshold={0}
    triggerOnce
  />
</ScrollWrapper>
