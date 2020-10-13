import { mutationTree } from 'nuxt-typed-vuex'

interface IServerEntry {
  name: string
  host: string
}

export const state = () => ({
  serverList: [
    {
      name: 'Localhost',
      host: '127.0.0.1:2290',
    },
  ] as IServerEntry[],
  selectedServer: undefined as string | undefined,
})

export const mutations = mutationTree(state, {
  setSelectedServer(state, data: string | undefined) {
    state.selectedServer = data
  },
  addServerToList(state, data: { name: string; host: string }) {
    state.serverList.push({
      name: data.name,
      host: data.host,
    })
  },
  removeServerFromList(state, idx: number) {
    state.serverList.splice(idx, 1)
  },
})
