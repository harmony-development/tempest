import { Node } from 'tiptap'
import { chainCommands, exitCode } from 'tiptap-commands'

export class ShiftEnterParagraph extends Node {
  get name() {
    return 'shiftenterparagraph'
  }

  get schema() {
    return {
      content: 'inline*',
      group: 'block',
      defining: true,
      draggable: false,
      parseDOM: [
        {
          tag: `p`,
        },
      ],
      toDOM: () => [`p`],
    }
  }

  keys({ type }) {
    const command = chainCommands(exitCode, (state, dispatch) => {
      dispatch(state.tr.replaceSelectionWith(type.create()).scrollIntoView())
      return true
    })
    return {
      'Mod-Enter': command,
      'Shift-Enter': command,
    }
  }
}
