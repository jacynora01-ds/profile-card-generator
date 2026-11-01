const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const Profile = require("./models/Profile");
const cloudinary = require("./config/cloudinary");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// Cloudinary image storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,

    params: async (req, file) => ({
        folder: "profile-card-generator",

        public_id:
            Date.now() + "-" + Math.round(Math.random() * 1E9),

        allowed_formats: ["jpg", "jpeg", "png", "webp"]
    })
});

// Multer configuration
const upload = multer({
    storage: storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed."));
        }
    }
});

// HTML security
function escapeHTML(text) {
    return String(text || "").replace(/[&<>"']/g, char => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[char];
    });
}

// Safe social links
function safeUrl(url) {
    if (!url) return "";

    try {
        const parsed = new URL(url);

        if (parsed.protocol === "https:" || parsed.protocol === "http:") {
            return escapeHTML(parsed.href);
        }

        return "";
    } catch {
        return "";
    }
}

// Create Profile
app.post("/create-profile", upload.single("profileImage"), async (req, res) => {
    try {
        const {
            name,
            bio,
            skills,
            linkedin,
            github,
            instagram
        } = req.body;

        if (!name || !bio || !skills) {
            return res.status(400).send("Please fill in all required fields.");
        }

        const skillList = skills
            .split(",")
            .map(skill => skill.trim())
            .filter(skill => skill !== "");

        const profile = new Profile({
            name,
            bio,
            skills: skillList,

            profileImage: req.file
                ? req.file.path
                : "",

            linkedin,
            github,
            instagram
        });

        await profile.save();

        res.redirect("/profile/" + profile._id);

    } catch (error) {
        console.error("Profile Creation Error:", error);
        res.status(500).send("Error creating profile.");
    }
});

// Display Profile
app.get("/profile/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send("Invalid profile ID.");
        }

        const profile = await Profile.findById(req.params.id);

        if (!profile) {
            return res.status(404).send("Profile not found.");
        }

        const initial = escapeHTML(
            profile.name.charAt(0).toUpperCase()
        );

        const imageSection = profile.profileImage
            ? `<img src="${escapeHTML(profile.profileImage)}" class="profile-image" alt="Profile Picture">`
            : `<div class="avatar">${initial}</div>`;

        const skillsHTML = profile.skills
            .map(skill => `<span>${escapeHTML(skill)}</span>`)
            .join("");

        const socialLinks = [
            ["LinkedIn", safeUrl(profile.linkedin)],
            ["GitHub", safeUrl(profile.github)],
            ["Instagram", safeUrl(profile.instagram)]
        ];

        const socialHTML = socialLinks
            .filter(item => item[1])
            .map(item =>
                `<a href="${item[1]}" target="_blank" rel="noopener noreferrer">${item[0]}</a>`
            )
            .join("");

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${escapeHTML(profile.name)} | Profile Studio</title>

                <style>
                    * {
                        box-sizing: border-box;
                    }

                    body {
                        margin: 0;
                        padding: 40px 20px;
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-family: Arial, sans-serif;
                        background: #080b16;
                        color: white;
                    }

                    .card {
                        width: 100%;
                        max-width: 430px;
                        padding: 35px;
                        text-align: center;
                        border-radius: 22px;
                        background: #171f38;
                        border: 1px solid #55418b;
                    }

                    .avatar, .profile-image {
                        width: 110px;
                        height: 110px;
                        border-radius: 50%;
                        margin: 0 auto 20px;
                    }

                    .avatar {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 40px;
                        font-weight: bold;
                        background: linear-gradient(135deg, #8b5cf6, #06b6d4);
                    }

                    .profile-image {
                        display: block;
                        object-fit: cover;
                        border: 3px solid #8b5cf6;
                    }

                    h1 {
                        font-size: 26px;
                    }

                    p {
                        color: #b8c2d9;
                        line-height: 1.7;
                    }

                    .skills, .social {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                        gap: 9px;
                        margin-top: 20px;
                    }

                    .skills span, .social a {
                        padding: 9px 13px;
                        border-radius: 20px;
                        font-size: 12px;
                        text-decoration: none;
                        background: #29234d;
                        color: #c4b5fd;
                    }

                    .social a:hover {
                        background: #49368a;
                    }
                </style>
            </head>

            <body>
                <div class="card">
                    ${imageSection}

                    <h1>${escapeHTML(profile.name)}</h1>

                    <p>${escapeHTML(profile.bio)}</p>

                    <div class="skills">
                        ${skillsHTML}
                    </div>

                    <div class="social">
                        ${socialHTML}
                    </div>
                </div>
            </body>
            </html>
        `);

    } catch (error) {
        console.error("Profile Display Error:", error);
        res.status(500).send("Unable to display profile.");
    }
});

// Upload error handler
app.use((err, req, res, next) => {
    console.error("Upload Error:", err.message);
    res.status(400).send("Image upload failed: " + escapeHTML(err.message));
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error("MongoDB Connection Error:", error.message);
    });