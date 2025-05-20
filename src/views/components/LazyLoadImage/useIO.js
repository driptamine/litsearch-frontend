// REFERENCE https://dev.to/deepakfilth/how-to-optimize-your-site-using-intersection-observer-api-413l

import { useEffect, useRef, useState } from 'react';

const useIO = (options) => {
	const [elements, setElements] = useState([]);
	const [entries, setEntries] = useState([]);

	const observer = useRef(null);

	const { root, rootMargin, threshold } = options || {}

	useEffect(() => {
		if (elements.length) {
			console.log('-----CONNECTING OBSERVER------');
			observer.current = new IntersectionObserver((ioEntries) => {
				setEntries(ioEntries);
				postImpression('https://api.litloop.co/post/jHsqT/views', {})
			}, {
				threshold,
				root,
				rootMargin
			});

			elements.forEach(element => {
				observer.current.observe(element);
			});
		}
		return () => {
			if (observer.current) {
				console.log('-----DISCONNECTING OBSERVER------');
				observer.current.disconnect();
			}
		}
	}, [elements, root, rootMargin, threshold]);

	return [observer.current, setElements, entries];
};

export default useIO;
