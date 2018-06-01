// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our Contact model
const db = require('../models');

// console.log('\n<------------------------------>\n');
// console.log(db.contacts);
// console.log('\n<------------------------------>\n');

const contacts = db.contacts;

const trialSID = process.env.TWILIO_TRIAL_SID;
const realSID = process.env.TWILIO_SID;
const trialToken = process.env.TWILIO_TRIAL_TOKEN;
const realToken = process.env.TWILIO_TOKEN;
const trialNumber = process.env.TWILIO_TRIAL_PHONE_NUMBER;
const realNumber = process.env.TWILIO_PHONE_NUMBER;

const client = require('twilio')(trialSID, trialToken);

// Routes
// =============================================================
module.exports = function(app) {
  // GET route for getting all of the todos

  app.get('/api/getNumber/:id', function(req, res) {
    contacts.findOne({
      where: {
        id: req.params.id,
      },
    }).then(function(dbContacts) {
      res.json(dbContacts);
    });
  });
  let phoneNumber;
  let outgoingMessage;

  app.get('/testTwilio/:id', function(req, res) {
    contacts.findOne({
      where: {
        id: req.params.id,
      },
    }).then(function(dbContacts) {
      // console.log('\n<---------------------->\n');
      // console.log(dbContacts.dataValues.phone_number);
      // console.log('\n<---------------------->\n');

      phoneNumber = dbContacts.dataValues.phone_number;
      outgoingMessage = dbContacts.dataValues.outgoing_message;

      client.messages.create({
        from: trialNumber,
        to: phoneNumber,
        body: outgoingMessage,
      }, function(err, data) {
        if (err) {
          console.log(err);
        } else console.log(data.body);
      });
    });
  });

  app.get('/api/getNumber', function(req, res) {
    contacts.findAll({}).then(function(dbContacts) {
      return res.json(dbContacts);
    });
  });

  // POST route for saving a new contact
  app.post('/api/getNumber', function(req, res) {
    // console.log(`POST: ${req.body}`);
    // create takes an argument of an object describing the item we want to
    // insert into our table. In this case we just we pass in an object with a text
    // and complete property (req.body)
    contacts.create({
      contact_name: req.body.contact_name,
      phone_number: req.body.phone_number,
      outgoing_message: req.body.outgoing_message,
      email_address: req.body.email_address,
      // scheduled_date: req.body.scheduled_date,
      // scheduled_time: req.body.scheduled_time,
      scheduled_send: req.body.scheduled_send,
    }).then(function(dbContacts) {
      // We have access to the new coontact as an argument inside of the callback function
      res.json(dbContacts);
    });
  });

  // // DELETE route for deleting todos. We can get the id of the todo we want to delete from
  // // req.params.id
  // app.delete("/api/todos/:id", function(req, res) {

  // });

//   // PUT route for updating todos. We can get the updated todo from req.body
//   app.put("/api/todos", function(req, res) {

//   });
};
