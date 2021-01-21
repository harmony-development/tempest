<template>
  <editor-content :editor="editor" class="editor" />
</template>

<style lang="postcss" scoped>
.editor {
  @apply border-2 border-transparent px-2 py-3 bg-harmonydark-400 bg-opacity-5 outline-none rounded-t shadow-md;
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Editor, EditorContent } from 'tiptap'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
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
} from 'tiptap-extensions'

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
    this.editor = new Editor({
      content: `<h1>Yay Headlines!</h1>
          <p>All these <strong>cool tags</strong> are working now.</p>`,
      extensions: [
        new Blockquote(),
        new CodeBlock(),
        new HardBreak(),
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
      ],
    })
  },
  beforeDestroy() {
    this.editor?.destroy()
  },
})
</script>
