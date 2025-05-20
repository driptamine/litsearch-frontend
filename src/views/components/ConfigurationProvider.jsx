import React, { useState, useEffect, useMemo, useCallback, useContext } from "react";
import axios from "axios";

import LoadingIndicator from "./LoadingIndicator";
import placeholderPng from "views/assets/placeholder.png";
import { createUrl, createAPIUrl, createAPIUrlFromSpotify } from "core/utils";

const ConfigurationContext = React.createContext();

export function useConfiguration() {
  const value = useContext(ConfigurationContext);
  return value;
}

function ConfigurationProvider({ children }) {
  const [configuration, setConfiguration] = useState(null);
  const [configurationz, setConfigurationz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchConfiguration() {
      try {
        const { data } = await axios.get(createUrl("/configuration"));
        setLoading(false);
        setConfiguration(data);
      } catch (error) {
        setLoading(false);
        setError(error);
      }
    }

    async function fetchConfigurationz() {
      try {
        const { data } = await axios.get(createAPIUrlFromSpotify("/image"));
        setLoading(false);
        setConfigurationz(data);
      } catch (error) {
        setLoading(false);
        setError(error);
      }
    }

    fetchConfiguration();
    // fetchConfigurationz();
  }, []);

  const getImageUrl = useCallback(
    (path, { original } = {}) => {
      if (!path || !configuration) {
        return placeholderPng;
      }

      const { images } = configuration;
      const { secure_base_url } = images;

      return `${secure_base_url}/${original ? "original" : "w500"}${path}`;
      // return `${secure_base_url}/${original ? "original" : "original"}${path}`;
    },
    [configuration]
  );

  const getImageUrlz = useCallback(
    (path, { original } = {}) => {
      if (!path || !configurationz) {
        return placeholderPng;
      }

      const { images } = configurationz;
      const { secure_base_url } = images;

      return `${path}`;
    },
    [configurationz]
  );

  const value = useMemo(
    () => ({ configuration, loading, error, getImageUrl, getImageUrlz }),
    [configuration, configurationz, loading, error, getImageUrl, getImageUrlz]
  );

  if (error) {
    return null;
  }

  return (
    <LoadingIndicator loading={loading}>
      <ConfigurationContext.Provider value={value}>
        {children}
      </ConfigurationContext.Provider>
    </LoadingIndicator>
  );
}

export default ConfigurationProvider;
