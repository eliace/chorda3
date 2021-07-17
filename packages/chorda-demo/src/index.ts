import { Html } from '@chorda/core'
import { createAppOptions, createAppScope, render } from './utils'

import './index.scss'
import 'chorda-bulma/styles/index.scss'

const app = new Html(createAppOptions(), createAppScope())


render(app, () => document.getElementById('root'))
