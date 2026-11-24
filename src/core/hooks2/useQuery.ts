import { useLocation } from 'react-router-dom';

const useQuery = (url?: string): URLSearchParams => {
  const location = useLocation().search;
  return new URLSearchParams(url || location);
};

export default useQuery;
