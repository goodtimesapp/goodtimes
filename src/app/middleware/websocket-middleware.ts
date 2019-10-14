import axios, {AxiosInstance} from "axios";
import { API, accessDenied, apiError, apiStart, apiEnd } from './../reduxStore/common/api';
import * as moment from 'moment';
import { store } from './../reduxStore/configureStore';

// redux customa API middleware 
// https://blog.logrocket.com/data-fetching-in-redux-apps-a-100-correct-approach-4d26e21750fc/
// https://github.com/ohansemmanuel/fake-medium/blob/master/src/middleware/api.js
const websocketMiddleware = ({ dispatch }: any) => (next: any) => async (action: any) => {
  next(action);
  if (action.type !== API) return;
 
  const {
    url,
    method,
    data,
    accessToken,
    onSuccess,
    onFailure,
    label,
    headers
  } = action.payload;
  
  if (label) {
    dispatch(apiStart(label));
  }

  // @ts-ignore
  const ws = new WebSocket(`wss://${GOODTIMES_RADIKS_SERVER}/radiks/stream`);

  console.log('setting up websocket....');

  ws.onopen = () => {
    // connection opened
    // ws.send('something'); // send a message
  };

  ws.onmessage = (e: any) => {
    // a message was received
    console.log('[WEBSOCKET ONMESSAGE] ', e.data);
    try {
      let data = JSON.parse(e.data);
      let modelType = data.radiksType;
      switch (modelType) {
        case "Message":
          if (!data.content) return;
          let msg = data.content;
          dispatch(onSuccess(data));
          
        case "Post":
          dispatch(onSuccess(data));
        default:
          return;
      }

    } catch (e) { 
      dispatch(apiError(e));
      dispatch(onFailure(e));
    }

  };

  ws.onerror = (e: any) => {
    // an error occurred
    console.log(e.message);
    dispatch(apiError(e));
    dispatch(onFailure(e));
    // dispatch(accessDenied(e.response.toString()));
  };

  ws.onclose = (e: any) => {
    // connection closed
    console.log(e.code, e.reason);
    dispatch(apiEnd(label));
  };

 
};

export default websocketMiddleware;