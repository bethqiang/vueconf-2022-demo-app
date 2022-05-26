import api from './api';

const VOTES_ROOT = 'votes';

export default {
  findAll: async function () {
    return await api.get(VOTES_ROOT);
  },
  vote: async function (payload) {
    return await api.get(VOTES_ROOT, payload);
  }
};
