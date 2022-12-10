const { app, Menu } = require('electron')

const isMac = process.platform === 'darwin'

const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  {
    label: 'Configuration',
    submenu: [
      { label: 'Mode sombre' },
      { label: 'Taille du chat' },
      { type: 'separator' },
      { label: 'Ouvrir le répertoire' }
    ]
  },
  {
    label: 'Édition',
    submenu: [
      { label: 'Commandes' },
      { label: 'Citations' }
    ]
  }
]

module.exports.mainMenu = Menu.buildFromTemplate(template);