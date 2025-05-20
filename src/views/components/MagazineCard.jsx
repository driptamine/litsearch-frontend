import React from "react";
import { useSelector } from "react-redux";

// MATERIAL DONE
// import { makeStyles } from "@mui/material/styles";


import BaseImage from "views/components/BaseImage";
import BaseCard from "views/components/BaseCard";
import RouterLink from "views/components/RouterLink";
import ModalLink from "views/components/ModalLink";
import BaseCardHeader from "views/components/BaseCardHeader";
// import MagazineRatingTag from "./MagazineRatingTag";
import { getAspectRatioString } from "./AspectRatio";
import { useConfiguration } from "./ConfigurationProvider";

import { selectors } from "core/reducers/index";

// const useStyles = makeStyles(theme => ({
//   link: {
//     textDecoration: "none"
//   }
// }));

function MagazineCard({ magazineId, subheader }) {
  // const classes = useStyles();
  const magazine = useSelector(state => selectors.selectMagazine(state, magazineId));
  const { getImageUrl } = useConfiguration();

  return (
    <ModalLink to={`/magazines/${magazineId}`}>

      {/*<RouterLink className={classes.link} to={`/magazine/${magazineId}`}>*/}

        <BaseCard hasActionArea>
          <BaseImage
            src={getImageUrl(magazine.poster_path, { original: true })}
            alt={magazine.title}
            // aspectRatio={getAspectRatioString(2, 3)}
            // aspectRatio={getAspectRatioString(3, 3)}
            aspectRatio={getAspectRatioString(1, 1)}
          />
          {/*<div style={{ position: "absolute", top: 0, left: 0 }}>
            <MagazineRatingTag magazineId={magazineId} />
          </div>*/}
          {/*<BaseCardHeader title={magazine.title} subheader={subheader} />*/}
          <BaseCardHeader  subheader={subheader} />
        </BaseCard>
      {/*</RouterLink>*/}
    </ModalLink>
  );
}

export default MagazineCard;
