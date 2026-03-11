const CandidateProfile = require("../Models/Candidate.Profiles.Model");

/**
 * @desc    Get current user's candidate profile
 * @route   GET /api/v1/candidates/profile
 * @access  Private
 */
exports.getProfile = async (req, res, next) => {
    try {
        const profile = await CandidateProfile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create or Update candidate profile
 * @route   POST /api/v1/candidates/profile
 * @access  Private
 */
exports.upsertProfile = async (req, res, next) => {
    try {
        const profileData = {
            ...req.body,
            phone: req.body.phone,
            userId: req.user._id
        };


        // Use findOneAndUpdate with upsert to create or update
        const profile = await CandidateProfile.findOneAndUpdate(
            { userId: req.user._id },
            { $set: profileData },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: profile
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Add education entry
 * @route   POST /api/v1/candidates/education
 * @access  Private
 */
exports.addEducation = async (req, res, next) => {
    try {
        const profile = await CandidateProfile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found. Please create a profile first."
            });
        }

        profile.education.unshift(req.body);
        await profile.save();

        res.status(201).json({
            success: true,
            message: "Education added successfully",
            data: profile.education
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update education entry
 * @route   PUT /api/v1/candidates/education/:id
 * @access  Private
 */
exports.updateEducation = async (req, res, next) => {
    try {
        const profile = await CandidateProfile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        const educationIndex = profile.education.findIndex(
            (edu) => edu._id.toString() === req.params.id
        );

        if (educationIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Education entry not found"
            });
        }

        profile.education[educationIndex] = {
            ...profile.education[educationIndex]._doc,
            ...req.body
        };

        await profile.save();

        res.status(200).json({
            success: true,
            message: "Education updated successfully",
            data: profile.education
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete education entry
 * @route   DELETE /api/v1/candidates/education/:id
 * @access  Private
 */
exports.deleteEducation = async (req, res, next) => {
    try {
        const profile = await CandidateProfile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        profile.education = profile.education.filter(
            (edu) => edu._id.toString() !== req.params.id
        );

        await profile.save();

        res.status(200).json({
            success: true,
            message: "Education deleted successfully",
            data: profile.education
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Add experience entry
 * @route   POST /api/v1/candidates/experience
 * @access  Private
 */
exports.addExperience = async (req, res, next) => {
    try {
        const profile = await CandidateProfile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found. Please create a profile first."
            });
        }

        profile.experience.unshift(req.body);
        await profile.save();

        res.status(201).json({
            success: true,
            message: "Experience added successfully",
            data: profile.experience
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update experience entry
 * @route   PUT /api/v1/candidates/experience/:id
 * @access  Private
 */
exports.updateExperience = async (req, res, next) => {
    try {
        const profile = await CandidateProfile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        const experienceIndex = profile.experience.findIndex(
            (exp) => exp._id.toString() === req.params.id
        );

        if (experienceIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Experience entry not found"
            });
        }

        profile.experience[experienceIndex] = {
            ...profile.experience[experienceIndex]._doc,
            ...req.body
        };

        await profile.save();

        res.status(200).json({
            success: true,
            message: "Experience updated successfully",
            data: profile.experience
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete experience entry
 * @route   DELETE /api/v1/candidates/experience/:id
 * @access  Private
 */
exports.deleteExperience = async (req, res, next) => {
    try {
        const profile = await CandidateProfile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        profile.experience = profile.experience.filter(
            (exp) => exp._id.toString() !== req.params.id
        );

        await profile.save();

        res.status(200).json({
            success: true,
            message: "Experience deleted successfully",
            data: profile.experience
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Upload candidate resume
 * @route   POST /api/v1/candidates/resume/upload
 * @access  Private
 */
exports.uploadResume = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a file"
            });
        }

        const cloudinary = require("../Config/Cloudinary/cloudinary");
        const profile = await CandidateProfile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        // Upload to Cloudinary using buffer
        const streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    { 
                        folder: "hireloop/resumes",
                        resource_type: "auto"
                    },
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                stream.end(req.file.buffer);
            });
        };

        const result = await streamUpload(req);

        profile.cvUrl = result.secure_url;
        await profile.save();

        res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            data: {
                cvUrl: profile.cvUrl
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Add portfolio project
 * @route   POST /api/v1/candidates/project
 * @access  Private
 */
exports.addProject = async (req, res, next) => {
    try {
        const profile = await CandidateProfile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        const projectData = { ...req.body };

        if (req.file) {
            const cloudinary = require("../Config/Cloudinary/cloudinary");
            const streamUpload = (req) => {
                return new Promise((resolve, reject) => {
                    let stream = cloudinary.uploader.upload_stream(
                        { folder: "hireloop/projects" },
                        (error, result) => {
                            if (result) resolve(result);
                            else reject(error);
                        }
                    );
                    stream.end(req.file.buffer);
                });
            };
            const result = await streamUpload(req);
            projectData.image = result.secure_url;
        }

        if (typeof projectData.technologies === 'string') {
            projectData.technologies = projectData.technologies.split(',').map(s => s.trim());
        }

        profile.projects.unshift(projectData);
        await profile.save();

        res.status(201).json({
            success: true,
            message: "Project added successfully",
            data: profile.projects
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update portfolio project
 * @route   PUT /api/v1/candidates/project/:id
 * @access  Private
 */
exports.updateProject = async (req, res, next) => {
    try {
        const profile = await CandidateProfile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        const projectIndex = profile.projects.findIndex(p => p._id.toString() === req.params.id);

        if (projectIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        const projectData = { ...req.body };

        if (req.file) {
            const cloudinary = require("../Config/Cloudinary/cloudinary");
            const streamUpload = (req) => {
                return new Promise((resolve, reject) => {
                    let stream = cloudinary.uploader.upload_stream(
                        { folder: "hireloop/projects" },
                        (error, result) => {
                            if (result) resolve(result);
                            else reject(error);
                        }
                    );
                    stream.end(req.file.buffer);
                });
            };
            const result = await streamUpload(req);
            projectData.image = result.secure_url;
        }

        if (projectData.technologies && typeof projectData.technologies === 'string') {
            projectData.technologies = projectData.technologies.split(',').map(s => s.trim());
        }

        profile.projects[projectIndex] = {
            ...profile.projects[projectIndex]._doc,
            ...projectData
        };

        await profile.save();

        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: profile.projects
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete portfolio project
 * @route   DELETE /api/v1/candidates/project/:id
 * @access  Private
 */
exports.deleteProject = async (req, res, next) => {
    try {
        const profile = await CandidateProfile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        profile.projects = profile.projects.filter(p => p._id.toString() !== req.params.id);
        await profile.save();

        res.status(200).json({
            success: true,
            message: "Project deleted successfully",
            data: profile.projects
        });
    } catch (error) {
        next(error);
    }
};


/**
 * @desc    Upload profile banner
 * @route   POST /api/v1/candidates/banner/upload
 * @access  Private
 */
exports.uploadBanner = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image"
            });
        }

        const cloudinary = require("../Config/Cloudinary/cloudinary");
        const profile = await CandidateProfile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        const streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    { folder: "hireloop/banners" },
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );
                stream.end(req.file.buffer);
            });
        };

        const result = await streamUpload(req);

        profile.banner = result.secure_url;
        await profile.save();

        res.status(200).json({
            success: true,
            message: "Banner uploaded successfully",
            data: { banner: profile.banner }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete profile banner
 * @route   DELETE /api/v1/candidates/banner
 * @access  Private
 */
exports.deleteBanner = async (req, res, next) => {
    try {
        const profile = await CandidateProfile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        profile.banner = "";
        await profile.save();

        res.status(200).json({
            success: true,
            message: "Banner deleted successfully",
            data: { banner: "" }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete candidate resume
 * @route   DELETE /api/v1/candidates/resume
 * @access  Private
 */
exports.deleteResume = async (req, res, next) => {
    try {
        const profile = await CandidateProfile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        profile.cvUrl = "";
        await profile.save();

        res.status(200).json({
            success: true,
            message: "Resume deleted successfully",
            data: { cvUrl: "" }
        });
    } catch (error) {
        next(error);
    }
};
