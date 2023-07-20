import axios from "axios";

export default {

  create: async (payload) => {

    const url = import.meta.env['VITE_SERVER_BASE_URL']

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
}
