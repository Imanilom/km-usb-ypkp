import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({

    name: { 
        type: String, 
        required: true },
    type: { 
        type: String, 
        required: true },
    organizationPicture: {
        type: String,
        default:
            'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg',
        },
}, { timestamps: true });

const Organization = mongoose.model('Organization', organizationSchema);

export default Organization;
