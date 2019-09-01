import { 
    AUTH_AUTHORIZATION_ENDPOINT, 
    AUTH_TOKEN_ENDPOINT,
    AUTH_REVOCATION_ENDPOINT,
    AUTH_CLIENT_ID,
    AUTH_REDIRECT_URL,
    AUTH_RESOURCE
    // @ts-ignore
 } from 'react-native-dotenv';

export let Config = {
    serviceConfiguration: {
      authorizationEndpoint: AUTH_AUTHORIZATION_ENDPOINT,
      tokenEndpoint: AUTH_TOKEN_ENDPOINT,
      revocationEndpoint: AUTH_REVOCATION_ENDPOINT
    },
    clientId: AUTH_CLIENT_ID,
    redirectUrl: AUTH_REDIRECT_URL,
    additionalParameters: {
      resource: AUTH_RESOURCE
    },
    response_type: 'token'
};