import api from './api';

const FAVORITES_ROOT = 'favourites';

export default {
  findAll: async function () {
    return await api.get(FAVORITES_ROOT);
  },
  favorite: async function (payload) {
    return await api.post(FAVORITES_ROOT, payload);
  }
};
