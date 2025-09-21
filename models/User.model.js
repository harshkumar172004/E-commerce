import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user'],
        default: 'user'
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email:
    {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false
    },
    avatar: {
        url: {
            type: String,
            trim: true
        },
        public_id: {
            type: String,
            trim: true
        },
    },
    isEmailVarified: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true
    },
    // updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    // Hash the password before saving
    this.password = await bcrypt.hash(this.password, 10);


    next();
});


userSchema.methods = {
    comparePassword: async function (password) {
        return await bcrypt.compare(password, this.password);
    }
}

const UserModel = mongoose.models.User || mongoose.model('User', userSchema, 'users');
export default UserModel;