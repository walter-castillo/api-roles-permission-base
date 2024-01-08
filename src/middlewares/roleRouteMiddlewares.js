const { check } = require("express-validator");
const { showErrors, validateJwt, hasPermissionOrRole } = require("./varios")
const { existsRole, existsRoleId } = require("../helpers/db-validators");


module.exports = {
    roleCreateValidator: [
        validateJwt,
        hasPermissionOrRole({ permission: "crear.rol" }),
        check("role").notEmpty().withMessage('El nombre del rol es obligatorio').bail()
        .custom(existsRole).bail(),

        check('permissions')
        .isArray({ min: 0 })
        .withMessage('La lista de permisos debe ser un array').bail(),

        check('permissions.*')
        .isMongoId()
        .withMessage('Los permisos deben ser ID válido').bail(),

        showErrors
    ],

    roleUpdateValidator: [
        validateJwt,
        hasPermissionOrRole({ permission: "actualizar.rol" }),
        check("id", "No es un ID  válido").isMongoId().bail()
        .custom(existsRoleId),

        check('role')
        .isLength({ min: 3, max: 20 }).optional()
        .withMessage('El nombre del rol debe tener entre 5 y 30 caracteres').bail(),

        check('description')
        .isLength({ min: 5, max: 50 }).optional()
        .withMessage('La descripcion debe tener entre 5 y 30 caracteres').bail(),

        check('status')
        .isBoolean().withMessage('El estado debe ser un booleano(true o false)').optional().bail(),

        check('permissions')
        .isArray({ min: 0 })
        .withMessage('La lista de permisos debe ser un array').bail(),

        check('permissions.*')
        .isMongoId()
        .withMessage('Los permisos deben ser un ID válido').bail(),

        showErrors,
    ],
    roleGetValidator: [
        validateJwt,
        hasPermissionOrRole({ permission: "ver.rol" }),
        check("id", "No es un ID  válido").isMongoId().bail()
        .custom(existsRoleId),
        showErrors,
    ],
    rolesAllValidator: [
        validateJwt,
        hasPermissionOrRole({ permission: "ver.todos.roles" }),
        showErrors,
    ],
    roleDeleteValidator: [
        validateJwt,
        hasPermissionOrRole({ permission: "eliminar.rol" }),
        check("id", "No es un ID  válido").isMongoId().bail()
        .custom(existsRoleId),
        showErrors,

    ]
};