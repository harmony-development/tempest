<template>
  <editor-content :editor="editor" class="editor" />
</template>

<style lang="postcss" scoped>
.editor >>> .ProseMirror {
  @apply border-2 border-transparent px-2 py-3 bg-harmonydark-400 bg-opacity-5 outline-none rounded-t shadow-md break-words;

  & > * {
    caret-color: currentColor;
  }

  & > h1 {
    @apply text-3xl;
  }

  & > h2 {
    @apply text-2xl;
  }

  & > h3 {
    @apply text-xl;
  }

  & > pre {
    @apply px-1 py-2 rounded font-bold bg-white bg-opacity-10 text-white text-opacity-80;
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Editor, EditorContent, Extension } from 'tiptap'
import {
  Blockquote,
  Heading,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  CodeBlock,
} from 'tiptap-extensions'
import TurndownService from 'turndown'

const turndownService = new TurndownService({
  headingStyle: 'atx',
})

export default Vue.extend({
  components: {
    EditorContent,
  },
  data() {
    return {
      editor: null as Editor | null,
    }
  },
  mounted() {
    const vm = this
    this.editor = new Editor({
      content: ``,
      extensions: [
        new Blockquote(),
        new CodeBlock(),
        new Heading({ levels: [1, 2, 3] }),
        new BulletList(),
        new OrderedList(),
        new ListItem(),
        new TodoItem(),
        new TodoList(),
        new Bold(),
        new Code(),
        new Italic(),
        new Link(),
        new Strike(),
        new Underline(),
        new History(),
        new (class extends Extension {
          keys() {
            return {
              Enter() {
                vm.sendMessage()
                return true
              },
            }
          }
        })(),
      ],
    })
  },
  beforeDestroy() {
    this.editor?.destroy()
  },
  methods: {
    sendMessage() {
      const md = turndownService.turndown(this.editor!.getHTML())
      console.log(md)
    },
  },
})
</script>
