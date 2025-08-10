import { loadLocales } from 'wuchale/run-server'
import { loadCatalog, loadIDs } from './proxy.js' // or loader/sync

export default await loadLocales('main', loadIDs, loadCatalog, ['en', 'es'])
