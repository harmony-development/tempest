import { mutationTree } from 'typed-vuex'

export interface IServerEntry {
  name: string
  host: string
}

interface IInviteData {
  host: string
  id: string
  guildName: string
}

export const state = () => ({
  serverList: [
    {
      name: 'harmonyapp.io',
      host: 'chat.harmonyapp.io:2289',
    },
  ] as IServerEntry[],
  selectedServer: undefined as string | undefined,
  step: 1,
  pendingInvite: undefined as IInviteData | undefined,
})

export const mutations = mutationTree(state, {
  setSelectedServer(state, data: string | undefined) {
    state.selectedServer = data
  },
  setPendingInvite(state, data: IInviteData | undefined) {
    state.pendingInvite = data
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
  setStep(state, step: number) {
    state.step = step
  },
})
