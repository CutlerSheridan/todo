import * as controller from "./controller";
import * as model from "./model";
import { compareAsc, format, isPast } from "date-fns";

const _contentDiv = document.querySelector(".content");

const createGeneralPage = () => {
    _clearContent();
    // create header
    const heading = document.createElement("h1");
    heading.textContent = "General";
    _contentDiv.append(heading);
    const refreshTasks = document.createElement("div");
    refreshTasks.textContent = "Refresh";
    refreshTasks.classList.add("refresh");
    _contentDiv.append(refreshTasks);
    refreshTasks.addEventListener("click", () => {
        _clearContent();
        createGeneralPage();
    });
    _updateTaskList(model.projectArray[0]);
}
const createLogbookPage = () => {
    _clearContent();
    const heading = document.createElement("h1");
    heading.textContent = "Logbook";
    _contentDiv.append(heading);
    const refreshTasks = document.createElement("div");
    refreshTasks.textContent = "Refresh";
    refreshTasks.classList.add("refresh");
    _contentDiv.append(refreshTasks);
    refreshTasks.addEventListener("click", () => {
        _clearContent();
        createLogbookPage();
    });
    _updateTaskList("logbook");
}

const _updateTaskList = (project) => {
    const taskListDiv = document.createElement("section");
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
    if (task.dueDate && !task.isComplete) {
        taskContainer.append(_createDueDateElement(task));
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
const _clearContent = () => {
    const contentContainer = document.createRange(_contentDiv);
    contentContainer.selectNodeContents(_contentDiv);
    contentContainer.deleteContents();
}

export {
    createGeneralPage,
    createLogbookPage
}