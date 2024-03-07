// routes/mail.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Data = require("../models/Data");

router.post("/", async (req, res) => {
  try {
    // Extract data from request body
    const { email, subject, message, selectedIds } = req.body;

    // Fetch data corresponding to selected IDs from the database
    const selectedData = await Data.find({ _id: { $in: selectedIds } });

    // Create transporter object using SMTP transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // Define email options
    // Define email options
    let mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: subject,
      html: `<p>${message}</p>
           <h2>Selected Data</h2>
           <table border="1">
             <thead>
               <tr>
                 <th>Name</th>
                 <th>Phone Number</th>
                 <th>Email</th>
                 <th>Hobbies</th>
               </tr>
             </thead>
             <tbody>
               ${selectedData
                 .map(
                   (data) => `
                 <tr>
                   <td>${data.name}</td>
                   <td>${data.phoneNumber}</td>
                   <td>${data.email}</td>
                   <td>${data.hobbies}</td>
                 </tr>`
                 )
                 .join("")}
             </tbody>
           </table>`,
    };

    // Send email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "Email could not be sent" });
      } else {
        console.log("Email sent: " + info.response);
        res.json({ message: "Email sent successfully" });
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
