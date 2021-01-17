export default {
  'app-name': 'Tempest',
  'server-select': {
    title: 'Select A Server To Login To',
    'title-join': 'Select a server to join {guild} with',
    'add-btn': 'Add Server',
    'add-dialog': {
      title: 'Add Server',
      name: 'Server Name',
      host: 'Server Host/IP',
    },
  },
  auth: {
    'initial-choice': 'Welcome. Select an option:',
    login: 'Login',
    register: 'Register',
    'other-options': 'Other Options',
    email: 'Email',
    username: 'Username',
    password: 'Password',
    'confirm-password': 'Confirm Password',
  },
  app: {
    'message-input': 'Write your message...',
    'guild-menu-tooltip': 'Join/Create Guild',
    'add-channel': 'Add Channel',
    'guild-settings': 'Guild Settings',
    'log-out': 'Logout',
    settings: 'Settings',
    personas: {
      title: 'Subaccounts',
      add: 'New Subaccount',
    },
    statuses: {
      online: 'Online',
      dnd: 'Do Not Disturb',
      idle: 'Idle',
      offline: 'Offline',
    },
    typing:
      'Uhh... nobody is typing? | {0} is typing... | {0} and {1} are typing... | {0}, {1} and {2} are typing... | Lots of people are typing...',
  },
  perms: {
    channels: {
      manage: {
        'change-information': {
          title: 'Change Channel Information',
          description: 'Users can change channel information',
        },
        create: {
          title: 'Create Channel',
          description: 'Users can create new channels',
        },
        delete: {
          title: 'Delete Channel',
          description: 'Users can delete channels',
        },
        move: {
          title: 'Move Channel',
          description: 'Users can move channels',
        },
      },
    },
    guild: {
      manage: {
        'change-information': {
          title: 'Change Guild Information',
          description: 'Users can change guild information',
        },
        delete: {
          title: 'Delete Guild',
          description: 'Users can... delete the guild?',
        },
      },
    },
    messages: {
      send: {
        title: 'Send Messages',
        description: 'Users can send messages here',
      },
      view: {
        title: 'View Messages',
        description: 'Users can see messages here',
      },
    },
    roles: {
      user: {
        get: {
          title: 'Get User Roles',
          description: "Users can see other users' roles",
        },
        manage: {
          title: 'Manage User Roles',
          description: 'Users can assign roles to users',
        },
      },
      get: {
        title: 'Get Roles',
        description: 'Users can list roles',
      },
      manage: {
        title: 'Manage Roles',
        description: 'Users can configure roles',
      },
    },
    invites: {
      view: {
        title: 'View Invites',
        description: 'Users can view invites',
      },
      manage: {
        create: {
          title: 'Create Invites',
          description: 'Users can create invites',
        },
        delete: {
          title: 'Delete Invites',
          description: 'Users can delete invites',
        },
      },
    },
    permissions: {
      manage: {
        get: {
          title: 'Get Permissions',
          description: 'Users can set role permissions',
        },
        set: {
          title: 'Set Permissions',
          description: 'Users can set role permissions',
        },
      },
      query: {
        title: 'Query Permissions',
        description: 'Users can query role permissions',
      },
    },
    actions: {
      trigger: {
        title: 'Trigger Actions',
        description: 'Users can trigger embed actions (buttons, etc)',
      },
    },
  },
  cancel: 'Cancel',
  done: 'Done',
  next: 'Next',
  back: 'Back',
}
