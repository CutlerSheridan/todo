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
const createAllProjectsPage = () => {
    _clearContent(_contentDiv);
    _createHeader("allProjects");
    _updateProjectList();
}

const _createHeader = (project) => {
    const headerContainer = document.createElement("header");
    const heading = document.createElement("h1");
    heading.textContent = (() => {
        switch (project) {
            case "logbook":
                return project;
            case "allProjects":
                return "Projects";
            default:
                return project.name;
        };
    })();
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
// this is currying to be able to pass arguments to the callback below and still be able to remove it
const _inputFunctionHandlers = [];
const _replaceNameWithInput = (e) => {
    const allTaskNames = document.querySelectorAll(".task-name");
    allTaskNames.forEach(tName => tName.removeEventListener("click", _replaceNameWithInput));

    const taskIndex = e.target.dataset.task;
    const taskInfoContainer = document.querySelector(`.task-info-container[data-task="${taskIndex}"]`);
    const nameInput = document.createElement("div");
    nameInput.contentEditable = true;
    nameInput.classList.add("name-change-input");
    nameInput.textContent = e.target.textContent;

    e.target.remove();
    taskInfoContainer.prepend(nameInput);
    // all this range/selection stuff makes the cursor start at the end of the div
    const range = document.createRange();
    const selection = window.getSelection();
    range.setStart(nameInput.childNodes[0], nameInput.textContent.length);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    nameInput.focus();

    setTimeout(() => {
        console.log("this =");
        console.log(this);
        document.addEventListener("click", _inputFunctionHandlers[0] = _replaceInputWithName(e, taskInfoContainer, nameInput, taskIndex));
        document.addEventListener("keydown", _inputFunctionHandlers[0]);
    }, 10)
}
const _replaceInputWithName = (e, taskInfoContainer, nameInput, taskIndex) => {
    return function actualFunction(e) {
            if ((e.type === "click" && e.target !== nameInput) || (e.type === "keydown" && e.key === "Enter")) {
                console.log(e);
                console.log(nameInput);
                model.taskArray[taskIndex].name = nameInput.textContent;
                const taskNameElement = document.createElement("div");
                taskNameElement.textContent = nameInput.textContent;
                taskNameElement.classList.add("task-name");
                taskNameElement.dataset.task = taskIndex;
    
                nameInput.remove();
                taskInfoContainer.prepend(taskNameElement);
    
                document.removeEventListener("click", _inputFunctionHandlers[0]);
                document.removeEventListener("keydown", _inputFunctionHandlers[0]);

                _addListenersToTaskNames();
            }
    }
}
const _toggleCompleteClass = (e) => {
    const taskIndex = e.target.dataset.task;
    const taskContainer = document.querySelector(`.task-container[data-task="${taskIndex}"]`);
    taskContainer.classList.toggle("complete-task");
    controller.toggleTaskCompletion(model.taskArray[taskIndex]);
}

// ALL PROJECTS PAGE START
const _updateProjectList = () => {
    let projectListDiv = document.querySelector(".project-list-container");
    if (projectListDiv) {
        _clearContent(projectListDiv);
    } else {
        projectListDiv = document.createElement("section");
        projectListDiv.classList.add("project-list-container");
    }

    const incompleteProjects = document.createElement("section");
    incompleteProjects.classList.add("project-list");
    projectListDiv.append(incompleteProjects);
    controller.sortIncompleteProjects().forEach(project => incompleteProjects.append(_createProjectElement(project)));

    const completeProjects = document.createElement("section");
    completeProjects.classList.add("project-list");
    projectListDiv.append(completeProjects);
    controller.sortCompleteProjects().forEach(project => completeProjects.append(_createProjectElement(project)));

    _contentDiv.append(projectListDiv);
}
const _createProjectElement = (project) => {
    const projectContainer = document.createElement("div");
    projectContainer.classList.add("project-container");

    const projectNameElement = document.createElement("div");
    projectNameElement.textContent = project.name;
    projectContainer.append(projectNameElement);
    if (project.showProgress) {
        // projectContainer.append(_createProgressBar(project));
    } else {
        projectContainer.append(_createRemainingTasksNum(project));
    }
    return projectContainer;
}
const _createProgressBar = (project) => {

}
const _createRemainingTasksNum = (project) => {
    const remainingTasksNum = document.createElement("div");
    remainingTasksNum.classList.add("remaining-tasks-num");
    const numOfTasks = controller.sortIncompleteTasks(project).length;
    remainingTasksNum.textContent = `${numOfTasks} task${numOfTasks === 1 ? "" : "s"}`;
    return remainingTasksNum;
}
// ALL PROJECTS PAGE END

const _clearContent = (node) => {
    const contentContainer = document.createRange(node);
    contentContainer.selectNodeContents(node);
    contentContainer.deleteContents();
}

export {
    createGeneralPage,
    createLogbookPage,
    createAllProjectsPage,
}