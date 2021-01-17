import createPersistedState from 'vuex-persistedstate'

export default ({ store }: { store: any }) => {
  createPersistedState({
    key: 'tempest',
    paths: [
      'entry.serverList',
      'app.userID',
      'app.session',
      'app.host',
      'app.personas',
    ],
  })(store)
}
