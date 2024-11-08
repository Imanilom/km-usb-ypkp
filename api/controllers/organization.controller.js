import Organization from "../models/organization.model.js";
import User from "../models/user.model.js"; // Pastikan model User sudah tersedia untuk mengelola admin


// ambil organisasi

export const getOrganization = async (req, res, next) => {
    try {
      // Fetch users with the role 'admin' from the database
      const data_Organization = await Organization.find();
      res.status(200).json(data_Organization);
      console.log(data_Organization)
    } catch (error) {
      next(error);
    }
  };
// Tambah organisasi baru
export const addOrganization = async (req, res) => {
    try {
        const { name, type, organizationPicture } = req.body;

        const newOrganization = new Organization({
            name,
            type,
            organizationPicture
        });

        await newOrganization.save();
        res.status(201).json({ message: "Organization added successfully", organization: newOrganization });
    } catch (error) {
        res.status(500).json({ error: "Error adding organization" });
    }
};

// Update organisasi
export const updateOrganization = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, organizationPicture } = req.body;

        const organization = await Organization.findById(id);
        if (!organization) {
            return res.status(404).json({ error: "Organization not found" });
        }

        organization.name = name || organization.name;
        organization.type = type || organization.type;
        organization.organizationPicture = organizationPicture || organization.organizationPicture;

        await organization.save();
        res.json({ message: "Organization updated successfully", organization });
    } catch (error) {
        res.status(500).json({ error: "Error updating organization" });
    }
};

// Hapus organisasi
export const deleteOrganization = async (req, res) => {
    try {
        const { id } = req.params;

        const organization = await Organization.findById(id);
        if (!organization) {
            return res.status(404).json({ error: "Organization not found" });
        }

        await organization.remove();
        res.json({ message: "Organization deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting organization" });
    }
};

// Tambah admin untuk organisasi
export const addAdmin = async (req, res) => {
    try {
        const { email, name, organizationId } = req.body;

        // Validasi organisasi
        const organization = await Organization.findById(organizationId);
        if (!organization) {
            return res.status(404).json({ error: "Organization not found" });
        }

        // Membuat admin baru
        const admin = new User({
            email,
            name,
            role: "admin",
            organization: organizationId
        });

        await admin.save();
        res.status(201).json({ message: "Admin added successfully", admin });
    } catch (error) {
        res.status(500).json({ error: "Error adding admin" });
    }
};

// Update admin berdasarkan ID
export const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        const admin = await User.findById(id);
        if (!admin || admin.role !== "admin") {
            return res.status(404).json({ error: "Admin not found" });
        }

        admin.name = name || admin.name;
        admin.email = email || admin.email;

        await admin.save();
        res.json({ message: "Admin updated successfully", admin });
    } catch (error) {
        res.status(500).json({ error: "Error updating admin" });
    }
};

// Hapus admin berdasarkan ID
export const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const admin = await User.findById(id);
        if (!admin || admin.role !== "admin") {
            return res.status(404).json({ error: "Admin not found" });
        }

        await admin.remove();
        res.json({ message: "Admin deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting admin" });
    }
};

export const getAdminUsers = async (req, res, next) => {
    try {
      // Fetch users with the role 'admin' from the database
      const adminUsers = await User.find({ role: 'admin' });
      res.status(200).json(adminUsers);
    } catch (error) {
      next(error);
    }
  };