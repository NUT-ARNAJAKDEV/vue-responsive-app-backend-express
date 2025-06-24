const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { Pool } = require('pg')

const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.json())

const pool = new Pool({
    user: 'postgres',       // ชื่อ user ใน pgAdmin
    host: 'localhost',
    database: 'test',      // ชื่อฐานข้อมูล
    password: 'pgadmin', // ใส่รหัสผ่านของคุณ
    port: 5432
})

// POST /submit - รับข้อมูลจากฟอร์มแล้วบันทึก
app.post('/submit', async (req, res) => {
    const { name, email } = req.body
    try {
        const result = await pool.query(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        )
        res.json({ success: true, user: result.rows[0] })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, error: 'Database error' })
    }
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})
