import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  createPersistedState({
    key: 'staccato',
    paths: ['entry.serverList', 'app.userID', 'app.session', 'app.host'],
  })(store)
}
