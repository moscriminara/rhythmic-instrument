const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")
const nodemailer = require("nodemailer")

const app = express()

const path = require("path");

const verificationCode = {}

app.use(cors({
    origin: true
}))

app.use(express.json())

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})


app.get("/", (req, res)=>{
    res.send("Server is running")
})

app.post('/login', (req, res) => {

    const { email, password } = req.body

    db.query(
        "SELECT * FROM users WHERE email=? AND password=?",
        [email,password],
        (err, result) => {

            if (err) {
                return res.json({
                    success: false
                })
            }

            const user = result[0]

            if (!user) {
                res.json({
                    success: false
                })
                return
            }

            res.json({
                success :true,
                user: user
            })

        }
    )
})

app.post('/send-verification', (req, res) =>{

    const { reg_email } = req.body

    db.query(
        "SELECT email FROM users where email=?",
        [reg_email],
        async(err, result) => {

            if (err) {
                return res.json({
                    success: false
                })
            }

            if (result.length > 0) {
                return res.json({
                    success: false,
                    error: "Email_exists"
                })
            }

            const code = Math.floor(
                100000 + Math.random() * 900000
            ).toString()


            verificationCode[reg_email] = {
                code,
                expire: Date.now() + 10 * 60 * 1000
            }
        
            await transporter.sendMail({

                from: '"Rhythmic Instrument" <moscriminara@gmail.com>',
                to: reg_email,
                subject: "Verification Code",
                html: `
                    <h2>Your verification code is:</h2>
                    <h1>${code}</h1>
                    <p>This code will expire in 10 minutes.</p>
                    <p>meow</p>
                `

            })

            res.json({
                success: true
            })
        
        }
    )
})

app.post('/register', (req, res) => {

    const { reg_username, reg_email, reg_password, verif_code } = req.body
    const verify_status = verificationCode[reg_email]

    if (Date.now() > verify_status.expire) {

        delete verificationCode[reg_email]

        return res.json({
            success: false,
            error: "Expired"
        })

    }

    if (verify_status.code !== verif_code) {

        return res.json({
            success: false,
            error: "Incorrect_code"
        })

    }

    db.query (
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [reg_username, reg_email, reg_password],
        (err) => {

            if (err) {
                return res.json({
                    success: false
                })
            }

            res.json({
                success: true
            })
        }
    )

})

app.get("/tracks", (req, res) => {
    
    db.query(
        "SELECT * FROM tracks ORDER BY created_at DESC",
        (err, result) => {

            if (err) {
                return res.json({
                    success: false
                })
            }

            res.json({
                success: true,
                tracks: result
            })
        }
    )
})

app.get('/user/:id', (req, res) => {

    const { id } = req.params

    db.query(
        "SELECT * FROM users WHERE id = ?",
        [id],
        (err, result) => {

            if (err) {
                return res.json({
                    success: false
                })
            }

            res.json({
                success: true,
                user: result[0]
            })

        }
    )
})

app.get("/tracks/:id", (req, res) => {

    const id = req.params.id

    db.query(
        "SELECT * FROM tracks WHERE id=?",
        [id],
        (err, result) => {

            if (err) {
                return res.json({
                    success: false
                })
            }

            res.json({
                success: true,
                track: result[0]
            })

        }
    )
})

app.get("/search", (req, res) => {
    const keyword = req.query.keyword

    const value = `%${keyword}%`

    db.query(
        "SELECT * FROM tracks WHERE trackname LIKE ? OR trackartist LIKE ?",
        [value, value],
        (err, result) => {

            if (err) {
                return res.json({
                    success: false
                })
            }

            res.json(result);
        }
    )
})

app.put("/update-settings", (req, res) => {

    const {id, settings} = req.body

    db.query(
        "UPDATE users SET settings=? WHERE id=?",
        [JSON.stringify(settings), id],
        (err) => {

            if (err) {
                return res.json({
                    success: false
                })
            }

            res.json({
                success: true
            })

        }
    )
})

app.post('/upload-result', (req, res) => {

    const {
       user_id,
       track_id,
       accuracy,
       total_hits,
       wonderful,
       nice,
       miss 
    } = req.body

    db.query(
        "INSERT INTO records (user_id, track_id, accuracy, total_hits, wonderful, nice, miss) VALUE (?, ?, ?, ?, ?, ?, ?)",
        [
            user_id, 
            track_id,
            accuracy,
            total_hits,
            wonderful,
            nice,
            miss
        ],
        (err) => {

            if (err) {
                console.log("Incomplete data", err)
                return res.json({
                    success: false
                })
            }

            db.query(
                "SELECT average_accuracy, total_hits, total_plays FROM users WHERE id=?",
                [user_id],
                (err, result) => {

                    if (err) {
                        console.log("Unable to find the user", err)
                        return res.json({
                            success:false
                        })
                    }

                    const last_average = result[0].average_accuracy
                    const last_total_hits = result[0].total_hits
                    const last_total_plays = result[0].total_plays

                    const new_average = (
                        last_average * last_total_plays + accuracy
                    ) / (last_total_plays + 1)

                    db.query(
                        "UPDATE users SET average_accuracy=?, total_hits=?, total_plays=? WHERE id=?",
                        [
                            new_average, 
                            last_total_hits + total_hits, 
                            last_total_plays + 1, 
                            user_id
                        ],
                        (err) => {

                            if (err) {
                                console.log("Unable to upload", err)
                                return res.json({
                                    success: false
                                })
                            }

                            res.json({
                                success: true
                            })
                        }

                    )
                }
            )

        }

    )

})

module.exports = app