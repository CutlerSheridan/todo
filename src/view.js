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
    const refreshTasks = document.createElement("div");
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
    completeTasks.classList.add("task-list");
    taskListDiv.append(completeTasks);
    controller.sortCompleteTasks(project).forEach(task => completeTasks.append(_createTaskElement(task)));
    
    _contentDiv.append(taskListDiv);
}
const _createTaskElement = (task) => {
    const taskIndex = model.taskArray.indexOf(task);

    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");
    taskContainer.dataset.task = taskIndex;
    
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.task = taskIndex;
    checkbox.addEventListener("change", _toggleCompleteClass);

    const taskLabel = document.createElement("label");
    taskLabel.classList.add("task-label");
    taskLabel.dataset.task = taskIndex;

    taskLabel.append(checkbox);
    // taskLabel.append(task.name);
    taskContainer.append(taskLabel);

    const taskInfoContainer = document.createElement("div");
    taskInfoContainer.classList.add("task-info-container");
    const taskName = document.createElement("div");
    taskName.textContent = task.name;
    taskName.dataset.task = taskIndex;
    taskInfoContainer.append(taskName);
    taskContainer.append(taskInfoContainer);
    if (task.dueDate && !task.isComplete) {
        taskInfoContainer.append(_createDueDateElement(task));
    }
    if (task.isComplete) {
        checkbox.checked = true;
        taskContainer.classList.add("complete-task");
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