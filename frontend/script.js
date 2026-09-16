const API_URL = "http://localhost:5000/api";

let tasks = [];
let editingTaskId = null;


// =========================
// Page Elements
// =========================

const loginPage = document.getElementById("loginPage");
const registerPage = document.getElementById("registerPage");
const dashboardPage = document.getElementById("dashboardPage");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

const logoutBtn = document.getElementById("logoutBtn");
const welcomeUser = document.getElementById("welcomeUser");

const taskForm = document.getElementById("taskForm");
const addTaskBtn = document.getElementById("addTaskBtn");

const tasksContainer = document.getElementById("tasksContainer");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const priorityFilter = document.getElementById("priorityFilter");


// =========================
// Authentication
// =========================

showRegister.addEventListener("click", () => {
    loginPage.classList.add("hidden");
    registerPage.classList.remove("hidden");
});

showLogin.addEventListener("click", () => {
    registerPage.classList.add("hidden");
    loginPage.classList.remove("hidden");
});


// =========================
// Register
// =========================

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    const message = document.getElementById("registerMessage");

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.message;
            message.style.color = "#dc2626";
            return;
        }

        message.textContent = "Registration successful! Please login.";
        message.style.color = "#16a34a";

        registerForm.reset();

        setTimeout(() => {
            registerPage.classList.add("hidden");
            loginPage.classList.remove("hidden");
            message.textContent = "";
        }, 1200);

    } catch (error) {
        message.textContent = "Unable to connect to server.";
        message.style.color = "#dc2626";
    }
});


// =========================
// Login
// =========================

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const message = document.getElementById("loginMessage");

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.message;
            message.style.color = "#dc2626";
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        loginForm.reset();

        showDashboard();

    } catch (error) {
        message.textContent = "Unable to connect to server.";
        message.style.color = "#dc2626";
    }
});


// =========================
// Show Dashboard
// =========================

function showDashboard() {
    loginPage.classList.add("hidden");
    registerPage.classList.add("hidden");
    dashboardPage.classList.remove("hidden");

    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        welcomeUser.textContent = `Hi, ${user.name}`;
    }

    loadTasks();
}


// =========================
// Logout
// =========================

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    dashboardPage.classList.add("hidden");
    loginPage.classList.remove("hidden");

    tasks = [];
    tasksContainer.innerHTML = "";
});


// =========================
// Load Tasks
// =========================

async function loadTasks() {
    const token = localStorage.getItem("token");

    if (!token) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(data.message);
            return;
        }

        tasks = data;

        updateDashboard();
        renderTasks();

    } catch (error) {
        console.error("Failed to load tasks:", error);
    }
}


// =========================
// Dashboard Summary
// =========================

function updateDashboard() {
    const total = tasks.length;

    const pending = tasks.filter(
        task => task.status === "Pending"
    ).length;

    const completed = tasks.filter(
        task => task.status === "Completed"
    ).length;

    const highPriority = tasks.filter(
        task => task.priority === "High"
    ).length;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("pendingTasks").textContent = pending;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("highPriorityTasks").textContent = highPriority;

    const progress =
    total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("progressBar").style.width =
        `${progress}%`;

    document.getElementById("progressText").textContent =
        `${progress}% completed`;

    document.getElementById("progressDetails").textContent =
        `${completed} of ${total} tasks completed`;
        
}


// =========================
// Render Tasks
// =========================

function renderTasks() {

    const searchText = searchInput.value.toLowerCase();
    const selectedStatus = statusFilter.value;
    const selectedPriority = priorityFilter.value;

    const filteredTasks = tasks.filter(task => {

        const matchesSearch =
            task.title.toLowerCase().includes(searchText) ||
            task.description.toLowerCase().includes(searchText) ||
            task.category.toLowerCase().includes(searchText);

        const matchesStatus =
            selectedStatus === "All" ||
            task.status === selectedStatus;

        const matchesPriority =
            selectedPriority === "All" ||
            task.priority === selectedPriority;

        return matchesSearch && matchesStatus && matchesPriority;
    });


    if (filteredTasks.length === 0) {

    tasksContainer.innerHTML = `
        <div class="empty-state">

            <div class="empty-icon">
                ✓
            </div>

            <h4>No tasks found</h4>

            <p>
                ${
                    tasks.length === 0
                        ? "You don't have any tasks yet. Create your first task to get started."
                        : "Try changing your search or filters."
                }
            </p>

            ${
                tasks.length === 0
                    ? `
                        <button
                            class="empty-add-btn"
                            onclick="document.getElementById('addTaskBtn').click()"
                        >
                            + Create Your First Task
                        </button>
                    `
                    : ""
            }

        </div>
    `;

    return;
}


    tasksContainer.innerHTML = filteredTasks.map(task => {

        const dueDate = task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : "No due date";


        return `
            <div class="task-card">

                <div class="task-card-header">

                    <div class="task-main">

                        <div class="task-title-row">

                            <h5>${escapeHtml(task.title)}</h5>

                            <span class="status-badge ${
                                task.status === "Completed"
                                    ? "completed"
                                    : "pending"
                            }">
                                ${task.status}
                            </span>

                        </div>

                        <p class="task-description">
                            ${escapeHtml(
                                task.description || "No description provided"
                            )}
                        </p>

                    </div>

                    <div class="task-actions">

                        <button
                            class="action-btn complete-btn"
                            onclick="toggleTaskStatus('${task._id}')"
                        >
                            ${
                                task.status === "Completed"
                                    ? "↩ Pending"
                                    : "✓ Complete"
                            }
                        </button>

                        <button
                            class="action-btn edit-btn"
                            onclick="editTask('${task._id}')"
                        >
                            ✎ Edit
                        </button>

                        <button
                            class="action-btn delete-btn"
                            onclick="deleteTask('${task._id}')"
                        >
                            🗑 Delete
                        </button>

                    </div>

                </div>

                <div class="task-meta">

                    <span>
                        📅 ${dueDate}
                    </span>

                    <span class="priority-badge ${task.priority.toLowerCase()}">
                        ⭐ ${task.priority}
                    </span>

                    <span>
                        🏷️ ${escapeHtml(task.category || "General")}
                    </span>

                </div>

            </div>
        `;

    }).join("");
}


