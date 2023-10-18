import axios from "axios";

const URL=process.env.NODE_ENV==='production' ? process.env.REACT_APP_SERVER_URL:process.env.REACT_APP_LOCAL_SERVER_URL;
console.log(URL)
const instance = axios.create({
  baseURL:URL,

});

instance.interceptors.request.use((config) => {
  config.headers['Access-Control-Allow-Origin'] = 'https://hinged.vercel.app';
  return config;
});

export default instance;