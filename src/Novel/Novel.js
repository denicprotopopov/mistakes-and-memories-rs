export class Novel {
    constructor(textboxSelector, optionsboxSelector, nameboxSelector, dataUrl) {
        this.$textbox = document.querySelector(textboxSelector)
        this.$textboxContent = this.$textbox.querySelector('p') 
        this.$optionsbox = document.querySelector(optionsboxSelector)
        this.$namebox = document.querySelector(nameboxSelector)
        this.dataUrl = dataUrl
        this.json = null
        this.to = null
        this.pageNum = 0
        this.currentPage = null
        this.isTyping = false
        this.fullText = ''
        this.hasOptions = false
    }

    async initialize() {
        await this.grabData()
        this.attachEventListeners()
        this.updatePage()
    }

    async grabData() {
        const resp = await fetch(this.dataUrl)
        this.json = await resp.json()
        this.currentPage = Object.keys(this.json.Scene1.PAGES)[this.pageNum]
    }

    updatePage() {
        this.clearContent()
        this.updateName()
        this.fullText = this.json.Scene1.PAGES[this.currentPage].PageText
        this.typeWriter(this.fullText)
        this.handleOptions()
    }

    clearContent() {
        this.$namebox.innerText = ''
        this.$textboxContent.innerText = ''
    }

    updateName() {
        this.$namebox.innerText = this.json.Scene1.PAGES[this.currentPage].Character
    }

    typeWriter(txt, i = 0) {
        this.isTyping = true
        if (i === 0) {
            this.$textboxContent.innerHTML = ''
            clearTimeout(this.to)
        }
        const speed = 30;
        if (i < txt.length) {
            const c = txt.charAt(i) === ' ' ? '&nbsp;' : txt.charAt(i)
            this.$textboxContent.innerHTML += c
            this.to = setTimeout(() => this.typeWriter(txt, i + 1), speed)
        } else {
            this.isTyping = false
        }
    }

    skipTypewriter() {
        clearTimeout(this.to)
        this.$textboxContent.innerHTML = this.fullText
        this.isTyping = false
    }

    handleOptions() {
        this.$optionsbox.innerHTML = ""
        const options = this.json.Scene1.PAGES[this.currentPage].Options
        this.hasOptions = !!options
        if (options) {
            Object.keys(options).forEach(k => {
                const row = document.createElement('div')
                row.innerHTML = k;
                row.addEventListener('click', (e) => {
                    e.stopPropagation() // Prevent event from bubbling up to textbox
                    this.selectOption(options[k]);
                });
                row.addEventListener('touchend', (e) => {
                    e.preventDefault() // Prevent default touch behavior
                    e.stopPropagation() // Prevent event from bubbling up to textbox
                    this.selectOption(options[k])
                });
                this.$optionsbox.appendChild(row)
            });
        }
    }

    selectOption(nextPage) {
        this.currentPage = nextPage
        this.pageNum = Object.keys(this.json.Scene1.PAGES).indexOf(this.currentPage)
        this.updatePage()
    }

    checkPage() {
        const currentPageData = this.json.Scene1.PAGES[this.currentPage]
        if (currentPageData.Options) return false
        if (currentPageData.NextPage === "End") return false
        return true
    }

    nextPage() {
        if (!this.checkPage()) return
        
        const currentPageData = this.json.Scene1.PAGES[this.currentPage]
        if (currentPageData.NextPage) {
            this.currentPage = currentPageData.NextPage
        } else {
            this.pageNum++
            this.currentPage = Object.keys(this.json.Scene1.PAGES)[this.pageNum]
        }

        this.updatePage()
    }

    handleInteraction() {
        if (this.isTyping) {
            this.skipTypewriter()
        } else if (!this.hasOptions) {
            this.nextPage()
        }
    }

    attachEventListeners() {
        // Keyboard event
        document.addEventListener('keydown', (e) => {
            if (e.code === "Enter") {
                this.handleInteraction()
            }
        });

        // Touch event for textbox
        this.$textbox.addEventListener('touchend', (e) => {
            e.preventDefault() // Prevent default touch behavior
            if (!this.hasOptions) {
                this.handleInteraction()
            }
        });

        // Mouse click event for textbox (for desktop compatibility)
        this.$textbox.addEventListener('click', () => {
            if (!this.hasOptions) {
                this.handleInteraction()
            }
        });
    }
}