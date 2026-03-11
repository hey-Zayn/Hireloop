const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
    institution: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    field: { type: String, required: true, trim: true },
    startYear: { type: Number, required: true },
    endYear: { type: Number },
    current: { type: Boolean, default: false }
});


const experienceSchema = new mongoose.Schema({
    company: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    current: { type: Boolean, default: false }
});


const projectSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    link: { type: String, trim: true },
    image: { type: String, trim: true },
    technologies: [String]
});


const certificationSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    issueDate: { type: Date },
    expiryDate: { type: Date },
    credentialId: { type: String, trim: true },
    url: { type: String, trim: true }
});

const candidateProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    phone: {
        type: String,
        trim: true,
        default: ""
    },
    headline: {

        type: String,
        required: [true, "Professional headline is required"],
        trim: true
    },
    bio: {
        type: String,
        trim: true,
        default: ""
    },
    cvUrl: {
        type: String,
        trim: true,
        default: ""
    },
    cvText: {
        type: String,
        trim: true,
        default: ""
    },
    skills: {
        type: [String],
        default: []
    },
    experienceYears: {
        type: Number,
        default: 0
    },
    location: {
        type: String,
        trim: true,
        default: ""
    },
    linkedIn: {
        type: String,
        trim: true,
        default: ""
    },
    github: {
        type: String,
        trim: true,
        default: ""
    },
    portfolio: {
        type: String,
        trim: true,
        default: ""
    },
    isOpenToWork: {
        type: Boolean,
        default: false
    },
    salaryExpected: {
        type: String,
        default: ""
    },
    experience: [experienceSchema],
    education: [educationSchema],
    projects: [projectSchema],
    certifications: [certificationSchema]
}, { timestamps: true });


// Add index for searching
candidateProfileSchema.index({ headline: 'text', skills: 'text', bio: 'text' });

const CandidateProfile = mongoose.model("CandidateProfile", candidateProfileSchema);

module.exports = CandidateProfile;