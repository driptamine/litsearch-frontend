/* feature.js
 *  component where the main app will live. Authenticated users can save
 * and view data on a personal watchlist of coins here.
 */

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import WatchList from "./charter/watchlist/WatchList";
import PriceChart from "./charter/PriceChart";
import CoinInfo from "./charter/CoinInfo";
import TimeFrameList from "./charter/TimeFrameList";
import CoinNameInfo from "./charter/CoinNameInfo";

import { setActiveCoin, setTimeFrame } from "../_store/reducers/histDataSlice";

export default function Feature() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveCoin({}));
    dispatch(setTimeFrame("1day"));
  });

  return (
    <div>
      <CoinNameInfo />
      <TimeFrameList />
      <PriceChart />
      <CoinInfo />
      <WatchList />
    </div>
  );
}
