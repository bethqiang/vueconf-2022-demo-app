import { defineStore } from 'pinia';

export default defineStore({
  id: 'favorites',
  state: () => ({
    _favorites: []
  }),
  getters: {
    favorites: (state) => state._favorites
  },
  actions: {
    set (favorites) {
      this._favorites = favorites;
    }
  }
});
