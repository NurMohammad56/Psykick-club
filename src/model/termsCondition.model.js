import mongoose, {Schema} from 'mongoose';

const termsConditionSchema = new Schema(
    {
        content: {
            type: String,
        }
    }, {timestamps: true}
);

export const TermsCondition = mongoose.model('TermsCondition', termsConditionSchema);