const Permission = require('../models/permission')

const permissionsAll = async(req, res) => {
    try {
        const [total, permission] = await Promise.all([
            Permission.countDocuments(),
            Permission.find().select('-__v')
        ]);
        res.json({ total, permission });
    } catch (error) { res.status(500).json({ error: 'Error en mostrar todos los permisos ' }) }
}

const permissionShow = async(req, res) => {
    try {
        const permission = await Permission.findById(req.params.id).select('-__v')
        res.json({ permission })
    } catch (error) { res.status(500).json({ error: 'Error al consultar el permiso' }) }
}

module.exports = {
    permissionsAll,
    permissionShow,
}