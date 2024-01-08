const Role = require('../models/role')

const rolesAll = async(req, res) => {
    try {
        const [total, roles] = await Promise.all([
            Role.countDocuments(),
            Role.find().populate({ path: 'permissions', model: 'Permission', select: 'permission' }).select('-__v')
        ]);
        res.json({ total, roles });
    } catch (error) { res.status(500).json({ error: 'Error en mostrar todos los roles ' }) }
}

const roleCreate = async(req, res) => {
    try {
        const { role, description, permissions } = req.body;
        const roleNew = new Role({ role, description, permissions })
        await roleNew.save();
        res.status(201).json({ role: roleNew });
    } catch (error) { res.status(500).json({ error: 'Error en crear un rol' }) }
}

const roleShow = async(req, res) => {
    try {
        const role = await Role.findById(req.params.id).populate({ path: 'permissions', model: 'Permission', select: 'permission' }).select('-__v')
        res.json({ role })
    } catch (error) { res.status(500).json({ error: 'Error al consultar el rol' }) }
}

const roleUpdate = async(req, res) => {
    try {
        const { role, description, status, permissions } = req.body;
        const roleUpdate = await Role.findByIdAndUpdate(req.params.id, { role, description, status, permissions }, { new: true }).select('-__v');
        res.json({ msg: `El rol ${roleUpdate.role}, fue actualizado`, role: roleUpdate });
    } catch (error) { res.status(500).json({ error: 'Error en la actualización del rol' }) }
}

const roleDelete = async(req, res) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        res.json({ msg: `El rol ${role.role} fue eliminado` });
    } catch (error) { res.status(500).json({ error: 'Error en eliminar un rol' }) }
}

module.exports = {
    rolesAll,
    roleShow,
    roleCreate,
    roleUpdate,
    roleDelete,
}