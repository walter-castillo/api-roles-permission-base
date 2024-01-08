const jwt = require("jsonwebtoken");
const User = require("../../models/user");

const validateJwt = async(req, res, next) => {
    let token;

    // Verificar si el token está presente en diferentes encabezados
    if (req.headers.bearer) token = req.headers.bearer;
    if (req.headers["x-token"]) token = req.headers["x-token"];
    if (req.headers.authorization) token = req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(401).json({ errors: [{ msg: "No se reconoce el token (token vacío)" }] });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETPRIVATEKEY);
        const user = await User.findById(uid).populate({
            path: "roles",
            model: "Role",
            select: 'role permissions',
            populate: {
                path: "permissions",
                model: "Permission",
                select: 'permission',
            },
        });

        if (!user) {
            return res.status(401).json({ errors: [{ msg: "Token no válido (usuario no existe)" }] });
        }

        if (!user.status) {
            return res.status(401).json({ errors: [{ msg: "Token no válido (usuario suspendido)" }] });
        }

        const uniquePermissions = new Set();
        const uniqueRoles = new Set();

        // Iteramos sobre los roles del usuario y agregamos los permisos y roles al conjunto
        user.roles.forEach((role) => {
            role.permissions.forEach((permission) => {
                uniquePermissions.add(permission.permission);
            });
            uniqueRoles.add(role.role);
        });

        const uniquePermissionsArray = Array.from(uniquePermissions).sort();
        const uniqueRolesArray = Array.from(uniqueRoles).sort();

        req.userToken = {
            name: user.name,
            email: user.email,
            phone: user.phone,
            superAdmin: user.superAdmin,
            permissions: uniquePermissionsArray.map(permission => permission),
            roles: uniqueRolesArray.map(role => role),
        };

        next();
    } catch (error) {
        return res.status(401).json({ errors: [{ msg: "Token inválido" }] });
    }
};
// Middleware para validar permisos y roles, usar siempre despued de validatejwt para usar el req.usertoken
const hasPermissionOrRole = (options) => {
    return (req, res, next) => {
        // Verificar si el usuario tiene el permiso específico
        const hasPermission = options.permission ?
            req.userToken &&
            req.userToken.permissions && req.userToken.permissions.includes(options.permission) :
            false;

        // Verificar si el usuario tiene el rol específico
        const hasRole = options.role ?
            req.userToken && req.userToken.roles && req.userToken.roles.includes(options.role) : false;

        // Si tiene el permiso o el rol, continuamos
        if (hasPermission || hasRole) {
            next();
        } else {
            return res.status(403).json({ errors: [{ msg: "No tiene los permisos o el rol necesarios" }] });
        }
    };
};

module.exports = { validateJwt, hasPermissionOrRole };