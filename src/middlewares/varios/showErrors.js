const { validationResult } = require("express-validator");

const showErrors = (req, res, next) => {
    const errorFormatter = ({ msg, param }) => { return { msg, param } };
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) { return res.status(400).json({ errors: errors.array() }) }
    next();
}




module.exports = { showErrors };