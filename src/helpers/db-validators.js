const User = require("../models/user");
const Role = require("../models/role");
const Permission = require("../models/permission");

const existsEmail = async(email) => {
    const existsEmail = await User.findOne({ email });
    if (existsEmail) throw new Error(`El correo ${email} ya existe en la BD`)
};

const existsUserId = async(id) => {
    const existsUser = await User.findById(id);
    if (!existsUser) throw new Error(`El user con el id ${id} no existe en la BD`);
};

const passwordConfirmation = async(passwordConfirmation, { req }) => {
    if (passwordConfirmation !== req.body.password) {
        throw new Error('Las contraseña no coinciden')
    }
};

// validate role
const existsRole = async(role) => {
    const existsRole = await Role.findOne({ role });
    if (existsRole) throw new Error(`El rol ${role} ya existe en la BD`);
};
const existsRoleId = async(id) => {
    const existsRole = await Role.findById(id);
    if (!existsRole) throw new Error(`El rol con el id ${id} no existe en la BD`);
}
const existsPermisionId = async(id) => {
    const existsPermision = await Permission.findById(id);
    if (!existsPermision) throw new Error(`El permiso con el id ${id} no existe en la BD`);
}


module.exports = {
    existsEmail,
    existsUserId,
    passwordConfirmation,
    existsRole,
    existsRoleId,
    existsPermisionId
}