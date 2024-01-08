const User = require('../models/user')
const bcrypt = require("bcryptjs");
const Role = require('../models/role')
const Permission = require('../models/permission')



async function loadRoles() {
    try {
        const roleCount = await Role.countDocuments();
        if (roleCount === 0) {
            console.log('Cargando roles...');
            const rolesToCreate = [
                { role: "Super-Administrador", description: "todos los permisos" },
                { role: "Administrador", description: "con casi todos los permisos" },
                { role: "Medico", description: "solo permisos para ver todos los estudios" },
                { role: "Paciente", description: "permisos solo ver su perfil y estudios" }
            ];

            await Promise.all(rolesToCreate.map(role => new Role(role).save()));
            console.log('Roles cargados exitosamente.');
        } else { console.log('Roles ya existen en la base de datos.') }
    } catch (error) { console.error('Error al cargar roles:', error) }
}

async function loadPermissions() {
    try {
        const permissionCount = await Permission.countDocuments();

        if (permissionCount === 0) {
            console.log('Cargando permisos...');
            const permissionsToCreate = [
                // crear permisos modelo user
                { permission: 'crear.usuario', description: 'crear un usuario' },
                { permission: 'actualizar.usuario', description: 'actualizar  un usuario' },
                { permission: 'ver.usuario', description: 'ver  un usuario' },
                { permission: 'ver.todos.usuarios', description: 'ver todos los usuario' },
                { permission: 'eliminar.usuario', description: 'Eliminar un usuario' },


                // crear permisos modelo study
                { permission: 'crear.studio', description: 'crear un estudio' },
                { permission: 'actualizar.studio', description: 'actualizar un estudio' },
                { permission: 'ver.studio', description: 'ver un estudio' },
                { permission: 'ver.todos.studios', description: 'ver todos los estudios' },
                { permission: 'eliminar.studio', description: 'eliminar un estudio' },

                // crear permisos modelo role
                { permission: 'crear.rol', description: 'crear un rol' },
                { permission: 'actualizar.rol', description: 'actualizar un rol' },
                { permission: 'ver.rol', description: 'cer un rol' },
                { permission: 'ver.todos.roles', description: 'ver todos los roles' },
                { permission: 'eliminar.rol', description: 'eliminar un rol' },

                // crear permisos modelo permission  
                // { permission: 'actualizar.permiso', description: 'actualizar un permiso' },
                { permission: 'ver.permiso', description: 'ver un permiso' },
                { permission: 'ver.todos.permisos', description: 'ver todos permisos' },
            ];

            await Promise.all(permissionsToCreate.map(permission => new Permission(permission).save()));
            console.log('Permisos cargados exitosamente.');
            asignarPermisosIniciales(); // Asignar permisos iniciales al rol "Medico" y "Administrador"
            // Llamar a la función para agregar usuarios
            agregarUsuariosConRoles();

        } else { console.log('Permisos ya existen en la base de datos.') }
    } catch (error) {
        console.error('Error al cargar permisos:', error);
    }
}

async function asignarPermisosIniciales() {
    try {
        console.log('Asignando permisos iniciales a roles...');

        // Obtener el rol "Administrador" y "Medico"
        const administrador = await Role.findOne({ role: 'Administrador' });
        const medico = await Role.findOne({ role: 'Medico' });

        if (administrador) {
            // Asignar todos los permisos al rol "Administrador"
            administrador.permissions = await Permission.find().distinct('_id');
            await administrador.save();
            console.log('Permisos asignados al rol "Administrador".');
        } else { console.log('El rol "Administrador" no fue encontrado.') }

        if (medico) {
            // Asignar solo el permiso 'ver.todos.studios' al rol "Medico"
            const verTodosStudios = await Permission.findOne({ permission: 'ver.todos.studios' });
            if (verTodosStudios) {
                medico.permissions = [verTodosStudios._id];
                await medico.save();
                console.log('Permiso asignado al rol "Medico".');
            } else { console.log('El permiso "ver.todos.studios" no fue encontrado.') }
        } else { console.log('El rol "Medico" no fue encontrado.') }

        console.log('Asignación de permisos completada.');
    } catch (error) { console.error('Error al asignar permisos:', error) }
}

// Función para obtener roles aleatorios
async function obtenerRolesAleatorios(cantidad) {
    const rolesExcluidos = ['Super-Administrador']; // Roles que deseas excluir

    // Obtener roles excluyendo los roles especificados
    const roles = await Role.find({ role: { $nin: rolesExcluidos } });
    const rolesAleatorios = [];

    for (let i = 0; i < cantidad; i++) {
        const indiceAleatorio = Math.floor(Math.random() * roles.length);
        rolesAleatorios.push(roles[indiceAleatorio]);
    }

    return rolesAleatorios;
}

// Función para agregar 10 usuarios con roles aleatorios
async function agregarUsuariosConRoles() {
    try {
        // Agregar 10 usuarios con roles aleatorios
        for (let i = 1; i <= 10; i++) {
            const rolesAleatorios = await obtenerRolesAleatorios(Math.floor(Math.random() * 3) + 1); // Asignar entre 1 y 3 roles aleatorios

            const usuario = new User({
                name: `Usuario${i}`,
                email: `email${i}@email.com`,
                phone: `123456789${i}`,
                password: bcrypt.hashSync('123123Abc', bcrypt.genSaltSync()),
                roles: rolesAleatorios.map(rol => rol._id),
            });
            await usuario.save();
        }

        console.log('Usuarios con roles agregados exitosamente.');
    } catch (error) {
        console.error('Error al agregar usuarios con roles:', error);
    }
}

module.exports = { loadRoles, loadPermissions };