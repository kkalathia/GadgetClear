const phoneRoutes = require('./phone');

const constructorMethod = (app) => {
    app.use('/', phoneRoutes);

	app.use('*', (req, res) => {
		res.sendStatus(404);
	});
};

module.exports = constructorMethod;