import VWave from 'v-wave'
import { UserModule } from '~/types'

export const install: UserModule = ({ app }) => {
  app.use(VWave)
}
