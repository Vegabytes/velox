import axios from "axios";

export default {

  create: async (payload) => {

    const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

    try {
      const res = await axios.post(`${url}/create`, payload)
      const { data } = res;
    }
    catch (err) {
      throw err;
    }
  },
  login: async (payload) => {

    const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

    try {
      const res = await axios.post(`${url}/auth/login`, payload)
      const { data } = res;
      return data;

    }
    catch (err) {
      throw err;
    }
  },
  logout: async () => {
    const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

    try {
      const res = await axios.get(`${url}/logout`)
      const { data } = res;
      return data;
    }
    catch (err) {
      throw err;
    }


  }
}
