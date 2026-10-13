// QUICKBITE JAVASCRIPT

// Display messages
function showMessage(id, message, success = false) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = message;
        element.style.color = success ? "green" : "#d32f2f";
    }
}

// Get saved users
function getUsers() {
    return JSON.parse(localStorage.getItem("quickbiteUsers") || "[]");
}

// Save users
function saveUsers(users) {
    localStorage.setItem("quickbiteUsers", JSON.stringify(users));
}

// Update home page Login/Logout link
function updateAccountLink() {
    const link = document.getElementById("accountLink");
    if (!link) return;

    const loggedIn = localStorage.getItem("quickbiteLoggedIn") === "true";

    if (loggedIn) {
        link.textContent = "Logout";
        link.href = "#";
        link.onclick = function (event) {
            event.preventDefault();
            localStorage.removeItem("quickbiteLoggedIn");
            localStorage.removeItem("quickbiteCurrentUser");
            window.location.href = "index.html";
        };
    } else {
        link.textContent = "Login";
        link.href = "login.html";
        link.onclick = null;
    }
}

updateAccountLink();


// 1. REGISTRATION
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim().toLowerCase();
        const phone = document.getElementById("registerPhone").value.trim();
        const password = document.getElementById("registerPassword").value;
        const confirm = document.getElementById("confirmPassword").value;

        if (password !== confirm) {
            showMessage("registerMessage", "Passwords do not match.");
            return;
        }

        const users = getUsers();

        if (users.some(user => user.email === email)) {
            showMessage("registerMessage", "This email is already registered.");
            return;
        }

        // Demo only: do not store real passwords this way.
        users.push({ name, email, phone, password });
        saveUsers(users);

        showMessage("registerMessage", "Registration successful! Redirecting to Login...", true);
        registerForm.reset();

        setTimeout(function () {
            window.location.href = "login.html";
        }, 1200);
    });
}


// 2. LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;

        const users = getUsers();

        const user = users.find(function (item) {
            return item.email === email && item.password === password;
        });

        if (!user) {
            showMessage("loginMessage", "Invalid email or password. Please register first.");
            return;
        }

        localStorage.setItem("quickbiteLoggedIn", "true");
        localStorage.setItem("quickbiteCurrentUser", user.email);

        showMessage("loginMessage", "Login successful!", true);

        setTimeout(function () {
            window.location.href = "index.html";
        }, 700);
    });
}


// 3. FORGOT PASSWORD
let demoOTP = null;
let resetEmail = "";

const forgotForm = document.getElementById("forgotForm");

if (forgotForm) {
    forgotForm.addEventListener("submit", function (event) {
        event.preventDefault();

        resetEmail = document.getElementById("resetEmail").value.trim().toLowerCase();

        const users = getUsers();
        const userExists = users.some(user => user.email === resetEmail);

        if (!userExists) {
            showMessage("resetMessage", "Email not found. Please register first.");
            return;
        }

        // Demonstration OTP only. It is not sent by email.
        demoOTP = String(Math.floor(100000 + Math.random() * 900000));

        document.getElementById("resetSection").hidden = false;

        showMessage(
            "resetMessage",
            "Demo OTP: " + demoOTP + " (shown on screen for your project demo)",
            true
        );
    });
}

const resetForm = document.getElementById("resetForm");

if (resetForm) {
    resetForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const enteredOTP = document.getElementById("resetOtp").value.trim();
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmNewPassword").value;

        if (!demoOTP || enteredOTP !== demoOTP) {
            showMessage("resetMessage", "Incorrect OTP. Please try again.");
            return;
        }

        if (newPassword !== confirmPassword) {
            showMessage("resetMessage", "Passwords do not match.");
            return;
        }

        const users = getUsers();
        const user = users.find(item => item.email === resetEmail);

        if (!user) {
            showMessage("resetMessage", "Account not found.");
            return;
        }

        user.password = newPassword;
        saveUsers(users);

        demoOTP = null;
        resetForm.reset();
        forgotForm.reset();
        document.getElementById("resetSection").hidden = true;

        showMessage("resetMessage", "Password reset successful! You can now Login.", true);
    });
}


// 4. FEEDBACK
const feedbackForm = document.getElementById("feedbackForm");

if (feedbackForm) {
    feedbackForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const feedback = {
            name: document.getElementById("feedbackName").value.trim(),
            email: document.getElementById("feedbackEmail").value.trim(),
            rating: document.getElementById("feedbackRating").value,
            message: document.getElementById("feedbackMessage").value.trim(),
            date: new Date().toLocaleDateString()
        };

        const allFeedback = JSON.parse(
            localStorage.getItem("quickbiteFeedback") || "[]"
        );

        allFeedback.push(feedback);

        localStorage.setItem("quickbiteFeedback", JSON.stringify(allFeedback));

        showMessage("feedbackStatus", "Thank you! Your feedback has been saved.", true);
        feedbackForm.reset();
    });
}


// 5. ADD TO CART
function addToCart(name, price) {
    const cart = JSON.parse(localStorage.getItem("quickbiteCart") || "[]");

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    localStorage.setItem("quickbiteCart", JSON.stringify(cart));
    updateCart();
}

function updateCart() {
    const cart = JSON.parse(localStorage.getItem("quickbiteCart") || "[]");

    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const countElement = document.getElementById("cartCount");
    const totalElement = document.getElementById("cartTotal");

    if (countElement) countElement.textContent = count;
    if (totalElement) totalElement.textContent = total;
}

updateCart();