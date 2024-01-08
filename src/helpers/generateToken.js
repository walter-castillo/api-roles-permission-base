const jwt = require("jsonwebtoken");

const generateToken = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(
            payload,
            process.env.SECRETPRIVATEKEY, { expiresIn: "1year" },
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject("No se generó el token");
                } else {
                    resolve(token);
                }
            }
        );
    });
};

module.exports = { generateToken };