# simple node passport application

structure:
	app containing:
		index.js => ui and middleware get added to express app
		middleware.js => the passport middleware implementation
		hbs => the ui files
	config containing:
		index.js => configuration data
	main.js => loading and starting the server
	package.json => npm modules

1. install an mongo server and start the deamon
2. run:
	* npm install
	* npm start