const db = require('../configs/database')
const query = require('../helpers/query')

class Transactions {
    getTransactions() {
        return query("SELECT a.id, a.note, a.total, b.name AS _from, c.name AS _to FROM transactions AS a INNER JOIN users AS b ON a.id_from_user = b.id INNER JOIN users AS c ON a.id_to_user = c.id")
    }

    getTransaction(id) {
        return query("SELECT id FROM transactions WHERE id = ?", [id])
    }


    getAllTransactions(limit = 5, offset = 1) {
        const limitNew = !isNaN(parseInt(limit)) ? parseInt(limit) : 5
        const offsetNew = !isNaN(parseInt(offset)) ? parseInt(offset) : 1

        return query(`
            SELECT a.id, a.type, a.id_user,  d.name, d.photo,
                c.amount AS amount_topup, c.va_number, c.va_type, c.order_id, c.status, a.created_at, c.paydate_at,
                e.name AS name_receiver, e.photo AS photo_receiver, b.id_receiver, b.note, b.balance, b.amount
            FROM transactions AS a
            LEFT JOIN transfer_history AS b
                ON a.id_transfer = b.id
            LEFT JOIN topup_history AS c
                ON a.id_topup = c.id
            INNER JOIN users AS d
                ON a.id_user = d.id
            LEFT JOIN users AS e
                ON b.id_receiver = d.id
            ORDER BY a.created_at DESC
            LIMIT ? OFFSET ?
        `, [limitNew, (offsetNew - 1) * limitNew])
    }

    getAllTransactionsByUserid(id, limit = 5, offset = 1, filter = 1) {
        const limitNew = !isNaN(parseInt(limit)) ? parseInt(limit) : 5
        const offsetNew = !isNaN(parseInt(offset)) ? parseInt(offset) : 1

        return query(`
            SELECT a.id, a.type, a.id_user,  d.name, d.photo,
                c.amount AS amount_topup, c.va_number, c.va_type, c.order_id, c.status, a.created_at, c.paydate_at,
                e.name AS name_receiver, e.photo AS photo_receiver, b.id_receiver, b.note, b.balance, b.amount
            FROM transactions AS a
            LEFT JOIN transfer_history AS b
                ON a.id_transfer = b.id
            LEFT JOIN topup_history AS c
                ON a.id_topup = c.id
            INNER JOIN users AS d
                ON a.id_user = d.id
            LEFT JOIN users AS e
                ON b.id_receiver = d.id
            WHERE (a.type = 'transfer' AND (a.id_user = ? OR b.id_receiver = ?))
            OR (a.type = 'topup' AND a.id_user = ?)
            ORDER BY a.created_at DESC
            LIMIT ? OFFSET ?
        `, [id, id, id, limitNew, (offsetNew - 1) * limitNew])
    }

    getAllTransactionsByIncomeUserid(id, limit = 5, offset = 1) {
        const limitNew = !isNaN(parseInt(limit)) ? parseInt(limit) : 5
        const offsetNew = !isNaN(parseInt(offset)) ? parseInt(offset) : 1

        return query(`
            SELECT a.id, a.type, a.id_user,  d.name, d.photo,
                c.amount AS amount_topup, c.va_number, c.va_type, c.order_id, c.status, a.created_at, c.paydate_at,
                e.name AS name_receiver, e.photo AS photo_receiver, b.id_receiver, b.note, b.balance, b.amount
            FROM transactions AS a
            LEFT JOIN transfer_history AS b
                ON a.id_transfer = b.id
            LEFT JOIN topup_history AS c
                ON a.id_topup = c.id
            INNER JOIN users AS d
                ON a.id_user = d.id
            LEFT JOIN users AS e
                ON b.id_receiver = d.id
            WHERE (b.id_receiver = ? AND a.type = 'transfer')
            OR (a.type = 'topup' AND a.id_user = ?)
            ORDER BY a.created_at DESC
            LIMIT ? OFFSET ?
        `, [id, id, limitNew, (offsetNew - 1) * limitNew])
    }

    getAllTransactionsByExpenseUserid(id, limit = 5, offset = 1) {
        const limitNew = !isNaN(parseInt(limit)) ? parseInt(limit) : 5
        const offsetNew = !isNaN(parseInt(offset)) ? parseInt(offset) : 1

        return query(`
            SELECT a.id, a.type, a.id_user,  d.name, d.photo,
                c.amount AS amount_topup, c.va_number, c.va_type, c.order_id, c.status, a.created_at, c.paydate_at,
                e.name AS name_receiver, e.photo AS photo_receiver, b.id_receiver, b.note, b.balance, b.amount
            FROM transactions AS a
            LEFT JOIN transfer_history AS b
                ON a.id_transfer = b.id
            LEFT JOIN topup_history AS c
                ON a.id_topup = c.id
            INNER JOIN users AS d
                ON a.id_user = d.id
            LEFT JOIN users AS e
                ON b.id_receiver = d.id
            WHERE a.id_user = ? AND a.type = 'transfer'
            ORDER BY a.created_at DESC
            LIMIT ? OFFSET ?
        `, [id, limitNew, (offsetNew - 1) * limitNew])
    }

