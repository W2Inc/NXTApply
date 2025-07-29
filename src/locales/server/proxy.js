
            import * as enOfserver from './en.compiled.server.js'
import * as esOfserver from './es.compiled.server.js'
import * as frOfserver from './fr.compiled.server.js'
            const catalogs = {server: {en: enOfserver,es: esOfserver,fr: frOfserver}}
            export const loadIDs = ['server']
            export const loadCatalog = (loadID, locale) => catalogs[loadID][locale]
        