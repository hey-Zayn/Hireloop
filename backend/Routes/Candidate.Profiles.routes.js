const express = require("express");
const {
    addExperience,
    updateExperience,
    deleteExperience,
    uploadResume,
    addProject,
    updateProject,
    deleteProject,
    addEducation,
    updateEducation,
    deleteEducation,
    getProfile,
    upsertProfile
} = require("../Controllers/Candidate.Profiles.Controller");

const { isAuthenticated } = require("../Middlewares/auth.middleware");

const router = express.Router();

const upload = require("../Middlewares/upload.middleware");

// Apply authentication to all routes
router.use(isAuthenticated);


// Profile CRUD
router.get("/profile", getProfile);
router.post("/profile", upsertProfile);
router.post("/resume/upload", upload.single("resume"), uploadResume);


// Education CRUD
router.post("/education", addEducation);
router.put("/education/:id", updateEducation);
router.delete("/education/:id", deleteEducation);

// Experience CRUD
router.post("/experience", addExperience);
router.put("/experience/:id", updateExperience);
router.delete("/experience/:id", deleteExperience);

// Project CRUD
router.post("/project", upload.single("image"), addProject);
router.put("/project/:id", upload.single("image"), updateProject);
router.delete("/project/:id", deleteProject);


module.exports = router;
