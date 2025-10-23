// ======== USER DATA (Temporary for demo) ========
const users = [
    { id: 1, name: "Rcjie Villena", email: "rcjie@gmail.com", password: "admin123" }
];

// ======== LOGIN FUNCTION ========
function login() {
    const emailInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Check if input elements exist
    if (!emailInput || !passwordInput) {
        alert("Error: Login form elements not found.");
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        alert(`Welcome, ${user.name}! You have successfully logged in.`);
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'dashboard.html';
    } else {
        alert("Invalid email or password. Please try again.");
    }
}

// ======== DOMContentLoaded EVENT LISTENER ========
document.addEventListener('DOMContentLoaded', () => {
    // Login button setup
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', login);
    } else if (window.location.pathname.split('/').pop() === 'login.html') {
        console.warn("Login button not found. Ensure the button ID is 'login-btn'.");
    }

    // ======== CHECK LOGIN STATUS ========
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const path = window.location.pathname.split('/').pop();

    // Redirect user if not logged in and trying to access restricted page
    const publicPages = ['index.html', 'login.html', 'register.html', ''];
    if (!isLoggedIn && !publicPages.includes(path)) {
        window.location.href = 'index.html';
        return;
    }

    // ======== SIDEBAR FUNCTIONALITY ========
    const sidebar = document.querySelector('.sidebar');
    const main = document.querySelector('.main');
    const sidebarItems = document.querySelectorAll('.sidebar-nav li');

    if (sidebar && main && sidebarItems.length > 0) {
        // Responsive sidebar
        const adjustSidebar = () => {
            if (window.innerWidth <= 768) {
                sidebar.style.width = '60px';
                main.style.marginLeft = '60px';
            } else {
                sidebar.style.width = '240px';
                main.style.marginLeft = '240px';
            }
        };
        adjustSidebar();
        window.addEventListener('resize', adjustSidebar);

        // Sidebar navigation click events
        sidebarItems.forEach(item => {
            item.addEventListener('click', () => {
                // Skip navigation on logout.html to prevent leaving confirmation page
                if (path === 'logout.html') return;

                // Get the text from the second <span> (the one without 'icon' class)
                const textSpan = item.querySelector('span:not(.icon)');
                const text = textSpan ? textSpan.textContent.trim().toUpperCase() : '';

                sidebarItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                switch (text) {
                    case 'DASHBOARD':
                        window.location.href = 'dashboard.html';
                        break;
                    case 'TASKS':
                        window.location.href = 'tasks.html';
                        break;
                    case 'PROJECTS':
                        window.location.href = 'projects.html';
                        break;
                    case 'MESSAGES':
                        window.location.href = 'messages.html';
                        break;
                    case 'SETTINGS':
                        window.location.href = 'settings.html';
                        break;
                    case 'LOGOUT':
                        window.location.href = 'logout.html';
                        break;
                    default:
                        console.warn('Unknown menu item:', text);
                }
            });
        });
    } else if (!publicPages.includes(path)) {
        console.warn("Sidebar or main content not found. Ensure '.sidebar', '.main', and '.sidebar-nav li' exist on this page.");
    }

    // ======== DOUGHNUT CHART (Dashboard Only) ========
    if (document.getElementById('doughnutChart')) {
        const ctx = document.getElementById('doughnutChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [70, 30],
                    backgroundColor: ['#2e7d32', '#e0e0e0'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    }

    // ======== USER DISPLAY (Dashboard Header) ========
    const userData = sessionStorage.getItem('currentUser');
    if (userData) {
        const user = JSON.parse(userData);
        const userSpan = document.querySelector('.user span');
        if (userSpan) userSpan.textContent = user.name;
    }

    // ======== TASK CLICK HIGHLIGHT (Tasks Page) ========
    const tasks = document.querySelectorAll('.task-list li');
    if (tasks.length > 0) {
        tasks.forEach(task => {
            task.addEventListener('click', () => {
                tasks.forEach(t => t.classList.remove('selected'));
                task.classList.add('selected');
            });
        });
    }
});

// ======== REGISTER FUNCTION ========
function register() {
    const regEmail = document.getElementById('reg-email')?.value.trim();
    const regPassword = document.getElementById('reg-password')?.value.trim();

    if (!regEmail || !regPassword) {
        alert('Please fill in all fields.');
        return;
    }

    if (users.some(u => u.email === regEmail)) {
        alert('Email already registered.');
        return;
    }

    const newUser = {
        id: users.length + 1,
        name: regEmail.split('@')[0],
        email: regEmail,
        password: regPassword
    };

    users.push(newUser);
    alert('Registration successful! Please login.');
    window.location.href = 'login.html';
}

// ======== LOGOUT FUNCTION ========
function logout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}