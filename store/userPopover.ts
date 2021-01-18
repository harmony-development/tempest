import { mutationTree } from 'typed-vuex'

export enum AnimationDirection {
  x = 'scroll-x-transition',
  xReverse = 'scroll-x-reverse-transition',
  y = 'scroll-y-transition',
  yReverse = 'scroll-y-reverse-transition',
}

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
  animationDirection: AnimationDirection
  position: Position
}

export const state = (): IState => ({
  open: false,
  id: '',
  x: 0,
  y: 0,
  animationDirection: AnimationDirection.xReverse,
  position: Position.LEFT,
})

export const mutations = mutationTree(state, {
  openDialog(
    state,
    data: {
      id: string
      element: Element
      position?: Position
      animationDirection?: AnimationDirection
    }
  ) {
    const boundingBox = data.element.getBoundingClientRect()
    state.open = true
    state.id = data.id
    state.animationDirection =
      data.animationDirection !== undefined
        ? data.animationDirection
        : AnimationDirection.xReverse
    state.position = data.position !== undefined ? data.position : Position.LEFT
    switch (state.position) {
      case Position.LEFT: {
        state.x = boundingBox.left
        state.y = boundingBox.top
        break
      }
      case Position.RIGHT: {
        state.x = boundingBox.width
        state.y = boundingBox.top
        break
      }
      case Position.BOTTOM: {
        state.x = boundingBox.left
        state.y = boundingBox.height
        break
      }
      case Position.TOP: {
        state.x = boundingBox.left
        state.y = boundingBox.top
        break
      }
    }
  },
  closeDialog(state) {
    state.open = false
  },
})
