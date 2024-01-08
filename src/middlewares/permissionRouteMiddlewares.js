const { check } = require("express-validator");
const { showErrors, validateJwt, hasPermissionOrRole } = require("./varios")
const { existsPermisionId } = require("../helpers/db-validators");

module.exports = {
    permissionGetValidator: [
        validateJwt,
        hasPermissionOrRole({ permission: "ver.permiso" }),
        check("id", "No es un ID  válido").isMongoId().bail()
        .custom(existsPermisionId),
        showErrors,
    ],
    permissionsAllValidator: [
        validateJwt,
        hasPermissionOrRole({ permission: "ver.todos.permisos" }),
        showErrors,
    ]
};