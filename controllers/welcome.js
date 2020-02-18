const OPTIMIZE = require("./optimize.js");
const SUGGESTIONS = require('./suggestions.js');
const FUNCTIONS = require('../functions.js');

exports.get_redirect = function(req, res, next) {
  if (req.body['type'] === "logout") {
    req.session.destroy();
  } 
  else if (req.body['type'] === "settings") {
    req.session.range = req.body.time_range;
    req.session.limit = req.body.limit;
    SUGGESTIONS.top_tracks(req, res, next);
  }
  else if (req.body['type'] === "suggestion_action") {
    if (req.body['button_type'] === "create_new") {
      res.render('suggestions', { title: 'Our suggestions', user: req.session.json, suggestions: req.session.suggestions_json, making_new: true});
    }
    else if (req.body['button_type'] === "optimize_existing") {
      req.session.selected_playlist = req.body['selected_playlist'];
      OPTIMIZE.get_optimize(req, res, next);
    }
  }
  else if (req.body['type'] === "submit_new") {
    FUNCTIONS.create_playlist(req, res, req.body.playlist_name, req.body.private);
  }
  else if (req.body['type'] === "save_changes") {
    console.log("\n\n\nsave changes recevied\n\n\n");
    if (req.body['remove_song']) {
      FUNCTIONS.remove_tracks(req.session.selected_playlist, req.body['remove_song']);
    }
    if (req.body['add_song']) {
      FUNCTIONS.add_tracks(req.session.selected_playlist, req.body['add_song']);
    }
    res.send("Save changes received");
  }
  else {
    res.send("404 Error, please contact me at joe.muzina@gmail.com.");
  }
}

exports.get_welcome = function(req, res, next) {
  if (!req.session.name) {
    res.render('welcome', { title: 'Spotify Playlist Optimizer' });
  }
  else {
    res.render('welcome', { title: 'Spotify Playlist Optimizer', name: req.session.name, profile_pic: req.session.pfp});
  }
}

exports.post_welcome = function(req, res, next) {
  console.log("Welcome post received?");
}