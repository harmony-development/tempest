<template>
  <div>
    <span>{{ formattedContent }}</span>
    <!-- <v-avatar
      v-if="!source.shouldCollapse"
      v-ripple
      class="avatar avatar-space"
      @click="showProfile"
    >
      <img :src="avatar" />
    </v-avatar>
    <div v-else class="avatar-space">
      <p v-if="false" class="caption text--secondary text">
        {{ smallTimeString }}
      </p>
    </div> -->
    <!-- <div class="ml-2">
      <v-list-item-title v-if="!source.shouldCollapse">
        {{
          source.overrides ? source.overrides.name : username || source.authorID
        }}
        <span
          v-if="source.overrides ? !!source.overrides.systemPlurality : false"
          class="text--tertiary"
        >
          member of {{ username || source.authorID }}
        </span>
        <span
          v-if="source.overrides ? source.overrides.bridge : undefined"
          class="text--tertiary"
        >
          bridged by {{ username || source.authorID }}
        </span>
      </v-list-item-title>
      <p class="text">
        <v-textarea
          v-if="editing"
          ref="editField"
          v-model="editedContent"
          outlined
          auto-grow
          dense
          :rows="1"
          hide-details="auto"
          @keydown.esc="editing = false"
          @keypress="onEditKeyPress"
        ></v-textarea>
        <span class="content-out">{{ formattedContent }}</span>
        <v-tooltip v-if="edited" top>
          <template #activator="{ on, attrs }">
            <span class="edited ml-1" v-bind="attrs" v-on="on">(edited)</span>
          </template>
          <span>{{ editedString }}</span>
        </v-tooltip>
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
    </div> -->
    <!-- <div class="menu-area">
      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-btn icon x-small v-bind="attrs" class="menu-btn" v-on="on">
            <v-icon dense> mdi-dots-vertical </v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item v-if="source.authorID === $accessor.app.userID" link>
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
      </v-menu>
    </div> -->
  </div>
</template>

<style scoped>
/* .root {
  width: 100%;
  display: flex;
  background-color: rgba(0, 0, 0, 0);
} */

/* .root:hover {
  background-color: rgba(0, 0, 0, 0.1);
} */

/* .root > .menu-area {
  visibility: hidden;
} */

/* .root:hover > .menu-area {
  visibility: visible;
} */

/* .avatar {
  width: 48px;
  height: 48px;
  flex: 0 0 auto;
  background-color: grey;
  border-radius: 100%;
  cursor: pointer;
}

.avatar-space {
  width: 48px;
  min-width: 48px;
}

.text--tertiary {
  opacity: 0.5;
  margin: 0px 4px;
  font-size: 80%;
}

.menu-area {
  width: 48px;
  min-width: 48px;
}

.attachment-container {
  width: 100%;
}

.content {
  width: 100%;
}

.text {
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-all;
  width: 100%;
  margin-bottom: 0px;
}

.pending {
  opacity: 0.8;
}

.edited {
  color: var(--v-accent-lighten3);
  font-size: 12px;
}

.content-out >>> .codeblock {
  width: 100%;
  display: block;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-all;
  white-space: pre-wrap;
  padding-right: 12px;
}

.content-out >>> .codeblock > code {
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-all;
  width: 100%;
  display: block;
  padding: 8px;
  padding-left: 12px;
}

.content-out >>> .msg-p {
  margin-bottom: 0px;
  width: auto;
}

.content-out >>> .emoji {
  height: 1em;
  vertical-align: middle;
}

.content-out >>> .big-emoji {
  height: 3em;
} */
</style>

<script lang="ts">
import Vue from 'vue'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import UTC from 'dayjs/plugin/utc'
import showdown from 'showdown'
// import DOMPurify from 'dompurify'
import { IMessageData, IUserData } from '~/store/app'
import { AnimationDirection, Position } from '~/store/userPopover'
import { DialogType } from '~/store/dialog'

dayjs.extend(calendar)
dayjs.extend(UTC)

export default Vue.extend({
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
  },
  data() {
    return {
      editing: false,
      editedContent: '',
    }
  },
  computed: {
    authorData(): IUserData | undefined {
      if (!this.source.authorID) return undefined
      return this.$accessor.app.data[this.$getHost()]?.users[
        this.source.authorID
      ]
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
      return this.source.content
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
        this.$accessor.userPopover.openDialog({
          id: this.source.authorID,
          element: ev.currentTarget as Element,
          position: Position.TOP,
          animationDirection: AnimationDirection.yReverse,
        })
      }
    },
    copyID() {
      navigator.clipboard.writeText(this.source.id)
    },
    async deleteMsg() {
      if (
        await this.$confirmDialog(
          'Are you sure you want to delete this message?',
          'Delete',
        )
      ) {
        try {
          await this.$deleteMessage(
            this.$getHost(),
            this.$route.params.guildid,
            this.$route.params.channelid,
            this.source.id,
          )
        } catch (e) {
          this.$showDialog(DialogType.Error, e.statusMessage)
        }
      }
    },
    async editMsg() {
      this.editing = true
      this.editedContent = this.source.content
      await this.$nextTick()
      ;(this.$refs.editField as HTMLInputElement).focus()
    },
    async onEditKeyPress(e: KeyboardEvent) {
      if (e.shiftKey) return
      if (e.key === 'Enter') {
        this.editing = false
        return await this.$editMessage(
          this.$getHost(),
          this.$route.params.guildid,
          this.$route.params.channelid,
          this.source.id,
          this.editedContent,
        )
      }
    },
  },
})
</script>
