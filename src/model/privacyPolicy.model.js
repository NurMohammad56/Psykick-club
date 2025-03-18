import mongoose, {Schema} from 'mongoose';

const privacyPolicySchema = new Schema(
    {
        content: {
            type: String,
        }
    }, {timestamps: true}
);

export const PrivacyPolicy = mongoose.model('PrivacyPolicy', privacyPolicySchema);