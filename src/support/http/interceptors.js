import axios from "axios";

axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';

/*Enviar logs de error a backoffice*/
axios.interceptors.response.use(
  response => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, error => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });



