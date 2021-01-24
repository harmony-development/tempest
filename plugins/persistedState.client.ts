import { appState } from '~/store/app'
import { entryState } from '~/store/entry'

const serverList = localStorage.getItem('serverList')
const userID = localStorage.getItem('userid')
const session = localStorage.getItem('session')
const host = localStorage.getItem('host')

if (serverList) entryState.state.serverList = JSON.parse(serverList)
if (userID) appState.state.userID = userID
if (session) appState.state.session = session
if (host) appState.state.host = host
