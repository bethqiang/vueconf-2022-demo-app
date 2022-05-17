import api from './api';

const IMAGES_ROOT = 'images';

export default {
  findAll: async function (payload) {
    const response = await api.get(`${IMAGES_ROOT}/search`, payload);
    return response;
  }
};
