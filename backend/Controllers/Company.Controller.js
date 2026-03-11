const Company = require("../Models/Company.Model");
const User = require("../Models/User.Model");

// Register Company
const registerCompany = async (req, res) => {
    try {
        const { name, industry, description, website, location, socialLinks, size } = req.body;

        if (!name || !industry || !description || !website || !location || !size) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const slug = name.toLowerCase().split(" ").join("-") + "-" + Date.now();

        const company = await Company.create({
            name,
            slug,
            industry,
            description,
            website,
            location,
            socialLinks,
            size,
            owner: req.user._id
        });

        // Update user to have this company (if needed, or just link by owner)
        // Optionally update req.user.companyId if it's a field in User model
        await User.findByIdAndUpdate(req.user._id, { companyId: company._id });

        res.status(201).json({
            success: true,
            message: "Company registered successfully",
            company
        });
    } catch (error) {
        console.error("Register Company Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get all companies
const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find({ status: "active" }).populate("owner", "fullName email");
        res.status(200).json({ success: true, companies });
    } catch (error) {
        console.error("Get Companies Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get company by ID
const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id).populate("owner", "fullName email");
        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }
        res.status(200).json({ success: true, company });
    } catch (error) {
        console.error("Get Company ID Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Update company
const updateCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }

        // Only owner or admin can update
        if (company.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Unauthorized to update this company" });
        }

        const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.status(200).json({
            success: true,
            message: "Company updated successfully",
            company: updatedCompany
        });
    } catch (error) {
        console.error("Update Company Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Delete company (Admin only)
const deleteCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }

        await Company.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Company deleted successfully"
        });
    } catch (error) {
        console.error("Delete Company Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    registerCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
};
