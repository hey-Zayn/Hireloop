const express = require("express");
const {
    getProfile,
    upsertProfile,
    addEducation,
    updateEducation,
    deleteEducation,
    addExperience,
    updateExperience,
    deleteExperience
} = require("../Controllers/Candidate.Profiles.Controller");
const { isAuthenticated } = require("../Middlewares/auth.middleware");

const router = express.Router();

// Apply authentication to all routes
router.use(isAuthenticated);

// Profile CRUD
router.get("/profile", getProfile);
router.post("/profile", upsertProfile);

// Education CRUD
router.post("/education", addEducation);
router.put("/education/:id", updateEducation);
router.delete("/education/:id", deleteEducation);

// Experience CRUD
router.post("/experience", addExperience);
router.put("/experience/:id", updateExperience);
router.delete("/experience/:id", deleteExperience);

module.exports = router;
