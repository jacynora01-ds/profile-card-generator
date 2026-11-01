const nameInput = document.getElementById("name");
const bioInput = document.getElementById("bio");
const skillsInput = document.getElementById("skills");
const imageInput = document.getElementById("profileImage");

const previewAvatar = document.getElementById("previewAvatar");
const previewImage = document.getElementById("previewImage");
const previewName = document.getElementById("previewName");
const previewBio = document.getElementById("previewBio");
const previewSkills = document.getElementById("previewSkills");
const charCount = document.getElementById("charCount");

// Name Preview
nameInput.addEventListener("input", function () {
    const name = nameInput.value.trim();

    previewName.textContent = name || "Your Name";

    if (!previewImage.src || previewImage.style.display === "none") {
        previewAvatar.textContent = name ? name.charAt(0).toUpperCase() : "?";
    }
});

// Bio Preview
bioInput.addEventListener("input", function () {
    previewBio.textContent = bioInput.value || "Your bio will appear here.";

    charCount.textContent =
        bioInput.value.length + " / 500 characters";
});

// Skills Preview
skillsInput.addEventListener("input", function () {
    const skills = skillsInput.value
        .split(",")
        .map(skill => skill.trim())
        .filter(skill => skill !== "");

    previewSkills.replaceChildren();

    if (skills.length === 0) {
        const span = document.createElement("span");
        span.textContent = "Your skills";
        previewSkills.appendChild(span);
    } else {
        skills.forEach(function (skill) {
            const span = document.createElement("span");
            span.textContent = skill;
            previewSkills.appendChild(span);
        });
    }
});

// Profile Picture Preview
let currentImageURL = null;

imageInput.addEventListener("change", function () {
    const file = imageInput.files[0];

    if (!file) {
        previewImage.style.display = "none";
        previewAvatar.style.display = "flex";
        return;
    }

    if (!file.type.startsWith("image/")) {
        alert("Please select a valid image.");
        imageInput.value = "";
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5 MB.");
        imageInput.value = "";
        return;
    }

    if (currentImageURL) {
        URL.revokeObjectURL(currentImageURL);
    }

    currentImageURL = URL.createObjectURL(file);

    previewImage.src = currentImageURL;
    previewImage.style.display = "block";
    previewAvatar.style.display = "none";
});