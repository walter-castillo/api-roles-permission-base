const { Router } = require('express');
const router = Router();
const { permissionShow, permissionsAll } = require("../controllers/permission");
const { permissionGetValidator, permissionsAllValidator } = require("../middlewares/permissionRouteMiddlewares");

router.get('/', permissionsAllValidator, permissionsAll);
router.get('/:id', permissionGetValidator, permissionShow);

module.exports = router