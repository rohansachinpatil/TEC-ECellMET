// Task Management System
// Handles tasks, deadlines, and submissions using Backend API

const TaskManager = {
    tasks: [],
    submissions: {},

    // Initialize: Fetch tasks and submissions
    init: async function () {
        await this.fetchTasks();
        await this.fetchSubmissions();
        this.renderAllTasks();
    },

    // Fetch tasks from API
    fetchTasks: async function () {
        const result = await API.getTasks();
        if (result.success) {
            this.tasks = result.tasks;
        } else {
            console.error('Failed to load tasks:', result.message);
            // alert('Failed to load tasks. Please refresh.'); 
        }
    },

    // Fetch user's submissions from API
    fetchSubmissions: async function () {
        const result = await API.getMySubmissions();
        if (result.success) {
            // Convert array to object map for easier lookup: { taskId: submission }
            this.submissions = {};
            result.submissions.forEach(sub => {
                this.submissions[sub.taskId] = sub;
            });
        } else {
            console.error('Failed to load submissions:', result.message);
        }
    },

    // Check if task deadline has passed
    isDeadlinePassed: function (deadline) {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        return now > deadlineDate;
    },

    // Get task status
    getTaskStatus: function (taskId) {
        const submission = this.submissions[taskId];
        const task = this.tasks.find(t => t.id === taskId);

        if (!task) return 'unknown';

        // Check if submitted
        if (submission) {
            return 'submitted';
        }

        // Check if deadline passed
        if (this.isDeadlinePassed(task.deadline)) {
            return 'closed';
        }

        return 'active';
    },

    // Submit a task
    submitTask: async function (taskId, file) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) {
            return { success: false, message: 'Task not found' };
        }

        // Check if deadline passed
        if (this.isDeadlinePassed(task.deadline)) {
            return { success: false, message: 'Deadline has passed' };
        }

        // Call API
        const result = await API.submitTask(taskId, file);

        if (result.success) {
            // Update local state
            await this.fetchSubmissions(); // Refresh submissions to get the new one
            return { success: true, message: 'Task submitted successfully!' };
        } else {
            return { success: false, message: result.message };
        }
    },

    // Format deadline for display
    formatDeadline: function (deadline) {
        const date = new Date(deadline);
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('en-US', options);
    },

    // Get time remaining for a task
    getTimeRemaining: function (deadline) {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diff = deadlineDate - now;

        if (diff <= 0) {
            return 'Expired';
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} left`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} left`;
        } else {
            return 'Less than 1 hour left';
        }
    },

    // Render all tasks
    renderAllTasks: function () {
        const container = document.getElementById('tasks-container');
        if (!container) return;

        if (this.tasks.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">No active tasks found.</p>';
            return;
        }

        container.innerHTML = this.tasks.map(task => this.renderTaskCard(task)).join('');
    },

    // Render task card HTML
    renderTaskCard: function (task) {
        const status = this.getTaskStatus(task.id);
        const submission = this.submissions[task.id];
        const timeRemaining = this.getTimeRemaining(task.deadline);

        let statusBadge = '';
        let submitButton = '';
        const phaseName = task.phase ? task.phase.name : 'Round 1';

        if (status === 'submitted') {
            statusBadge = '<span class="badge badge-success">Submitted</span>';
            submitButton = `
                <div style="margin-top: 1rem; padding: 1rem; background: rgba(0, 255, 0, 0.1); border-radius: 8px;">
                    <p class="text-muted mb-sm"><strong>Submitted:</strong> ${submission.fileName}</p>
                    <p class="text-muted mb-0"><strong>On:</strong> ${this.formatDeadline(submission.submittedAt)}</p>
                    ${submission.status === 'graded' ? `<p class="mt-sm text-white"><strong>Marks:</strong> ${submission.marks}/${task.maxMarks}</p>` : ''}
                </div>
            `;
        } else if (status === 'closed') {
            statusBadge = '<span class="badge badge-error">Closed</span>';
            submitButton = '<button class="btn btn-secondary btn-full" disabled>Submission Closed</button>';
        } else {
            statusBadge = `<span class="badge badge-warning">${timeRemaining}</span>`;
            submitButton = `
                <input type="file" id="file-${task.id}" accept=".pdf" style="display: none;" onchange="handleFileSelect('${task.id}', this)">
                <button class="btn btn-primary btn-full" onclick="document.getElementById('file-${task.id}').click()">
                    Submit Task
                </button>
            `;
        }

        return `
            <div class="card">
                <div class="flex-between mb-md">
                    <span class="badge badge-red">${phaseName}</span>
                    ${statusBadge}
                </div>
                <h3 class="mb-md">${task.title}</h3>
                <p class="text-muted mb-lg">${task.description}</p>
                <div class="mb-md">
                    <p class="text-muted mb-sm" style="font-size: 0.9rem;">⏰ Deadline: ${this.formatDeadline(task.deadline)}</p>
                    <p class="text-muted mb-sm" style="font-size: 0.9rem;">🎯 Max Marks: ${task.maxMarks}</p>
                </div>
                ${submitButton}
            </div>
        `;
    }
};

// File upload handler
async function handleFileSelect(taskId, input) {
    const file = input.files[0];

    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
        alert('Please upload only PDF files');
        input.value = '';
        return;
    }

    // Validate file size (max 5MB as per backend)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB');
        input.value = '';
        return;
    }

    const btnId = `file-${taskId}`;
    const btn = input.nextElementSibling; // The button that triggered the click
    const originalText = btn.textContent;
    btn.textContent = 'Uploading...';
    btn.disabled = true;

    // Submit task
    const result = await TaskManager.submitTask(taskId, file);

    if (result.success) {
        // showNotification(result.message, 'success');
        alert(result.message);
        // Refresh UI
        TaskManager.renderAllTasks();
    } else {
        alert(result.message);
        input.value = '';
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    if (window.API && window.API.isLoggedIn()) {
        TaskManager.init();
    }
});

// Make TaskManager available globally
window.TaskManager = TaskManager;
window.handleFileSelect = handleFileSelect;
