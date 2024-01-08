const { Schema, model } = require("mongoose");

const RoleSchema = Schema({
    role: { type: String, required: true, sparse: true, unique: true },
    description: { type: String },
    status: {
        type: Boolean,
        default: true,
    },
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
});

RoleSchema.methods.toJSON = function() {
    const roleObject = this.toObject();
    delete roleObject.__v;
    return roleObject;
};

module.exports = model("Role", RoleSchema)