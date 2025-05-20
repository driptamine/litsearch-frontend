import { useEffect } from 'react';
// import { Route } from 'react-router-dom';
import { Route, useLocation, useHistory } from 'react-router-dom';
// import propTypes from 'prop-types';
import useModalGallery from "core/hooks/useModalGallery";

function ModalRouteContent({ defaultParentPath, children, ...rest }) {
  const { backgroundLocation } = useModalGallery();

  // const { location, history } = rest;
  const location = useLocation();
  const history = useHistory();

  const isModal = location.state && location.state.modal;
  const isInitialRender = backgroundLocation === location;

  // isModal: false => User opened a modal route directly (opened on a new tab etc.)
  // isInitialRender: true => User refreshed the page while on a modal route (pressed the F5 etc.)
  const reRenderRoute = !isModal || isInitialRender;

  useEffect(() => {
    function addStateToLocation() {
      history.replace({
        ...location,
        state: {
          ...location.state,
          modal: false
        }
      });
    }

    if (reRenderRoute ) {

      addStateToLocation();
      console.log("RE-RENDER");
      if (history.action === 'POP'){

      }
    }
  }, [location, defaultParentPath, reRenderRoute, history]);

  return !reRenderRoute
    ? children({
        ...rest
      })
    : null;
}

// ModalRouteContent.propTypes = {
//   ...Route.propTypes,
//   defaultParentPath: propTypes.string.isRequired
// };

export default ModalRouteContent;
