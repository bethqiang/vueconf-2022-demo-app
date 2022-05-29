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
  },
  post: function (url, params) {
    const headers = getHeaders();

    // We don't want to send a destructured version of FormData
    let data = { ...params };
    if (params instanceof FormData) {
      data = params;
    }

    return _api.post(url, data, { headers });
  },
  delete: function (url) {
    const headers = getHeaders('DEL', url);
    return _api.delete(url, { headers });
  },
};
