const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { generateToken } = require("../helpers/generateToken");

// para loguearse
const login = async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ errors: [{ msg: "Email | Password son incorrectos" }] });
        if (!user.status) return res.status(400).json({ errors: [{ msg: "usuario suspendido" }] });
        const validatePassword = bcrypt.compareSync(password, user.password);
        if (!validatePassword) return res.status(400).json({ errors: [{ msg: "Email | Password son incorrectos" }] });

        const token = await generateToken(user.id);
        res.json({ user, token });
    } catch (error) { res.status(500).json({ errors: [{ msg: "Comuníquese con el administrador" }] }); }
};

// para consultar el token
const loginToken = (req, res) => {
    try {
        res.json(req.userToken);
    } catch (error) { res.status(500).json({ errors: [{ msg: "vuelva a iniciar sesion o Comuníquese con el administrador " }] }); }
};

const logout = async(req, res) => { res.status(200).json({ msg: "Sesion cerrada" }); };

module.exports = { login, logout, loginToken };