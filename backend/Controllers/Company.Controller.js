const Company = require("../Models/Company.Model");
const User = require("../Models/User.Model");
const catchAsync = require('../libs/catchAsync');
const ApiError = require('../libs/ApiError');

// Register Company
const registerCompany = catchAsync(async (req, res) => {
    const { name, industry, description, website, location, socialLinks, size } = req.body;

    // Check if company already exists
    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
        throw new ApiError(400, "A company with this name already exists");
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

    await User.findByIdAndUpdate(req.user._id, { companyId: company._id });

    res.status(201).json({
        success: true,
        message: "Company registered successfully",
        company
    });
});

// Get all companies
const getCompanies = catchAsync(async (req, res) => {
    const companies = await Company.find({ status: "active" }).populate("owner", "fullName email");
    res.status(200).json({ success: true, companies });
});

// Get company by ID
const getCompanyById = catchAsync(async (req, res) => {
    const company = await Company.findById(req.params.id).populate("owner", "fullName email");
    if (!company) {
        throw new ApiError(404, "Company not found");
    }
    res.status(200).json({ success: true, company });
});

// Update company
const updateCompany = catchAsync(async (req, res) => {
    let company = await Company.findById(req.params.id);

    if (!company) {
        throw new ApiError(404, "Company not found");
    }

    // Only owner or admin can update
    if (company.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        throw new ApiError(403, "Unauthorized to update this company");
    }

    const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        message: "Company updated successfully",
        company: updatedCompany
    });
});

const logger = require("../libs/logger");

// Delete company (Admin or Owner)
const deleteCompany = catchAsync(async (req, res) => {
    const company = await Company.findById(req.params.id);
    if (!company) {
        throw new ApiError(404, "Company not found");
    }

    // Authorization check
    if (company.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        throw new ApiError(403, "Unauthorized to delete this company");
    }

    await Company.findByIdAndDelete(req.params.id);
    // Remove companyId from user
    await User.findByIdAndUpdate(company.owner, { $unset: { companyId: 1 } });

    logger.info(`AUDIT: Company [${company.name}] (${company._id}) deleted by [${req.user.email}]`);

    res.status(200).json({
        success: true,
        message: "Company deleted successfully"
    });
});

module.exports = {
    registerCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
};
