const { Schema, model } = require("mongoose");

const PermissionSchema = Schema({
    permission: { type: String, required: true, unique: true },
    description: { type: String },
    status: {
        type: Boolean,
        default: true,
    }
    // route: { type: String, unique: true }
});

module.exports = model("Permission", PermissionSchema)