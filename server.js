import express from "express";
import nodemailer from "nodemailer";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Hello from Render + LambdaPractice!");
});
// Email route
app.post("/send-email", async (req, res) => {
  try {
    const { text } = req.body; // this will come from Lambda
    console.log("Received text:", text);

    // Transporter setup (using Gmail app password)
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your gmail
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    // Send email
    let info = await transporter.sendMail({
      from: `"S3 OCR Bot" <${process.env.EMAIL_USER}>`,
      to: "sunil.22210652@viit.ac.in", // where to send
      subject: "Extracted Text from Document",
      text: text,
    });

    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
