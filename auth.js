const jwt = require("jsonwebtoken");


module.exports.createAccessToken = (user) => {
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.idAdmin
	};
	return jwt.sign(data, process.env.JWT_SECRET, {});
}

module.exports.verify = (req, res, next) => {

	let token = req.headers.authorization

	if(typeof token !== "undefined"){
		token = token.slice(7, token.length)

		return jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
			if(err){
				return res.send({auth: "failed"})
			}else{
				next();
			}
		})
	}else{ 
		return res.send({auth: "failed"})
	}
}

module.exports.decode = (token) => {

	if(typeof token !== "undefined"){
		token = token.slice(7, token.length);

		return jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
			if(err){
				return null;
			}else{
				return jwt.decode(token, {complete: true}).payload
			}
		})
	}else{ 
		return null;
	}
}