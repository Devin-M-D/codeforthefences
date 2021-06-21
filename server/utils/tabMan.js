var tabMan = {}
tabMan.tab = ""
tabMan.indent = () => { tabMan.tab += "  " }
tabMan.outdent = () => { tabMan.tab.replace("  ", "") }

module.exports = tabMan