// =========================
// Add Task Modal
// =========================

addTaskBtn.addEventListener("click", () => {

    editingTaskId = null;

    document.getElementById("taskModalTitle").textContent = "Add Task";

    taskForm.reset();

    document.getElementById("taskPriority").value = "Medium";

    const modal = new bootstrap.Modal(
        document.getElementById("taskModal")
    );

    modal.show();
});


// =========================
// Create / Update Task
// =========================

taskForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const token = localStorage.getItem("token");

    const taskData = {
        title: document.getElementById("taskTitle").value,
        description: document.getElementById("taskDescription").value,
        dueDate: document.getElementById("taskDueDate").value || null,
        priority: document.getElementById("taskPriority").value,
        category: document.getElementById("taskCategory").value || "General"
    };


    try {

        let url = `${API_URL}/tasks`;
        let method = "POST";

        if (editingTaskId) {
            url = `${API_URL}/tasks/${editingTaskId}`;
            method = "PUT";
        }


        const response = await fetch(url, {

            method,

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify(taskData)
        });


        const data = await response.json();


        if (!response.ok) {
            alert(data.message || "Something went wrong");
            return;
        }


        const modalElement = document.getElementById("taskModal");

        const modal = bootstrap.Modal.getInstance(modalElement);

        if (modal) {
            modal.hide();
        }


        editingTaskId = null;

        taskForm.reset();

        await loadTasks();

    } catch (error) {

        console.error(error);

        alert("Unable to connect to server.");

    }

});


// =========================
// Edit Task
// =========================

window.editTask = function (taskId) {

    const task = tasks.find(
        task => task._id === taskId
    );

    if (!task) {
        return;
    }


    editingTaskId = taskId;

    document.getElementById("taskModalTitle").textContent = "Edit Task";

    document.getElementById("taskId").value = task._id;

    document.getElementById("taskTitle").value = task.title;

    document.getElementById("taskDescription").value =
        task.description || "";

    document.getElementById("taskDueDate").value =
        task.dueDate
            ? task.dueDate.substring(0, 10)
            : "";

    document.getElementById("taskPriority").value =
        task.priority;

    document.getElementById("taskCategory").value =
        task.category || "General";


    const modal = new bootstrap.Modal(
        document.getElementById("taskModal")
    );

    modal.show();
};


// =========================
// Delete Task
// =========================

window.deleteTask = async function (taskId) {

    const confirmed = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
        return;
    }


    const token = localStorage.getItem("token");


    try {

        const response = await fetch(
            `${API_URL}/tasks/${taskId}`,
            {
                method: "DELETE",

                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );


        const data = await response.json();


        if (!response.ok) {
            alert(data.message);
            return;
        }


        await loadTasks();

    } catch (error) {

        console.error(error);

        alert("Unable to connect to server.");

    }
};

window.toggleTaskStatus = async function (taskId) {

    const task = tasks.find(task => task._id === taskId);

    if (!task) {
        return;
    }

    const token = localStorage.getItem("token");

    const newStatus =
        task.status === "Completed"
            ? "Pending"
            : "Completed";

    try {

        const response = await fetch(
            `${API_URL}/tasks/${taskId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    status: newStatus
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Failed to update status");
            return;
        }

        await loadTasks();

    } catch (error) {

        console.error(error);

        alert("Unable to connect to server.");
    }
};

// =========================
// Search / Filters
// =========================

searchInput.addEventListener(
    "input",
    renderTasks
);

statusFilter.addEventListener(
    "change",
    renderTasks
);

priorityFilter.addEventListener(
    "change",
    renderTasks
);


// =========================
// HTML Safety
// =========================

function escapeHtml(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


// =========================
// Auto Login
// =========================

if (localStorage.getItem("token")) {
    showDashboard();
}