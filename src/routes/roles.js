const { Router } = require('express');
const router = Router();
const { rolesAll, roleShow, roleCreate, roleUpdate, roleDelete } = require("../controllers/roles");
const { roleUpdateValidator, roleCreateValidator, roleGetValidator, rolesAllValidator, roleDeleteValidator } = require("../middlewares/roleRouteMiddlewares");

router.get('/', rolesAllValidator, rolesAll);
router.get('/:id', roleGetValidator, roleShow);
router.post('/', roleCreateValidator, roleCreate);
router.put('/:id', roleUpdateValidator, roleUpdate);
router.delete('/:id', roleDeleteValidator, roleDelete);

module.exports = router