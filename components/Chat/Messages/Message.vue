<template>
  <div
    :class="{
      root: true,
      'pl-3': true,
      'pt-1': !source.shouldCollapse,
      'pb-1': !source.shouldCollapse,
      pending: source.pending,
    }"
  >
    <img
      v-if="!source.shouldCollapse"
      :src="avatar"
      class="avatar"
      @click="showProfile"
    />
    <div v-else class="avatar-space">
      <p v-if="false" class="caption text--secondary text">
        {{ smallTimeString }}
      </p>
    </div>
    <div class="content ml-2">
      <list-item-text v-if="!source.shouldCollapse">
        {{
          source.overrides ? source.overrides.name : username || source.authorID
        }}
        <span
          v-if="source.overrides ? !!source.overrides.systemPlurality : false"
          class="text--tertiary"
        >
          member of {{ username || source.authorID }}
        </span>
        <span class="text--tertiary">
          {{ timeString }}
        </span>
      </list-item-text>
      <p class="text">
        <h-text-field
          v-if="localState.editing"
          ref="editField"
          v-model="localState.editingContent"
          hide-details="auto"
          @keydown.esc="editing = false"
          @keypress="onEditKeyPress"
        ></h-text-field>
        <span v-else class="content-out" v-html="formattedContent"></span>
        <span v-if="edited" class="edited ml-1" :aria-label="editedString">
          (edited)
        </span>
      </p>
      <div
        v-if="source.attachmentsList && source.attachmentsList.length > 0"
        class="attachment-container pt-3"
      >
        <attachment
          v-for="a in source.attachmentsList || []"
          :key="a.id"
          :data="a"
        />
      </div>
    </div>
    <div class="menu-area">
      <!-- <popover>
        <template #activator="{ toggle }">
          <h-icon
            icon="mdiDotsVertical"
            class="cursor-pointer"
            :size="18"
            @click.native="toggle"
          />
        </template>
        <list>
          <list-item> Copy ID </list-item>
        </list>
      </popover> -->
      <!-- <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-btn icon x-small v-bind="attrs" class="menu-btn" v-on="on">
            <v-icon dense> mdi-dots-vertical </v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item
            v-if="source.authorID === $accessor.app.userID"
            link
            @click="editMsg"
          >
            <v-list-item-title>Edit</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="source.authorID === $accessor.app.userID"
            link
            @click="deleteMsg"
          >
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item>
          <v-list-item link @click="copyID">
            <v-list-item-title>Copy ID</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu> -->
    </div>
  </div>
</template>

<style scoped lang="postcss">
.root {
  @apply flex w-full bg-transparent duration-100 transition;
}
.root:hover {
  @apply bg-white bg-opacity-5;
}
.menu-area {
  @apply w-10;
}
.root > .menu-area {
  @apply invisible;
}
.root:hover > .menu-area {
  @apply visible;
}
.avatar {
  @apply w-10 h-10 bg-gray-500 rounded-full cursor-pointer;
}
.avatar-space {
  @apply w-10;
}
.text--tertiary {
  @apply opacity-50 my-4 text-sm;
}
.attachment-container {
  @apply w-full;
}
.content {
  @apply w-full;
}
.text {
  @apply break-words break-all w-full mb-0;
}
.pending {
  @apply opacity-80;
}
.edited {
  color: var(--v-accent-lighten3);
  font-size: 12px;
}
.content-out {
  & >>> .codeblock {
    @apply w-full block break-all whitespace-pre-wrap pr-3 bg-white bg-opacity-5 rounded;

    & > code {
      @apply break-words w-full block p-2 pl-3;
    }
  }

  & >>> a {
    @apply text-primary-300;
  }
}
.content-out >>> .msg-p {
  @apply mb-0 w-auto;
}
.content-out >>> .emoji {
  @apply h-1 align-middle;
}
.content-out >>> .big-emoji {
  @apply h-3;
}
</style>

<script lang="ts">
import Vue from 'vue'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import UTC from 'dayjs/plugin/utc'
import showdown from 'showdown'
import { sanitize } from 'dompurify'
import { appState, IMessageData, IUserData } from '~/store/app'
import { Position, userPopoverState } from '~/store/userPopover'
import { DialogType } from '~/store/dialog'
import ListItemText from '~/components/ListItemText.vue'

dayjs.extend(calendar)
dayjs.extend(UTC)
export default Vue.extend({
  name: 'Message',
  components: { ListItemText },
  props: {
    source: {
      type: Object as () => IMessageData & {
        id: string
        shouldCollapse: boolean
      },
      default: undefined,
    },
    conv: {
      type: Object as () => showdown.Converter,
      default: undefined,
    },
    localState: {
      type: Object as () => {
        editing: boolean
        editingContent: string
      },
      default: undefined,
    },
  },
  computed: {
    authorData(): IUserData | undefined {
      if (!this.source.authorID) return undefined
      return appState.getHost(this.$getHost()).users[this.source.authorID]
    },
    username(): string | undefined {
      if (!this.source.authorID) return undefined
      return this.authorData?.username
    },
    avatar(): string | undefined {
      if (!this.source.authorID) return undefined
      const a = this.source.overrides?.avatar || this.authorData?.avatar
      return a
        ? `${this.$getHost()}/_harmony/media/download/${encodeURIComponent(a)}`
        : undefined
    },
    formattedContent(): string {
      return sanitize(this.$markdownRenderer.makeHtml(this.source.content))
    },
    timeString(): string {
      return dayjs.unix(this.source.createdAt || 0).calendar()
    },
    smallTimeString(): string {
      return dayjs.unix(this.source.createdAt || 0).format('hh:mm')
    },
    edited(): number | undefined {
      return this.source.editedAt
    },
    editedString(): string {
      return ` - ${dayjs.unix(this.source.editedAt || 0).calendar()}`
    },
  },
  mounted() {
    if (this.source.authorID) {
      this.$fetchUser(this.$getHost(), this.source.authorID)
    }
  },
  methods: {
    showProfile(ev: MouseEvent) {
      if (this.source.authorID) {
        userPopoverState.openDialog(
          this.source.authorID,
          ev.currentTarget as Element,
          Position.TOP
        )
      }
    },
    copyID() {
      navigator.clipboard.writeText(this.source.id)
    },
    async deleteMsg() {
      if (
        await this.$confirmDialog(
          'Are you sure you want to delete this message?',
          'Delete'
        )
      ) {
        try {
          await this.$deleteMessage(
            this.$getHost(),
            this.$route.params.guildid,
            this.$route.params.channelid,
            this.source.id
          )
        } catch (e) {
          this.$showDialog(DialogType.Error, e.statusMessage)
        }
      }
    },
    async editMsg() {
      this.localState.editing = true
      this.localState.editingContent = this.source.content
      await this.$nextTick()
      ;(this.$refs.editField as HTMLInputElement).focus()
    },
    async onEditKeyPress(e: KeyboardEvent) {
      if (e.shiftKey) return
      if (e.key === 'Enter') {
        this.localState.editing = false
        return await this.$editMessage(
          this.$getHost(),
          this.$route.params.guildid,
          this.$route.params.channelid,
          this.source.id,
          this.localState.editingContent
        )
      }
    },
  },
})
</script>
