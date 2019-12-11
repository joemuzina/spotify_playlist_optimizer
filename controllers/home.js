var spotify_handler = require('../spotify_auth_handler.js');
var api_connection = spotify_handler.spotify_connection;
const CLASSES = require('../classes.js');

exports.get_home = function(req, res, next) {
    api_connection.getUser(req.session.user).then( 
        function(data) {
            api_connection.getUserPlaylists(req.session.user).then(
                function(playlist_data) {
                    playlists = [];
                    num_pushed = 0;
                    num_checked = 0;
                    for (playlist in playlist_data.body['items']) {
                        if ((playlist_data.body['items'][playlist]['owner']['id'] == req.session.user || playlist_data.body['items'][playlist]['collaborative']) && (num_pushed != Object.keys(playlist_data.body['items']).length - 1)) {
                            playlists.push(new CLASSES.playlist_info(playlist_data.body['items'][playlist]['id'], playlist_data.body['items'][playlist]['name']))
                            num_pushed += 1;
                        }
                        else if (num_checked == Object.keys(playlist_data.body['items']).length - 1) {
                            user_JSON = JSON.parse(JSON.stringify(new CLASSES.user_info(data.body['id'], data.body['display_name'], data.body['images']['0']['url'], playlists)));
                            req.session.json = user_JSON;
                            res.render('home', { title: 'Spotify Playlist Optimizer', user: user_JSON});
                        }
                        num_checked += 1;
                    }
                },
                function(err) {
                    console.log(err);
                }
            )
        },
        function(err) {
            console.log(err);
        }
    );
}

exports.post_home = function(req, res, next) {
    req.session.destroy()
    res.redirect('/');
}