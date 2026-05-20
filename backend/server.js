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

app.delete("/api/contact/cleanup", async (req, res) => {
  const pipelineSecret = req.get("X-Pipeline-Secret")

  if (!process.env.PIPELINE_SECRET || pipelineSecret !== process.env.PIPELINE_SECRET) {
    return res.status(403).json({ error: "Forbidden" })
  }

  try {
    const filter = { email: "devops@assignment.com" }
    const existingMessage = await Message.findOne(filter).lean()

    if (!existingMessage) {
      return res.status(200).json({
        success: true,
        deletedCount: 0,
        message: "No matching test entry found"
      })
    }

    const deleteResult = await Message.deleteMany(filter)

    return res.status(200).json({
      success: true,
      deletedCount: deleteResult.deletedCount ?? 0
    })
  } catch (error) {
    console.error("Cleanup route failed:", error)

    return res.status(500).json({
      error: "Internal server error"
    })
  }
})

app.get("/", (req, res) => {
  res.send("Backend Running")
})

app.listen(3000, () => {
  console.log("Server running on port 3000")
})
