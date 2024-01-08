const { check } = require("express-validator");
const { showErrors, validateJwt, hasPermissionOrRole } = require("./varios")
const { existsEmail, existsUserId, passwordConfirmation } = require("../helpers/db-validators");

module.exports = {
    userCreateValidator: [
        check("name", "El nombre es obligatorio").notEmpty(),
        check("password").notEmpty().withMessage('El password es obligatorio').bail(),
        check("passwordConfirmation").custom(passwordConfirmation),
        check("phone")
        .notEmpty().withMessage('El telefono es obligatorio').bail()
        .matches(/^\d{10}$/).withMessage('El telefono es incorrecto ').bail(),
        check("email", "El correo no es válido").isEmail().bail()
        .notEmpty().withMessage('El email es obligatorio').bail()
        .custom(existsEmail).bail(),
        showErrors,
    ],
    userUpdateValidator: [
        validateJwt,
        check("name", "El nombre no puede estar vacio").notEmpty().optional(),
        check("phone")
        .notEmpty().withMessage('El telefono es obligatorio').bail().optional()
        .matches(/^\d{10}$/).withMessage('El telefono es incorrecto ').bail(),
        check("password")

        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,10}$/)
        .withMessage('El password debe contener por lo menos: una mayúscula, minúscula, un número y longitud entre 6 y 10').optional(),
        check("passwordConfirmation").custom(passwordConfirmation),

        check("id", "No es un ID  válido").isMongoId().bail()
        .custom(existsUserId),
        showErrors,
    ],
    userGetValidator: [
        validateJwt,
        check("id", "No es un ID  válido").isMongoId().bail()
        .custom(existsUserId),
        showErrors,
    ],
    usersAllValidator: [
        validateJwt,
        hasPermissionOrRole({ permission: "ver.todos.usuarios" }),
        check("limit").isInt({ min: 1, max: 25 }).withMessage('limit tiene que ser num entero, entre 1 y 25').optional(),
        check("from").isInt({ min: 0 }).withMessage('from tiene que ser numero entero mayor que 0').optional(),
        showErrors,
    ],
    userDeleteValidator: [
        validateJwt,
        check("id", "No es un ID  válido").isMongoId().bail()
        .custom(existsUserId),
        showErrors,
    ]
};