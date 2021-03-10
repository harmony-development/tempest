import VWave from 'v-wave'
import { UserModule } from '~/types'

export const install: UserModule = async({ app }) => {
  app.use(VWave)
}
