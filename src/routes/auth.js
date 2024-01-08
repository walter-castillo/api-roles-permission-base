const { Router } = require("express");
const { check } = require("express-validator");
const { showErrors, validateJwt } = require("../middlewares/varios")
const { login, loginToken } = require("../controllers/auth");
const {} = require("../middlewares/userRouteMiddlewares");
const router = Router();

router.post(
    "/login", [
        check("email")
        .notEmpty().withMessage('El correo es obligatorio').bail()
        .isEmail().withMessage('No es tipo correo'),
        check("password")
        .notEmpty().withMessage('El password o contraseña es obligatorio'),
        showErrors,
    ],
    login
);

router.get("/token/user", [validateJwt, showErrors], loginToken);

module.exports = router;