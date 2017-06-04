const config = {}

config.user_database = {
  url: "mongodb://localhost/database",
  secret: "secret_token_39cnej3943"
  }
config.session_database = {
  url: "mongodb://localhost/session",
  secret: "secret_token_39cnej3943"
  }
config.store = {
	require: 'connect-mongo'
}
config.url = {
	login: "/login",
	logout: "/logout",
	failure: "/",
	success: "/profile"
}
config.session = {
	atts:["username"],
	key:"username"
}
  
module.exports = config
