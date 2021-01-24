import { reactive } from '@nuxtjs/composition-api'
import { Store } from './store'

export enum Position {
  LEFT,
  RIGHT,
  TOP,
  BOTTOM,
}

interface IState {
  open: boolean
  id: string
  x: number
  y: number
  position: Position
}

class UserPopoverState extends Store<IState> {
  openDialog(id: string, el: Element, pos: Position) {
    const bbox = el.getBoundingClientRect()
    this.state.open = true
    this.state.id = id
    this.state.position = pos !== undefined ? pos : Position.LEFT
    switch (this.state.position) {
      case Position.LEFT: {
        this.state.x = bbox.left
        this.state.y = bbox.top
        break
      }
      case Position.RIGHT: {
        this.state.x = bbox.width
        this.state.y = bbox.top
        break
      }
      case Position.BOTTOM: {
        this.state.x = bbox.left
        this.state.y = bbox.height
        break
      }
      case Position.TOP: {
        this.state.x = bbox.left
        this.state.y = bbox.top
        break
      }
    }
  }
}

export const userPopoverState = new UserPopoverState({
  open: false,
  id: '',
  x: 0,
  y: 0,
  position: Position.LEFT,
})
