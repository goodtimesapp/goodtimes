
import RNBlockstackSdk from 'react-native-blockstack';

interface Config {
  apiServer: string,
  userSession: RNBlockstackSdk.UserSession,
}

let config: Config = {
  apiServer: '',
  userSession: null,
};

export const configure = (newConfig: Config) => {
  config = {
    ...config,
    ...newConfig,
  };
};

/**
 * some info
 */
export const getConfig = (): Config => config;
