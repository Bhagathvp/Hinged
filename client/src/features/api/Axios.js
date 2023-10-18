import axios from "axios";

const URL= process.env.REACT_APP_SERVER_URL;
console.log(URL)

const instance = axios.create({
  baseURL:"https//:hinged.live",
  headers: {
    'Content-Type': 'application/json',
  }
});

export default instance;