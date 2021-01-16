import createReactClass from 'create-react-class'
import { createElement } from 'react'

global.window.createClass = createReactClass;
global.window.h = createElement;
