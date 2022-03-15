import * as controller from "./controller";
import * as model from "./model";

const _contentDiv = document.querySelector(".content");
const createGeneralPage = () => {
    // create header
    const heading = document.createElement("h1");
    heading.textContent = "General";
    _contentDiv.append(heading);
    _updateTaskList();
}
const _updateTaskList = () => {
    const taskListDiv = document.createElement("section");
    const incompleteTasks = document.createElement("section");
    incompleteTasks.classList.add("task-list");
    const completeTasks = document.createElement("section");
    completeTasks.classList.add("task-list");
    taskListDiv.append(incompleteTasks, completeTasks);
    _contentDiv.append(taskListDiv);

    controller.sortIncompleteTasks().forEach(task => incompleteTasks.append(_createTaskElement(task)));
    controller.sortCompleteTasks().forEach(task => completeTasks.append(_createTaskElement(task)));
}
const _createTaskElement = (task) => {
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");
    taskContainer.dataset.task = model.taskArray.indexOf(task);
    const taskLabel = document.createElement("label");
    taskLabel.classList.add("task-label");
    taskLabel.dataset.task = model.taskArray.indexOf(task);
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.task = model.taskArray.indexOf(task);
    checkbox.addEventListener("change", _toggleCompleteClass);

    taskLabel.append(checkbox);
    taskLabel.append(task.name);
    taskContainer.append(taskLabel);
    if (task.dueDate) {
        const dueDateElement = document.createElement("p");
        dueDateElement.classList.add("due-date");
        dueDateElement.textContent = task.dueDate;
        taskContainer.append(dueDateElement);
    }
    if (task.isComplete) {
        checkbox.checked = true;
        taskContainer.classList.add("complete-task");
    }

    taskContainer.classList.add(`priority-${task.priority}`);
    return taskContainer;
}
const _toggleCompleteClass = (e) => {
    const taskIndex = e.target.dataset.task;
    const taskContainer = document.querySelector(`.task-container[data-task="${taskIndex}"]`);
    taskContainer.classList.toggle("complete-task");
    controller.toggleTaskCompletion(model.taskArray[taskIndex]);
    console.log(model.taskArray[taskIndex]);
}

export {
    createGeneralPage,
}