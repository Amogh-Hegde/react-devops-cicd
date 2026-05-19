import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)

const MessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
})

const Message = mongoose.model("Message", MessageSchema)

app.post("/api/contact", async (req, res) => {
  const newMessage = new Message(req.body)
  await newMessage.save()

  res.json({ success: true })
})

app.get("/", (req, res) => {
  res.send("Backend Running")
})

app.listen(3000, () => {
  console.log("Server running on port 3000")
})