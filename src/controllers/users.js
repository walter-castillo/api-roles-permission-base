const bcrypt = require('bcryptjs');
const User = require('../models/user')

const usersAll = async(req, res) => {
    const { limit = 25, from = 0 } = req.query;
    try {
        const [total, users] = await Promise.all([
            User.countDocuments(),
            User.find().skip(Number(from)).limit(Number(limit))
            .populate({
                path: 'roles',
                model: 'Role',
                select: 'role', // Seleccionar solo el campo 'name' de los roles
                populate: {
                    path: 'permissions',
                    model: 'Permission',
                    select: 'permission', // Seleccionar solo el campo 'name' de los permisos
                }
            })
        ]);
        res.json({ total, users });
    } catch (error) { res.status(500).json({ error: '' }) }
}

const userCreate = async(req, res) => {
    const { name, email, password, img, phone } = req.body;
    try {
        const user = new User({ name, email, password, img, phone });
        user.password = bcrypt.hashSync(password, bcrypt.genSaltSync());
        await user.save();
        res.status(201).json({ user });
    } catch (error) { res.status(500).json({ error: '' }) }
}

const userShow = async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.json({ user })
    } catch (error) { res.status(500).json({ error: '' }) }
}

const userUpdate = async(req, res) => {
    const { _id, password, email, ...userUpdate } = req.body;
    try {
        if (password) userUpdate.password = bcrypt.hashSync(password, bcrypt.genSaltSync());
        const user = await User.findByIdAndUpdate(req.params.id, userUpdate, { new: true });
        res.json({ msg: `El id: ${user.name}, fue actualizado`, user });
    } catch (error) { res.status(500).json({ error: '' }) }
}

const userDelete = async(req, res) => {

    try {
        const userDeleted = await User.findByIdAndUpdate(req.params.id, { status: false }, { new: true });
        res.json({ msg: `El id: ${userDeleted.id}, fue eliminado` });
    } catch (error) { res.status(500).json({ error: '' }) }
}

module.exports = {
    usersAll,
    userShow,
    userCreate,
    userUpdate,
    userDelete,
}