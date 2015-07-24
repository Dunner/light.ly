// lib/routes.js

'use strict';
var middleware = require('./middleware'),
    index = require('./controllers/index'),
    topic = require('./controllers/topic'),
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    bulletin = require('./controllers/bulletin'),
    conversation = require('./controllers/conversation');

module.exports = function(app) {
  // Server API Routes

  // -------
  // Session
  // -------
  app.post('/api/session', session.login); // LOGIN
  app.delete('/api/session', session.logout); // LOGOUT
  // -------
  // Topic
  // -------
  app.param('messageId', topic.message);
  app.post('/api/topic', topic.create);
  app.post('/api/topic/comment', topic.comment);
  app.get('/api/topics', topic.query);
  app.get('/api/topic/:slug', topic.show);
  app.put('/api/topic/:slug', topic.update);
  app.delete('/api/topic/:slug', topic.remove);
  // -------
  // Bulletin
  // -------
  app.param('messageId', bulletin.message);
  app.post('/api/bulletin', bulletin.create);
  app.get('/api/bulletin', bulletin.query);
  app.get('/api/bulletin/:messageId', bulletin.show);
  app.put('/api/bulletin/:messageId', bulletin.update);
  app.delete('/api/bulletin/:messageId', bulletin.remove);
  // -------
  // Users
  // -------
  app.post('/api/users', users.create); // SIGNUP
  app.get('/api/users/all', users.all); // GET ALL USERS
  app.get('/api/users/single/:id', users.single); // GET SINGLE USER
  app.get('/api/users/buddies/:id', users.buddies); // GET BUDDIES
  app.post('/api/users/buddies/add/:id', users.befriend); // ADD BUDDIE
  app.post('/api/users/changeName', users.changeName); // CHANGE NAME
  app.post('/api/users/changePassword', users.changePassword); // CHANGE PASSWORD
  app.get('/api/profile', middleware.auth, function(req, res) { // PROFILE
    res.send('user ' + req.user);
  });
  // -------
  // Conversations
  // -------
  app.get('/api/conversation/all/:id', conversation.conversations); //Returns a conversation
  app.get('/api/conversation/specific', conversation.conversation); //Returns a conversation
  app.post('/api/conversation/save', conversation.save); //Creating conversations & sending messages

  // -------
  // Other
  // -------
  // 404
  app.get('/api/*', function(req, res) {
    res.send(404);
  });

  // -------
  // Protected
  // -------
  app.get('/user', middleware.auth);
  app.get('/users', middleware.auth);
  app.get('/settings', middleware.auth);


  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/views/*', index.views);
  app.get('/*', middleware.setUserCookie, index.index);
};