    getAllTransactionsByDateUserid(id, limit = 5, offset = 1, date_start, date_end) {
        const limitNew = !isNaN(parseInt(limit)) ? parseInt(limit) : 5
        const offsetNew = !isNaN(parseInt(offset)) ? parseInt(offset) : 1

        return query(`
            SELECT a.id, a.type, a.id_user,  d.name, d.photo,
                c.amount AS amount_topup, c.va_number, c.va_type, c.order_id, c.status, a.created_at, c.paydate_at,
                e.name AS name_receiver, e.photo AS photo_receiver, b.id_receiver, b.note, b.balance, b.amount
            FROM transactions AS a
            LEFT JOIN transfer_history AS b
                ON a.id_transfer = b.id
            LEFT JOIN topup_history AS c
                ON a.id_topup = c.id
            INNER JOIN users AS d
                ON a.id_user = d.id
            LEFT JOIN users AS e
                ON b.id_receiver = d.id
            WHERE ((a.type = 'transfer' AND (a.id_user = ? OR b.id_receiver = ?))
            OR (a.type = 'topup' AND a.id_user = ?)) AND a.created_at BETWEEN ? AND ?
            ORDER BY a.created_at DESC
            LIMIT ? OFFSET ?
        `, [id, id, id, date_start, date_end, limitNew, (offsetNew - 1) * limitNew])
    }

    getIncomeTransaction(id) {
        return query(`
            SELECT SUM(b.amount) AS transfer, SUM(c.amount) AS topup
            FROM transactions AS a
            LEFT JOIN transfer_history AS b
                ON a.id_transfer = b.id
            LEFT JOIN topup_history AS c
                ON a.id_topup = c.id
            WHERE (a.type = 'transfer' AND b.id_receiver = ?)
            OR (a.type = 'topup' AND a.id_user = ? AND status = 1)
            ORDER BY a.created_at DESC
        `, [id, id])
    }

    getExpenseTransaction(id) {
        return query(`
            SELECT SUM(b.amount) AS transfer
            FROM transactions AS a
            LEFT JOIN transfer_history AS b
                ON a.id_transfer = b.id
            WHERE (a.type = 'transfer' AND a.id_user = ?)
            ORDER BY a.created_at DESC
        `, [id, id])
    }

    getTransactionsByid(historyId, userId) {
        return query(`
            SELECT a.id, a.type, a.id_user, d.phone, d.name, d.photo,
                c.amount AS amount_topup, c.va_number, c.va_type, c.order_id, c.status, a.created_at, c.paydate_at,
                e.name AS name_receiver, e.photo AS photo_receiver, e.phone AS phone_receiver, b.id_receiver, 
                b.note, b.balance, b.amount
            FROM transactions AS a
            LEFT JOIN transfer_history AS b
                ON a.id_transfer = b.id
            LEFT JOIN topup_history AS c
                ON a.id_topup = c.id
            INNER JOIN users AS d
                ON a.id_user = d.id
            LEFT JOIN users AS e
                ON b.id_receiver = d.id
            WHERE ( a.id = ? AND (a.type = 'transfer' AND (a.id_user = ? OR b.id_receiver = ?)))
            OR (a.id = ? AND (a.type = 'topup' AND a.id_user = ?))
            ORDER BY a.created_at DESC
        `, [historyId, userId, userId, historyId, userId])
    }

    getTransactionsByOrderid(orderId) {
        return query(`
            SELECT a.id, a.type, a.id_user,  d.name, d.photo, d.phone,
                c.amount AS amount_topup, c.va_number, c.va_type, c.order_id, c.status, a.created_at, c.paydate_at,
                e.name AS name_receiver, e.photo AS photo_receiver, e.phone AS phone_receiver,
                b.id_receiver, b.note, b.balance, b.amount
            FROM transactions AS a
            LEFT JOIN transfer_history AS b
                ON a.id_transfer = b.id
            LEFT JOIN topup_history AS c
                ON a.id_topup = c.id
            INNER JOIN users AS d
                ON a.id_user = d.id
            LEFT JOIN users AS e
                ON b.id_receiver = d.id
            WHERE a.type = 'topup' AND c.order_id = ?
            ORDER BY a.created_at DESC
        `, [orderId])
    }

    insertTransfer(data) {
        return query("INSERT INTO transfer_history SET ?", data)
    }

    insertTopup(data) {
        return query("INSERT INTO topup_history SET ?", data)
    }

    updateTopup(data, where) {
        return query("UPDATE topup_history SET ? WHERE ?", [data, where])
    }

    insertTransactions(data) {
        return query("INSERT INTO transactions SET ?", data)
    }

    updateTransactionData(data, id) {
        return query("UPDATE transactions SET ? WHERE id = ?", [data, id])
    }

    deleteTransaction(id) {
        return query("DELETE FROM transactions WHERE id = ?", [id])
    }

    //Admin

    getTransactions_Admin() {
        return query("SELECT a.id, a.note, a.total, b.name AS from_name, b.photo AS from_photo, c.name AS to_name, c.photo AS to_photo, b.email AS from_email, c.email AS to_email, a.created_at FROM transactions AS a INNER JOIN users AS b ON a.id_from_user = b.id INNER JOIN users AS c ON a.id_to_user = c.id")
    }
}

module.exports = new Transactions()
