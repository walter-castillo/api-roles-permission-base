const { Router } = require('express');
const router = Router();
const { usersAll, userShow, userCreate, userUpdate, userDelete } = require("../controllers/users");
const { userUpdateValidator, userCreateValidator, userGetValidator, usersAllValidator, userDeleteValidator } = require("../middlewares/userRouteMiddlewares");

router.get('/', usersAllValidator, usersAll);
router.get('/:id', userGetValidator, userShow);
router.post('/', userCreateValidator, userCreate);
router.put('/:id', userUpdateValidator, userUpdate);
router.delete('/:id', userDeleteValidator, userDelete);

module.exports = router