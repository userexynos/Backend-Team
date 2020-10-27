const db = require('../configs/database')

const QUERY = (query, payload = null) => {
  return new Promise((resolve, reject) => {
    db.query(query, payload, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

module.exports = QUERY