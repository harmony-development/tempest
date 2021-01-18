import Vue from 'vue'

import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faChevronRight,
  faGlobe,
  faSpinner,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'

config.autoAddCss = false

library.add(faSpinner)
library.add(faTrash)
library.add(faChevronRight)
library.add(faGlobe)

Vue.component('fa-icon', FontAwesomeIcon)
