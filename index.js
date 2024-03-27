require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 3000 || process.env.SERVER_PORT;
const MAIL_PASS = process.env.MAIL_PASS

app.use(bodyParser.json());
// accept frontend POST and GET request, https://ziqingfeng.vercel.app is front end website address
app.use(cors(
  {
    origin: ["https://ziqingfeng.vercel.app"],
    methods: ["POST", "GET"],
    credentials: true
  }
));

// //local test code
//前端的local网址 http://localhost:3001
// app.use(cors(
//   {
//     origin: ["http://localhost:3001"],
//     methods: ["POST"],
//     credentials: true
//   }
// ));

//backend infromation sentence
app.get('/', (req, res, next) => {
  res.json({
    message: "hello, this is a backend web for sending checking mail from ziqing feng's weisite(https://ziqingfeng.vercel.app/)",
  });
})

//handle send email request
app.post('/api/contact', async (req, res, next) => {

  const { name, email, message } = req.body;

  console.log(req.body);

  // Send confirmation email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'fengziqing970202@gmail.com',
      pass: MAIL_PASS
    }
  });

  //custom的自动回复mail
  const guestMailOptions = {
    from: 'fengziqing970202@gmail.com',
    to: email,
    subject: '【HARUKO FENG】Thank you for reaching out!',
    text: `Dear ${name},\n\nThank you for reaching out. I will get back to you as soon as possible.\n\nBest regards,\nZiQing Feng\n\n your mail content is \n-------------------------------\n ${message}\n${email}\n${name}`,
  };

  //haru 我自己的mail提醒
  const hostMailOptions = {
    from: 'fengziqing970202@gmail.com',
    to: 'fengziqing970202@gmail.com',
    subject: `【Haruko Portfolio new message notice】 ${name}`,
    text: `message: \n${message}\n mail:\n${email}\n name:\n${name}`,
  };

  await transporter.sendMail(guestMailOptions).catch(error => next(error));
  await transporter.sendMail(hostMailOptions).catch(error => next(error));

  // Handle saving the message to a database or other tasks as needed

  res.status(200).json({ success: true, message: 'Message sent and confirmation email sent.' });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  next(error)
}
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;