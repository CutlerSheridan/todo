import * as controller from "./controller";
import * as model from "./model";
import { compareAsc, format, isPast } from "date-fns";

const _contentDiv = document.querySelector(".content");

const createGeneralPage = () => {
    _clearContent(_contentDiv);
    _createHeader(model.projectArray[0]);
    _updateTaskList(model.projectArray[0]);
}
const createLogbookPage = () => {
    _clearContent(_contentDiv);
    _createHeader("logbook");
    _updateTaskList("logbook");
}

const _createHeader = (project) => {
    const headerContainer = document.createElement("header");
    const heading = document.createElement("h1");
    heading.textContent = project === "logbook" ? project : project.title;
    headerContainer.append(heading);
    const refreshTasks = document.createElement("button");
    refreshTasks.textContent = "Refresh";
    refreshTasks.classList.add("refresh");
    headerContainer.append(refreshTasks);
    refreshTasks.addEventListener("click", () => {
        _updateTaskList(project);
    });
    _contentDiv.append(headerContainer);
}
const _updateTaskList = (project) => {
    let taskListDiv = document.querySelector(".task-list-container");
    if (taskListDiv) {
        _clearContent(taskListDiv);
    } else {
        taskListDiv = document.createElement("section");
        taskListDiv.classList.add("task-list-container");
    }

    if (project !== "logbook") {
        const incompleteTasks = document.createElement("section");
        incompleteTasks.classList.add("task-list");
        taskListDiv.append(incompleteTasks);
        controller.sortIncompleteTasks(project).forEach(task => incompleteTasks.append(_createTaskElement(task)));
    }
    const completeTasks = document.createElement("section");
    completeTasks.classList.add("task-list", "complete-task-list");
    taskListDiv.append(completeTasks);
    controller.sortCompleteTasks(project).forEach(task => completeTasks.append(_createTaskElement(task)));
    
    _contentDiv.append(taskListDiv);

    _addListenersToTaskNames();
}
const _createTaskElement = (task) => {
    const taskIndex = model.taskArray.indexOf(task);

    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");
    taskContainer.dataset.task = taskIndex;
    
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.task = taskIndex;
    checkbox.id = `task-${taskIndex}`;
    if (task.isComplete) {
        checkbox.checked = true;
        taskContainer.classList.add("complete-task");
    }

    const taskLabel = document.createElement("label");
    taskLabel.classList.add("task-label");
    taskLabel.dataset.task = taskIndex;
    taskLabel.htmlFor = `task-${taskIndex}`;
    taskLabel.addEventListener("click", _toggleCompleteClass);

    taskContainer.append(checkbox, taskLabel);

    const taskInfoContainer = document.createElement("div");
    taskInfoContainer.classList.add("task-info-container");
    taskInfoContainer.dataset.task = taskIndex;
    const taskName = document.createElement("div");
    taskName.textContent = task.name;
    taskName.classList.add("task-name");
    taskName.dataset.task = taskIndex;
    taskInfoContainer.append(taskName);
    taskContainer.append(taskInfoContainer);
    if (task.dueDate && !task.isComplete) {
        taskInfoContainer.append(_createDueDateElement(task));
    }

    taskContainer.classList.add(`priority-${task.priority}`);
    return taskContainer;
}
const _createDueDateElement = (task) => {
    const dueDateElement = document.createElement("p");
    dueDateElement.classList.add("due-date");
    dueDateElement.textContent = format(task.dueDate, "M/d");
    if (task.dueDate < new Date()) {
        dueDateElement.classList.add("past-due");
    }
    return dueDateElement;
}
const _addListenersToTaskNames = () => {
    const allTaskNames = document.querySelectorAll(".task-name");
    allTaskNames.forEach(tName => tName.addEventListener("click", _replaceNameWithInput))
}
const _replaceNameWithInput = (e) => {
    const allTaskNames = document.querySelectorAll(".task-name");
    allTaskNames.forEach(tName => tName.removeEventListener("click", _replaceNameWithInput));

    const taskIndex = e.target.dataset.task;
    const taskInfoContainer = document.querySelector(`.task-info-container[data-task="${taskIndex}"]`);
    const nameInput = document.createElement("input");
    nameInput.type = "text"
    nameInput.classList.add("name-change-input");
    nameInput.value = e.target.textContent;
    // nameInput.dataset.task = taskIndex;

    e.target.remove();
    taskInfoContainer.prepend(nameInput);
    nameInput.focus();

    setTimeout(() => {
        document.addEventListener("click", (e) => {
        if (e.target !== nameInput) {
            _replaceInputWithName(taskInfoContainer, nameInput, taskIndex);
        }
    }, {once: true})}, 50);
}
const _replaceInputWithName = (taskInfoContainer, nameInput, taskIndex) => {
    model.taskArray[taskIndex].name = nameInput.value;
    const taskNameElement = document.createElement("div");
    taskNameElement.textContent = nameInput.value;
    taskNameElement.classList.add("task-name");
    taskNameElement.dataset.task = taskIndex;

    nameInput.remove();
    taskInfoContainer.prepend(taskNameElement);

    _addListenersToTaskNames();
}
const _toggleCompleteClass = (e) => {
    const taskIndex = e.target.dataset.task;
    const taskContainer = document.querySelector(`.task-container[data-task="${taskIndex}"]`);
    taskContainer.classList.toggle("complete-task");
    controller.toggleTaskCompletion(model.taskArray[taskIndex]);
}
const _clearContent = (node) => {
    const contentContainer = document.createRange(node);
    contentContainer.selectNodeContents(node);
    contentContainer.deleteContents();
}

export {
    createGeneralPage,
    createLogbookPage
}