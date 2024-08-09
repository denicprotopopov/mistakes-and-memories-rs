// script.js
import { Novel } from './Novel/Novel.js'

const vnData = '/Novel.json'
const novel = new Novel("#textbox", '#optionsbox', "#namebox span", vnData)

novel.initialize()