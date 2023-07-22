import axios from "axios";

export default {

  create: async (payload) => {

    const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://localhost:5000'

    try {
      const res = await axios.post(`${url}/create`, payload)
      const { data } = res;
      console.log(`Data: ${data} `);
    }
    catch (err) {
      console.error(err);
      throw err;
    }
  },
  login: async (payload) => {

    const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://localhost:5000'

    try {
      const res = await axios.post(`${url}/login`, payload)
      const { data } = res;
      return data;
      console.log(`Data: ${data} `);
    }
    catch (err) {
      console.error(err);
      throw err;
    }
  },
  logout: async () => {
    const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://localhost:5000'

    try {
      const res = await axios.get(`${url}/logout`)
      const { data } = res;
      return data;
    }
    catch (err) {
      console.error(err);
      throw err;
    }


  }
}
