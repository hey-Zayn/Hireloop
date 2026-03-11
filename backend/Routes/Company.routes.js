const express = require("express");
const router = express.Router();
const {
    registerCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
} = require("../Controllers/Company.Controller");
const { isAuthenticated, authorizeRoles } = require("../Middlewares/Auth.Middleware");
const isVerified = require("../Middlewares/Verified.Middleware");

// Public/Authenticated retrieval
router.route("/all").get(getCompanies);
router.route("/:id").get(getCompanyById);

// Restricted operations
router.route("/register").post(
    isAuthenticated,
    authorizeRoles("hr", "admin"),
    isVerified,
    registerCompany
);

router.route("/update/:id").put(
    isAuthenticated,
    authorizeRoles("hr", "admin"),
    updateCompany
);

router.route("/delete/:id").delete(
    isAuthenticated,
    authorizeRoles("admin"),
    deleteCompany
);

module.exports = router;
