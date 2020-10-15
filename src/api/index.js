import axios from "axios";
import { _retrieveData, _storeData, _removeData } from "../utils/asynStorage";
import { TOKEN } from "../utils/asynStorage/store";
import { getUserAgent } from "react-native-device-info";

const BASE_URL_API = "";
const api = axios.create({
  baseURL: BASE_URL_API,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
api.defaults.withCredentials = true;
api.interceptors.request.use(
  async function (config) {
    let accessToken = await _retrieveData(TOKEN).then((token) => token);
    console.log(accessToken, "1111");
    userAgent = await getUserAgent()
      .then((ua) => ua)
      .catch((err) => {
        console.log("User agent", err);
        return {
          iOS:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143",
        };
      });
    //  Do something before request is sent
    config.headers.common["User-Agent"] = userAgent;
    if (accessToken) {
      config.headers.common["Authorization"] =
        "bearer " + accessToken.substr(1).slice(0, -1);
    }
    return config;
  },
  function (error) {
    // Do something with request error
    123123;
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("====================================");
    console.log("ereewds", error);
    console.log("====================================");
    if (error.response && error.response.status === 401) {
      //Promise.all([_removeData(TOKEN)]);
    }
    return Promise.reject(error.response);
  }
);

export default api;
