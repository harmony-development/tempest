import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  createPersistedState({
    key: 'serverList',
    paths: ['entry.serverList'],
  })(store)
}
