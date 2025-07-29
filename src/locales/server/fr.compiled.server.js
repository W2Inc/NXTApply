
    export const plural = n => n == 1 ? 0 : 1
    export const data = ["PRAGMA journal_mode = WAL","Starting...","SELECT * FROM user WHERE id = ?","\n\t\t\tSELECT\n\t\t\t\te.*,\n\t\t\t\tet.name AS name,\n\t\t\t\tet.description AS description,\n\t\t\t\tue.completedAt,\n\t\t\t\t(\n\t\t\t\t\tSELECT GROUP_CONCAT(rt.name)\n\t\t\t\t\tFROM event_type_dependency ed\n\t\t\t\t\tJOIN event_type rt ON ed.requiredTypeId = rt.id\n\t\t\t\t\tWHERE ed.eventId = e.id\n\t\t\t\t\t\tAND NOT EXISTS (\n\t\t\t\t\t\t\tSELECT 1\n\t\t\t\t\t\t\tFROM user_event ue2\n\t\t\t\t\t\t\tJOIN event e2 ON ue2.eventId = e2.id\n\t\t\t\t\t\t\tWHERE ue2.userId = ?\n\t\t\t\t\t\t\t\tAND e2.eventTypeId = ed.requiredTypeId\n\t\t\t\t\t\t\t\tAND ue2.completedAt IS NOT NULL\n\t\t\t\t\t\t)\n\t\t\t\t) AS requires\n\t\t\tFROM event e\n\t\t\tJOIN event_type et ON e.eventTypeId = et.id\n\t\t\tLEFT JOIN user_event ue ON e.id = ue.eventId AND ue.userId = ?;\n\t\t\t","SELECT * FROM application_track","INSERT INTO ","Unauthorized","SELECT * FROM user WHERE email = ?","DELETE FROM session WHERE id = ?","Invalid credentials","INSERT INTO user (id, hash, email, firstName, lastName) VALUES (?, ?, ?, ?, ?) RETURNING *","UPDATE users SET\n\t\t\t\tfirstName = ?,\n\t\t\t\tlastName = ?\n\t\t\t\tWHERE id = ?","UPDATE application_track SET isActive = CASE WHEN id = ? THEN 1 ELSE 0 END","Activated!","DELETE FROM user WHERE id = ?","Deleted","L","UPDATE user SET tfa = ? WHERE id = ? RETURNING *","SELECT * FROM application_track WHERE id = ?","SELECT * FROM application_step WHERE trackId = ? ORDER BY \"order\"","Yay!","SELECT * FROM event_type ORDER BY name ASC","SELECT * FROM event WHERE id = ?","Event not found","SELECT requiredTypeId FROM event_type_dependency WHERE eventId = ?","Registration cutoff must be after the event start.","\n\t\t\t\t\tINSERT INTO event (id, eventTypeId, startsAt, registerUntil, createdAt, updatedAt)\n\t\t\t\t\tVALUES ($id, $eventTypeId, $startsAt, $registerUntil, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)\n\t\t\t\t","\n\t\t\t\t\tUPDATE event\n\t\t\t\t\tSET eventTypeId = $eventTypeId,\n\t\t\t\t\t\tstartsAt = $startsAt,\n\t\t\t\t\t\tregisterUntil = $registerUntil,\n\t\t\t\t\t\tupdatedAt = CURRENT_TIMESTAMP\n\t\t\t\t\tWHERE id = $id\n\t\t\t\t","DELETE FROM event_type_dependency WHERE eventId = $id","\n\t\t\t\t\tINSERT INTO event_type_dependency (eventId, requiredTypeId)\n\t\t\t\t\tVALUES ($eventId, $requiredTypeId)\n\t\t\t\t","SELECT * FROM event_type WHERE id = ?","Event type not found"]
    
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

