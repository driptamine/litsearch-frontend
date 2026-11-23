import { useSelector } from 'react-redux';
import { selectors } from 'core/reducers/index';

const useSelectAuthUser = () => {
  const isFetching = false;
  const isSignedIn = useSelector(state => selectors.selectisSignedIn(state));
  const authUser = useSelector(state => selectors.selectAuthUser(state));

  return { isFetching, isSignedIn, authUser };
};

export default useSelectAuthUser;
