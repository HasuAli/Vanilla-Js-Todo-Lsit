const todoInput = document.getElementById("todoInput");
const addTaskBtn = document.getElementById("todoBtn");

//get All tasks form local storage
function getAllTasks() {
  return JSON.parse(localStorage.getItem("tasksList")) || [];
}
//set data in local storage
function saveAllTasks(taskArray) {
  localStorage.setItem("tasksList", JSON.stringify(taskArray));
}
//Reloaded the data when refresh
document.addEventListener("DOMContentLoaded", () => {
  let storedTasks = getAllTasks();
  storedTasks.forEach((task) => {
    renderTask(task);
  });
});
// Add new task
function addTask() {
  if (!todoInput.value.trim()) {
    // popUp from sweetalert
    Swal.fire({
      icon: "warning",
      title: "No Task Added",
      text: "Please enter a task before adding!",
      confirmButtonColor: "#3b82f6",
      background: "#f9fafb",
      color: "#374151",
    });
  } else {
    //  // New task object
    let newTask = { text: todoInput.value, completed: false };
    let taskArray = getAllTasks();
    // Get old tasks, push new, and save
    taskArray.push(newTask);
    saveAllTasks(taskArray);

    // Render task in UI
    renderTask(newTask);
    // clear Input filed
    todoInput.value = "";
  }
}
// Add task by button click or Enter key
addTaskBtn.addEventListener("click", addTask);
todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

// Render Single Task
function renderTask(task) {
  const taskContainer = document.getElementById("taskcon");

  const taskItem = document.createElement("li");
  taskItem.classList.add("taskList");

  const taskLabel = document.createElement("span");
  taskLabel.textContent = task.text;
  taskLabel.classList.add("taskText");
  if (task.completed) taskLabel.classList.add("completedTask");

  const buttonGroup = document.createElement("div");
  buttonGroup.classList.add("btnGroup");
  // delete task in list
  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  deleteBtn.addEventListener("click", () => {
    taskItem.remove();

    //  Remove from localStorage
    let taskArray = getAllTasks();
    taskArray = taskArray.filter((t) => t.text !== task.text);
    saveAllTasks(taskArray);
  });

  // Edit task in list
  const editBtn = document.createElement("button");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  editBtn.addEventListener("click", async () => {
    // popUp from sweetalert
    const { value: updatedText } = await Swal.fire({
      title: "Edit Task",
      input: "text",
      inputLabel: "Update your task",
      inputValue: taskLabel.textContent,
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3b82f6",
      background: "#f9fafb",
      color: "#374151",
    });

    if (updatedText) {
      taskLabel.textContent = updatedText;
      // Update in local storage
      let taskArray = getAllTasks();
      let index = taskArray.findIndex((t) => t.text === task.text);
      if (index !== -1) {
        taskArray[index].text = updatedText;
        saveAllTasks(taskArray);
      }
    }
  });

  // complete task in list
  const completeBtn = document.createElement("button");
  completeBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  completeBtn.addEventListener("click", () => {
    taskLabel.classList.toggle("completedTask");
    // complete task true in obj is defined when onclick  comp btn it is define in array of obj in addTask
    let taskArray = getAllTasks();
    let index = taskArray.findIndex((t) => t.text === task.text);
    if (index !== -1) {
      taskArray[index].completed = !taskArray[index].completed;
      saveAllTasks(taskArray);
    }
  });

  buttonGroup.appendChild(deleteBtn);
  buttonGroup.appendChild(editBtn);
  buttonGroup.appendChild(completeBtn);

  taskItem.appendChild(taskLabel);
  taskItem.appendChild(buttonGroup);

  taskContainer.appendChild(taskItem);
}
