const { Schema, model } = require("mongoose");

const UserSchema = Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
    },
    roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],

    status: {
        type: Boolean,
        default: true
    },
});

UserSchema.methods.toJSON = function() {
    const { password, _id, status, ...user } = this.toObject();
    user.uid = _id;
    return user;
};

module.exports = model("User", UserSchema)