import { defineStore } from 'pinia';

export default defineStore({
  id: 'votes',
  state: () => ({
    _votes: []
  }),
  getters: {
    votes: (state) => state._votes
  },
  actions: {
    set (votes) {
      this._votes = votes;
    }
  }
});
