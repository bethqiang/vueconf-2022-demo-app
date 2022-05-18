import axios from 'axios';

const _api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

const getHeaders = function () {
  return {
    'x-api-key': import.meta.env.VITE_API_KEY
  };
};

export default {
  get: function (url, params = {}) {
    const headers = getHeaders();
    return _api.get(url, { params, headers })
      .then((response) => {
        return {
          data: response.data,
          count: response.headers['pagination-count']
        };
      });
  }
};
