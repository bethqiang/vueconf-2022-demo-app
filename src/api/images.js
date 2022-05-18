import api from './api';

const IMAGES_ROOT = 'images';

export default {
  findAll: async function (payload) {
    return await api.get(`${IMAGES_ROOT}/search`, payload);
  },
  findById: async function (id) {
    return await api.get(`${IMAGES_ROOT}/${id}`);
  }
};
