import jwt from 'jsonwebtoken'
import User from '../../models/user-model.js'


export default async (req, res, next) => {
	if (req.headers["authorization"]) {
		const re = new RegExp('Bearer (.*)');
		let accessToken = req.headers["authorization"].match(re)
		if (accessToken === null) return res.status(401).json({error: 'Please enter a valid format for token'})
		jwt.verify(accessToken[1], process.env.JWT_SECRET, async (err, decoded) => {
			if (err && err.message) return res.status(401).json({error: `${err.message}, please login to obtain a new one`});
			// const user = await User.findById(decoded.userId);
			// if (user.accessToken !== accessToken) return res.status(401).json({error: `jwt expired, please login to obtain a new one`});
			else res.locals.loggedInUser = await User.findById(decoded.userId);
			next();
		});
	} else {
		next();
	}
}