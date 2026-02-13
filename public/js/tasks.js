// Task Management System
// Handles tasks, deadlines, and submissions

const TaskManager = {
    // Predefined tasks with deadlines
    tasks: [
        {
            id: 'task-1',
            title: 'Market Research Report',
            description: 'Conduct comprehensive market research for your proposed idea. Include target audience, market size, trends, and opportunities.',
            deadline: '2026-02-15T23:59:59',
            maxMarks: 100,
            phase: 'Round 1'
        },
        {
            id: 'task-2',
            title: 'Problem Statement',
            description: 'Define the core problem your startup aims to solve. Explain why this problem is important and who it affects.',
            deadline: '2026-02-10T23:59:59',
            maxMarks: 100,
            phase: 'Round 1'
        },
        {
            id: 'task-3',
            title: 'Competitor Analysis',
            description: 'Identify and analyze your top 5 competitors. Compare features, pricing, strengths, and weaknesses.',
            deadline: '2026-02-18T23:59:59',
            maxMarks: 100,
            phase: 'Round 1'
        },
        {
            id: 'task-4',
            title: 'Business Model Canvas',
            description: 'Create a detailed Business Model Canvas covering all 9 building blocks for your startup idea.',
            deadline: '2026-02-23T23:59:59',
            maxMarks: 150,
            phase: 'Round 1'
        },
        {
            id: 'task-5',
            title: 'Idea Pitch Deck',
            description: 'Create a compelling 10-slide pitch deck presenting your startup idea, problem, solution, and team.',
            deadline: '2026-02-05T23:59:59',
            maxMarks: 100,
            phase: 'Round 1'
        },
        {
            id: 'task-6',
            title: 'Team Introduction Video',
            description: 'Record a 2-3 minute video introducing your team members, their roles, and why you\'re passionate about this idea.',
            deadline: '2026-02-25T23:59:59',
            maxMarks: 50,
            phase: 'Round 1'
        }
    ],

    // Check if task deadline has passed
    isDeadlinePassed: function (deadline) {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        return now > deadlineDate;
    },

    // Get task status
    getTaskStatus: function (taskId) {
        const submissions = this.getSubmissions();
        const task = this.tasks.find(t => t.id === taskId);

        if (!task) return 'unknown';

        // Check if submitted
        if (submissions[taskId]) {
            return 'submitted';
        }

        // Check if deadline passed
        if (this.isDeadlinePassed(task.deadline)) {
            return 'closed';
        }

        return 'active';
    },

    // Get all submissions from localStorage
    getSubmissions: function () {
        try {
            const submissions = localStorage.getItem('tec_submissions');
            return submissions ? JSON.parse(submissions) : {};
        } catch (error) {
            console.error('Error fetching submissions:', error);
            return {};
        }
    },

    // Submit a task
    submitTask: function (taskId, fileName) {
        try {
            const task = this.tasks.find(t => t.id === taskId);
            if (!task) {
                return { success: false, message: 'Task not found' };
            }

            // Check if deadline passed
            if (this.isDeadlinePassed(task.deadline)) {
                return { success: false, message: 'Deadline has passed' };
            }

            // Get existing submissions
            const submissions = this.getSubmissions();

            // Check if already submitted
            if (submissions[taskId]) {
                return { success: false, message: 'Task already submitted' };
            }

            // Add new submission
            submissions[taskId] = {
                taskId: taskId,
                taskTitle: task.title,
                fileName: fileName,
                submittedOn: new Date().toISOString(),
                status: 'pending'
            };

            // Save to localStorage
            localStorage.setItem('tec_submissions', JSON.stringify(submissions));

            return { success: true, message: 'Task submitted successfully!' };

        } catch (error) {
            console.error('Submission error:', error);
            return { success: false, message: 'Submission failed. Please try again.' };
        }
    },

    // Get submission for a task
    getSubmission: function (taskId) {
        const submissions = this.getSubmissions();
        return submissions[taskId] || null;
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

    // Render task card HTML
    renderTaskCard: function (task) {
        const status = this.getTaskStatus(task.id);
        const submission = this.getSubmission(task.id);
        const timeRemaining = this.getTimeRemaining(task.deadline);

        let statusBadge = '';
        let submitButton = '';

        if (status === 'submitted') {
            statusBadge = '<span class="badge badge-success">Submitted</span>';
            submitButton = `
                <div style="margin-top: 1rem; padding: 1rem; background: rgba(0, 255, 0, 0.1); border-radius: 8px;">
                    <p class="text-muted mb-sm"><strong>Submitted:</strong> ${submission.fileName}</p>
                    <p class="text-muted mb-0"><strong>On:</strong> ${this.formatDeadline(submission.submittedOn)}</p>
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
                    <span class="badge badge-red">${task.phase}</span>
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
function handleFileSelect(taskId, input) {
    const file = input.files[0];

    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
        alert('Please upload only PDF files');
        input.value = '';
        return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert('File size should not exceed 10MB');
        input.value = '';
        return;
    }

    // Submit task
    const result = TaskManager.submitTask(taskId, file.name);

    if (result.success) {
        showNotification(result.message, 'success');
        // Reload tasks to update UI
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } else {
        alert(result.message);
        input.value = '';
    }
}

// Make TaskManager available globally
window.TaskManager = TaskManager;
window.handleFileSelect = handleFileSelect;
