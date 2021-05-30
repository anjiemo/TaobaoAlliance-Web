export const state = () => ({
  setCurrentActive: ''
});

export const mutations = {
  setCurrentActive(state, value) {
    state.setCurrentActive = value;
  }
};
