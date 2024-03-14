require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = process.env.PORT||process.env.SERVER_PORT;
const MAIL_PASS = process.env.MAIL_PASS

app.use(bodyParser.json());
app.use(express.static('build'))
app.use(cors());

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  console.log(req.body);
  if(!email){
    res.status(404).json({ success: false, message: 'email address is not correct.'});
  }

  // Send confirmation email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'fengziqing970202@gmail.com',
      pass: MAIL_PASS
    }
  });

  const mailOptions = {
    from: 'fengziqing970202@gmail.com',
    to: email,
    subject: '【HARUKO FENG】Thank you for reaching out!',
    text: `Dear ${name},\n\nThank you for reaching out. I will get back to you as soon as possible.\n\nBest regards,\nZiQing Feng\n\n your mail content is \n-------------------------------\n ${message}\n${email}\n${name}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent.');

    // Handle saving the message to a database or other tasks as needed

    res.status(200).json({ success: true, message: 'Message sent and confirmation email sent.' });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    res.status(500).json({ success: false, message: 'Error sending confirmation email.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});