import { Store } from './store'

export interface IServerEntry {
  name: string
  host: string
}

interface IInviteData {
  host: string
  id: string
  guildName: string
}

interface IState {
  serverList: IServerEntry[]
  selectedServer: string | undefined
  pendingInvite: IInviteData | undefined
  step: number
}

class EntryState extends Store<IState> {
  setSelectedServer(data: string | undefined) {
    this.state.selectedServer = data
  }

  setPendingInvite(data: IInviteData | undefined) {
    this.state.pendingInvite = data
  }

  addServerToList(data: { name: string; host: string }) {
    this.state.serverList.push({
      name: data.name,
      host: data.host,
    })
  }

  removeServerFromList(idx: number) {
    this.state.serverList.splice(idx, 1)
  }

  setStep(step: number) {
    this.state.step = step
  }
}

export const entryState = new EntryState({
  serverList: [
    {
      name: 'harmonyapp.io',
      host: 'chat.harmonyapp.io:2289',
    },
  ] as IServerEntry[],
  selectedServer: undefined as string | undefined,
  pendingInvite: undefined as IInviteData | undefined,
  step: 1,
})
