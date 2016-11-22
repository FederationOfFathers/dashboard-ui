//TODO: Implement this when you get AureliaUX hooked up

const DesignDefaults = {
    color: {
        primary: '#704794',
        accent: '#e62787'
    }
}


function configureDesign(ux){
    ux.design.primary = DesignDefaults.color.primary;
    ux.design.accent = DesignDefaults.color.accent;
}

module.exports = {
    configureDesign: configureDesign
}