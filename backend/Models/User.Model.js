const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
        default: "",
    },
    avatar: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        enum: ['admin', 'hr', 'candidate'],
        default: 'candidate',
    },
    companyId: {
        type: String,
        required: false,
        default: "",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verifyToken: {
        type: String,
        required: false,
        default: "",
    },
    passwordResetToken: {
        type: String,
        required: false,
        default: "",
    },
    passwordResetExpiry: {
        type: Date,
        required: false,
        default: null,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    }

}, { timestamps: true });

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', UserSchema);


module.exports = User;