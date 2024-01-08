// Middleware para validar permisos y roles, usar siempre despued de validatejwt para usar el req.usertoken
const hasPermissionOrRole = (options) => {
    return (req, res, next) => {
        // Verificar si el usuario tiene el permiso específico
        const hasPermission = options.permission ?
            req.userToken &&
            req.userToken.permissions && req.userToken.permissions.includes(options.permission) :
            false;

        // Verificar si el usuario tiene el rol específico
        const hasRole = options.role ? req.userToken && req.userToken.roles && req.userToken.roles.includes(options.role) : false;

        // Si tiene el permiso o el rol, continuamos
        if (hasPermission || hasRole) {
            next();
        } else {
            return res.status(403).json({ errors: [{ msg: "No tiene los permisos o el rol necesarios" }] });
        }
    };
};

module.exports = { hasPermissionOrRole };