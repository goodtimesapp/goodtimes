export const API = "API";
export const API_START = "API_START";
export const API_END = "API_END";
export const ACCESS_DENIED = "ACCESS_DENIED";
export const API_ERROR = "API_ERROR";

export const apiStart = (label: any) => ({
  type: API_START,
  payload: label
});

export const apiEnd = (label:any) => ({
  type: API_END,
  payload: label
});

export const accessDenied = (url:any) => ({
  type: ACCESS_DENIED,
  payload: {
    url
  }
});

export const apiError = (error: any) => ({
  type: API_ERROR,
  error
});

export function apiAction({
  url = "",
  method = "GET",
  data = null || "",
  accessToken = null || undefined || '',
  onSuccess = (payload: any, action: any) => {},
  onFailure = (error: any) => {},
  label = "",
  headersOverride = null
}) {
  return {
    type: API,
    payload: {
      url,
      method,
      data,
      accessToken,
      onSuccess,
      onFailure,
      label,
      headersOverride
    }
  };
}