document.addEventListener("DOMContentLoaded", function() {
    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task-input");
    const taskDate = document.getElementById("task-date");
    const taskPriority = document.getElementById("task-priority");
    const filterPriority = document.getElementById("filter-priority");
    const sortBy = document.getElementById("sort-by");
    const taskList = document.getElementById("task-list");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = "";
        let filteredTasks = tasks.filter(task => filterPriority.value === "all" || task.priority === filterPriority.value);
        if (sortBy.value === "date") {
            filteredTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sortBy.value === "priority") {
            const priorities = ["low", "medium", "high"];
            filteredTasks.sort((a, b) => priorities.indexOf(a.priority) - priorities.indexOf(b.priority));
        }

        filteredTasks.forEach((task, index) => {
            const taskItem = document.createElement("li");
            taskItem.className = `task-item ${task.completed ? "completed" : ""} priority-${task.priority}`;
            taskItem.innerHTML = `
                <div class="task-info">
                    <span class="task-text">${task.text}</span>
                    <span class="task-meta">${new Date(task.date).toLocaleString()} | ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                </div>
                <div class="task-actions">
                    <button onclick="toggleComplete(${index})"><i class="fas fa-check"></i></button>
                    <button onclick="editTask(${index})"><i class="fas fa-edit"></i></button>
                    <button onclick="deleteTask(${index})"><i class="fas fa-trash"></i></button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
    }

    taskForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const newTask = {
            text: taskInput.value.trim(),
            date: taskDate.value,
            priority: taskPriority.value,
            completed: false,
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskForm.reset();
    });

    filterPriority.addEventListener("change", renderTasks);
    sortBy.addEventListener("change", renderTasks);

    window.toggleComplete = function(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    };

    window.editTask = function(index) {
        const taskItem = taskList.children[index];
        const task = tasks[index];

        taskItem.innerHTML = `
            <form class="edit-form" onsubmit="updateTask(event, ${index})">
                <input type="text" value="${task.text}" required>
                <input type="datetime-local" value="${task.date}" required>
                <select>
                    <option value="low" ${task.priority === "low" ? "selected" : ""}>Low</option>
                    <option value="medium" ${task.priority === "medium" ? "selected" : ""}>Medium</option>
                    <option value="high" ${task.priority === "high" ? "selected" : ""}>High</option>
                </select>
                <button type="submit"><i class="fas fa-save"></i></button>
            </form>
        `;
    };

    window.updateTask = function(e, index) {
        e.preventDefault();
        const form = e.target;
        const newText = form.elements[0].value.trim();
        const newDate = form.elements[1].value;
        const newPriority = form.elements[2].value;

        if (newText && newDate) {
            tasks[index] = { text: newText, date: newDate, priority: newPriority, completed: tasks[index].completed };
            saveTasks();
            renderTasks();
        }
    };

    window.deleteTask = function(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    };

    renderTasks();
});
