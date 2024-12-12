// src/ui/header/index.js
const templateFile = fetch("src/ui/header/template.html.inc").then(response => response.text());

const HeaderView = {
    template: null,

    async init() {
        this.template = await templateFile;
    },

    render() {
        return this.template;
    }
};

export { HeaderView };
