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
