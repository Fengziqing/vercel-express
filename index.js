require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = process.env.PORT||process.env.SERVER_PORT;
const MAIL_PASS = process.env.MAIL_PASS

app.use(bodyParser.json());
// app.use(express.static('build'));
app.use(cors());

app.get('/',(req,res) => {
    res.json({
        message:"hello, this is a backend web for sending checking mail from ziqing-feng",
    });
})

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

  const guestMailOptions = {//custom的自动回复mail
    from: 'fengziqing970202@gmail.com',
    to: email,
    subject: '【HARUKO FENG】Thank you for reaching out!',
    text: `Dear ${name},\n\nThank you for reaching out. I will get back to you as soon as possible.\n\nBest regards,\nZiQing Feng\n\n your mail content is \n-------------------------------\n ${message}\n${email}\n${name}`,
  };

  const hostMailOptions = {//haru 我自己的mail提醒
    from:'fengziqing970202@gmail.com',
    to:'fengziqing970202@gmail.com',
    subject:`【Haruko Portfolio new message notice】 ${name}`,
    text: `message: \n${message}\n mail:\n${email}\n name:\n${name}`,
  };

  try {
    await transporter.sendMail(guestMailOptions);
    console.log('guest Confirmation email sent.');

    await transporter.sendMail(hostMailOptions);
    console.log('host email sent.');

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

module.exports = app;