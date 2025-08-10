/// <reference types="wuchale/virtual" />

import { page } from '$app/state'
import { Runtime } from 'wuchale/runtime'
import { loadCatalog, loadIDs } from 'virtual:wuchale/loader'

export {loadIDs, loadCatalog}

export default (/** @type {string} */ loadID) => {
    return page.data.catalogs?.[loadID] ?? new Runtime()
}
