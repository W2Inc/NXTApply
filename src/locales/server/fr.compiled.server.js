
    export const plural = n => n == 1 ? 0 : 1
    export const data = ["Hello from the server!","PRAGMA journal_mode = WAL","Démarrage...","SELECT * FROM user WHERE id = ?",["Bun ",0]]
    
    if (import.meta.hot) {
        import.meta.hot.on('virtual:wuchale/catalog/server/server/fr', newData => {
            for (let i = 0; i < newData.length; i++) {
                if (JSON.stringify(data[i]) !== JSON.stringify(newData[i])) {
                    data[i] = newData[i]
                }
            }
        })
        import.meta.hot.send('virtual:wuchale/catalog/server/server/fr')
    }

