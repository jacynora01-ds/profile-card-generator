const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        bio: {
            type: String,
            required: true
        },

        skills: {
            type: [String],
            required: true
        },

        profileImage: {
            type: String,
            default: ""
        },

        linkedin: {
            type: String,
            default: ""
        },

        github: {
            type: String,
            default: ""
        },

        instagram: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Profile", profileSchema);