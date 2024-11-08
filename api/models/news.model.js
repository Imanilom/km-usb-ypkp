import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true },
    content: { type: 
        String, 
        required: true },
    organization: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Organization" },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" },
    newsPicture: {
        type: Array,
        required: true },
    date: { 
        type: Date, 
        default: Date.now }
}, { timestamps: true });

const News = mongoose.model('News', newsSchema);

export default News;

