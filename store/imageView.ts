import { reactive } from '@nuxtjs/composition-api'
import { Store } from './store'

interface IState {
  open: boolean
  imageID?: string
}
class ImageViewState extends Store<IState> {
  openImageView(imageID: string) {
    this.state.open = true
    this.state.imageID = imageID
  }

  closeImageView() {
    this.state.open = false
  }
}

export const imageViewState = new ImageViewState({
  open: false,
  imageID: undefined,
})
