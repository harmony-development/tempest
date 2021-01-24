import { reactive } from '@nuxtjs/composition-api'

const s = reactive({
  open: false,
  host: undefined as string | undefined,
  guildID: undefined as string | undefined,
  x: 0,
  y: 0,
})

export const openDialog = (
  guildID: string,
  host: string,
  x: number,
  y: number
) => {
  s.open = true
  s.guildID = guildID
  s.host = host
  s.x = x
  s.y = y
}

export const closeDialog = (value: boolean) => {
  s.open = value
}
