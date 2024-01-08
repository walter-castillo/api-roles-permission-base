process.env.MONGODB_CNN
const express = require('express')
const app = express()
const cors = require("cors")

const { loadRoles, loadPermissions } = require('./src/database/loadCollections')
const { dbConnection } = require('./src/database/config')

const auth = require('./src/routes/auth')

const users = require('./src/routes/users')
const roles = require('./src/routes/roles')
const permissions = require('./src/routes/permissions')


app.use(cors());
dbConnection();
app.use(express.json());

app.use('/api/permission', permissions);
app.use('/api/user', users);
app.use('/api/role', roles);
app.use('/api/auth', auth);

app.listen(process.env.PORT, () => console.log(`Serevidor corriendo en el puerto ${process.env.PORT}, ${process.env.URL}:${process.env.PORT}`));
loadPermissions();
loadRoles();