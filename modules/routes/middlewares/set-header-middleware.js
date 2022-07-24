module.exports = (req, res, next) => {
	res.header('Access-Control-Allow-Origin', "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type Authorization');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type,Authorization, Accept');
	next();
};