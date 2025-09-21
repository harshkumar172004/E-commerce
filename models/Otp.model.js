import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 10 * 60 * 1000) // OTP valid for 5 minutes
    },

},{timestamps: true})

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Automatically remove expired OTPs

const OtpModel = mongoose.models.OTP || mongoose.model('OTP', otpSchema,'otps');
export default OtpModel;