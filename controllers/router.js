const Router = require("express").Router();
const nodemailer = require("nodemailer");
const config = require("../utils/config");
const logger = require("../utils/logger");
const Person = require("../models/person");
//backend infromation sentence
Router.get("/", (req, res, next) => {
  res.json({
    message:
      "hello, this is a backend web for sending checking mail from ziqing feng's weisite(https://ziqingfeng.vercel.app/)",
  });
});

//handle send email request
Router.post("/api/contact", async (req, res, next) => {
  const { name, email, message } = req.body;

  logger.info(req.body);

  // Send confirmation email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "fengziqing970202@gmail.com",
      pass: config.MAIL_PASS,
    },
  });

  //custom的自动回复mail
  const guestMailOptions = {
    from: "fengziqing970202@gmail.com",
    to: email,
    subject: "【HARUKO FENG】Thank you for reaching out!",
    text: `Dear ${name},\n\nThank you for reaching out. I will get back to you as soon as possible.\n\nBest regards,\nZiQing Feng\n\n your mail content is \n-------------------------------\n ${message}\n${email}\n${name}`,
  };

  //haru 我自己的mail提醒
  const hostMailOptions = {
    from: "fengziqing970202@gmail.com",
    to: "fengziqing970202@gmail.com",
    subject: `【Haruko Portfolio new message notice】 ${name}`,
    text: `message: \n${message}\n mail:\n${email}\n name:\n${name}`,
  };

  await transporter.sendMail(guestMailOptions).catch((error) => next(error));
  await transporter.sendMail(hostMailOptions).catch((error) => next(error));

  // Handle saving the message to a database or other tasks as needed

  res.status(200).json({
    success: true,
    message: "Message sent and confirmation email sent.",
  });
});

Router.get("/api/persons", (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

Router.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});

Router.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).json(result);
    })
    .catch((error) => next(error));
});

Router.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;
  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((result) => {
      response.status(200).json(result);
    })
    .catch((error) => next(error));
});

Router.post("/api/persons", (request, response, next) => {
  const data = request.body;
  // if(data.name == undefined || data.number == undefined){
  //     return response.status(400).json({
  //         error: 'need a name or number'
  //     })
  // }
  const person = new Person({
    name: data.name,
    number: data.number,
  });
  person
    .save()
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});

module.exports = Router;
