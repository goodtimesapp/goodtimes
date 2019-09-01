export interface Auth {
    accessToken: string;
    accessTokenExpirationDate?: string;
    additionalParameters?: any;
    authorizeAdditionalParameters?: any
    idToken?: string;
    refreshToken?: string;
    scopes?: any;
    tokenAdditionalParameters?: any;
    tokenType?: string
}