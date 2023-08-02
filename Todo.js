document.addEventListener("DOMContentLoaded", function () {
  const addTaskButton = document.querySelector(
    "[data-bs-target='#task-modal']"
  );
  const taskModalTitle = document.querySelector("#Label");
  const taskInput = document.querySelector("#task-modal input");
  const todoTable = document.querySelector(".table tbody");
  let isEditing = false;
  let editingTaskId = null;

  // Function to save tasks to local storage
  function saveTasksToLocalStorage() {
    const tasks = [];
    const rows = todoTable.querySelectorAll("tr");
    rows.forEach((row) => {
      const taskId = row.getAttribute("data-task-id");
      const taskName = row.querySelector("td:nth-child(2)").textContent;
      tasks.push({ id: taskId, name: taskName });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Function to load tasks from local storage
  function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks) {
      // Filter out null or empty tasks
      const filteredTasks = tasks.filter(
        (task) => task.name && task.name.trim() !== ""
      );
      filteredTasks.forEach((task) => {
        const newRow = document.createElement("tr");
        newRow.setAttribute("data-task-id", task.id);
        newRow.innerHTML = `
          <td>${task.id}</td>
          <td>${task.name}</td>
          <td>
            <button type="button" class="btn btn-outline-warning btn-sm state" data-source="${task.id}">
              Todo
            </button>
          </td>
          <td>
            <button type="button" class="btn btn-outline-info btn-sm" data-bs-toggle="modal" data-bs-target="#task-modal"
              data-source="${task.id}" data-content="${task.name}">
              <i class="fa fa-pen fa-1" aria-hidden="true"></i>
            </button>
          </td>
          <td>
            <button class="btn btn-outline-secondary btn-sm remove" data-source="${task.id}" type="button">
              <i class="fa fa-trash fa-1" aria-hidden="true"></i>
            </button>
          </td>
        `;
        todoTable.appendChild(newRow);
        editingTaskId = task.id;
      });
    }
  }

  // Function to generate a new task ID based on the highest existing ID in the table
  function generateNewTaskId() {
    const rows = todoTable.querySelectorAll("tr");
    let highestId = 0;
    rows.forEach((row) => {
      const taskId = parseInt(row.getAttribute("data-task-id"), 10);
      highestId = Math.max(highestId, taskId);
    });
    return highestId + 1;
  }

  addTaskButton.addEventListener("click", function () {
    taskModalTitle.textContent = "Add a task";
    taskInput.value = ""; // Clear the input field
    isEditing = false;
    editingTaskId = null;
  });

  document.getElementById("submit-task").addEventListener("click", function () {
    const taskName = taskInput.value.trim();
    if (taskName !== "") {
      if (isEditing && editingTaskId !== null) {
        // Update existing task
        const taskRow = document.querySelector(
          `[data-task-id="${editingTaskId}"]`
        );
        taskRow.innerHTML = `
          <td>${editingTaskId}</td>
          <td>${taskName}</td>
          <td>
            <button type="button" class="btn btn-outline-warning btn-sm state" data-source="${editingTaskId}">
              Todo
            </button>
          </td>
          <td>
            <button type="button" class="btn btn-outline-info btn-sm" data-bs-toggle="modal" data-bs-target="#task-modal"
              data-source="${editingTaskId}" data-content="${taskName}">
              <i class="fa fa-pen fa-1" aria-hidden="true"></i>
            </button>
          </td>
          <td>
            <button class="btn btn-outline-secondary btn-sm remove" data-source="${editingTaskId}" type="button">
              <i class="fa fa-trash fa-1" aria-hidden="true"></i>
            </button>
          </td>
        `;
        isEditing = false;
        editingTaskId = null;
      } else {
        // Add new task
        const newTaskId = generateNewTaskId();
        const newRow = document.createElement("tr");
        newRow.setAttribute("data-task-id", newTaskId);
        newRow.innerHTML = `
          <td>${newTaskId}</td>
          <td>${taskName}</td>
          <td>
            <button type="button" class="btn btn-outline-warning btn-sm state" data-source="${newTaskId}">
              Todo
            </button>
          </td>
          <td>
            <button type="button" class="btn btn-outline-info btn-sm" data-bs-toggle="modal" data-bs-target="#task-modal"
              data-source="${newTaskId}" data-content="${taskName}">
              <i class="fa fa-pen fa-1" aria-hidden="true"></i>
            </button>
          </td>
          <td>
            <button class="btn btn-outline-secondary btn-sm remove" data-source="${newTaskId}" type="button">
              <i class="fa fa-trash fa-1" aria-hidden="true"></i>
            </button>
          </td>
        `;
        todoTable.appendChild(newRow);
        editingTaskId = newTaskId;
      }

      taskModalTitle.textContent = "Add a task"; // Reset modal title after adding/updating task
      taskInput.value = ""; // Clear the input field

      saveTasksToLocalStorage();
    }
  });

  // Handle edit button clicks
  todoTable.addEventListener("click", function (event) {
    const editButton = event.target.closest(".btn-outline-info");
    if (editButton) {
      const taskId = editButton.getAttribute("data-source");
      const taskName = editButton.getAttribute("data-content");
      taskModalTitle.textContent = "Edit Task";
      taskInput.value = taskName;
      isEditing = true;
      editingTaskId = taskId;
    }
  });

  // Handle remove task button clicks using event delegation
  todoTable.addEventListener("click", function (event) {
    const removeButton = event.target.closest(".remove");
    if (removeButton) {
      const rowToRemove = removeButton.closest("tr");
      rowToRemove.parentNode.removeChild(rowToRemove);
      saveTasksToLocalStorage();
    }
  });

  // Load tasks from local storage when the page is loaded
  loadTasksFromLocalStorage();
});
