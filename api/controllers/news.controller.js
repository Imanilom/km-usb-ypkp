import News from '../models/news.model.js';
import Organization from '../models/organization.model.js';

// Menambahkan berita baru
export const addNews = async (req, res) => {
    try {
        const { title, content, organizationId, newsPicture } = req.body;
        const author = req.user.userId;

        // Validasi organisasi
        const organization = await Organization.findById(organizationId);
        if (!organization) {
            return res.status(404).json({ error: "Organization not found" });
        }

        // Membuat berita baru
        const news = new News({
            title,
            content,
            organization: organizationId,
            author,
            newsPicture, // Menyimpan gambar berita
        });

        await news.save();
        res.status(201).json({ message: "News added successfully", news });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error adding news" });
    }
};

// Memperbarui berita berdasarkan ID
export const updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, newsPicture } = req.body;

        // Cari berita berdasarkan ID
        const news = await News.findById(id);
        if (!news) {
            return res.status(404).json({ error: "News not found" });
        }

        // Hanya penulis atau admin yang bisa memperbarui berita
        if (news.author.toString() !== req.user.userId && req.user.role !== "superadmin") {
            return res.status(403).json({ error: "Unauthorized to update this news" });
        }

        // Update berita
        news.title = title || news.title;
        news.content = content || news.content;
        news.newsPicture = newsPicture || news.newsPicture; // Memperbarui gambar berita jika ada
        await news.save();

        res.json({ message: "News updated successfully", news });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating news" });
    }
};

// Menghapus berita berdasarkan ID
export const deleteNews = async (req, res) => {
    try {
        const { id } = req.params;

        // Cari berita berdasarkan ID
        const news = await News.findById(id);
        if (!news) {
            return res.status(404).json({ error: "News not found" });
        }

        // Hanya penulis atau admin yang bisa menghapus berita
        if (news.author.toString() !== req.user.userId && req.user.role !== "superadmin") {
            return res.status(403).json({ error: "Unauthorized to delete this news" });
        }

        await news.remove();
        res.json({ message: "News deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error deleting news" });
    }
};

// Mendapatkan berita berdasarkan organisasi
export const getNewsByOrganization = async (req, res) => {
    try {
        const { organizationId } = req.params;

        // Validasi organisasi
        const organization = await Organization.findById(organizationId);
        if (!organization) {
            return res.status(404).json({ error: "Organization not found" });
        }

        // Dapatkan berita dari organisasi tertentu
        const news = await News.find({ organization: organizationId }).populate("author", "name email");
        res.json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching news" });
    }
};