// script.js
import { Novel } from './Novel/Novel.js'
import { Experience } from './Experience/Experience.js'

const vnData = '/Novel.json'
const novel = new Novel("#textbox", '#optionsbox', "#namebox span", vnData)
const experience = new Experience(document.querySelector('canvas.webgl'))

novel.initialize()