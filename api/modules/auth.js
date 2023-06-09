const jwt = require("jsonwebtoken");
const jwtSecret = "jwtSecret1234567890";

const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

module.exports = async function (request, result, next) {
    try {
        const accessToken = request.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(accessToken, jwtSecret);
        const userId = decoded.userId;

        const user = await db.collection("HMS").findOne({
            accessToken: accessToken
        });

		if (user == null) {
			result.status(401).json({
	            status: "error",
	            message: "User has been logged out."
	        });
			return;
		}

        delete user.password;
        delete user.accessToken;
        delete user.createdAt;

        request.user = user;
        next();
    } catch (exp) {
        result.status(401).json({
            status: "error",
            message: "User has been logged out."
        });
    }
};