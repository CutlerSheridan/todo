import * as controller from "./controller";
import * as model from "./model";
import * as viewTaskForm from "./viewTaskForm";
import { compareAsc, format, isPast } from "date-fns";

const _contentDiv = document.querySelector(".content");

const createProjectPage = (e) => {
    let project;
    if (e) {
        const clickedElement = e.currentTarget;
        project = model.projectArray[clickedElement.dataset.project];
    } else {
        project = model.projectArray[0];
    }
    clearContent();
    _createHeader(project);
    _updateTaskList(project);
    _createNewItemButton(project);
}
const createAllProjectsPage = () => {
    clearContent();
    _createHeader("allProjects");
    _updateProjectList();
    _createNewItemButton("allProjects");
}
const createLogbookPage = () => {
    clearContent();
    _createHeader("logbook");
    _updateTaskList("logbook");
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
    if (project !== "allProjects") {
        _createRefreshTasksButton(project, headerContainer);
    }
    _contentDiv.append(headerContainer);
}
const _createRefreshTasksButton = (project, containingElement) => {
    const refreshTasks = document.createElement("button");
    refreshTasks.textContent = "Refresh";
    refreshTasks.classList.add("refresh");
    containingElement.append(refreshTasks);
    refreshTasks.addEventListener("click", () => {
        _updateTaskList(project);
    });
}
const _updateTaskList = (project) => {
    let taskListDiv = document.querySelector(".task-list-container");
    if (taskListDiv) {
        clearContent(taskListDiv);
    } else {
        taskListDiv = document.createElement("section");
        taskListDiv.classList.add("task-list-container");
    }

    if (project !== "logbook") {
        const incompleteTasks = document.createElement("section");
        incompleteTasks.classList.add("task-list", "incomplete-task-list");
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

    taskContainer.append(createCheckbox(task));
    if (task.isComplete) {
        taskContainer.classList.add("complete-task");
    }

    const taskInfoContainer = document.createElement("div");
    taskInfoContainer.classList.add("task-info-container");
    taskInfoContainer.dataset.task = taskIndex;
    const taskName = document.createElement("div");
    taskName.textContent = task.name;
    taskName.classList.add("task-name");
    taskName.dataset.task = taskIndex;
    taskInfoContainer.append(taskName);
    if (task.dueDate && !task.isComplete) {
        taskInfoContainer.append(_createDueDateElement(task));
    }
    taskContainer.append(taskInfoContainer);
    taskContainer.append(_createTaskFormButton(task));
    // taskContainer.append(_createDeleteTaskBtn(task));

    if (task.isHighPriority) {
        taskContainer.classList.add(`priority-high`);
    }
    return taskContainer;
}
let _numOfCheckboxes = 0;
const createCheckbox = (task, isChecked = task.isComplete, func = _toggleCompleteClass) => {
    const checkboxContainer = document.createElement("div");
    checkboxContainer.classList.add("checkbox-container");
    const taskIndex = model.taskArray.indexOf(task);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.task = taskIndex;
    checkbox.checked = isChecked;

    console.log(task.name);
    console.log(_numOfCheckboxes);
    checkbox.id = `checkbox-${_numOfCheckboxes}`;

    const taskLabel = document.createElement("label");
    taskLabel.classList.add("task-label");
    taskLabel.dataset.task = taskIndex;
    taskLabel.htmlFor = `checkbox-${_numOfCheckboxes}`;
    taskLabel.addEventListener("click", func);

    checkboxContainer.append(checkbox, taskLabel);
    _numOfCheckboxes++;
    return checkboxContainer;
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
const _createTaskFormButton = (task) => {
    const taskFormBtn = document.createElement("button");
    taskFormBtn.classList.add("task-form-btn");
    taskFormBtn.textContent = ">";
    taskFormBtn.dataset.task = model.taskArray.indexOf(task);

    taskFormBtn.addEventListener("click", (e) => {
        setTimeout(() => {viewTaskForm.createTaskForm(e)}, 10);
    })
    return taskFormBtn;
}
const _createDeleteTaskBtn = (task, taskIndex) => {
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-task-btn");
    deleteBtn.textContent = "X";
    deleteBtn.dataset.task = model.taskArray.indexOf(task);

    deleteBtn.addEventListener("click", (e) => {
        _deleteTask(e);
        _updateTaskList(task.project);
    });
    return deleteBtn;
}
const _deleteTask = (e) => {
    const taskIndex = e.target.dataset.task;
    controller.deleteTask(taskIndex);
}
const _addListenersToTaskNames = () => {
    const allTaskNames = document.querySelectorAll(".task-name");
    allTaskNames.forEach(tName => tName.addEventListener("click", _replaceTaskNameWithInput))
}
// this is currying to be able to pass arguments to the callback below and still be able to remove it
const _inputFunctionHandlers = [];
const _replaceTaskNameWithInput = (e) => {
    const allTaskNames = document.querySelectorAll(".task-name");
    allTaskNames.forEach(tName => tName.removeEventListener("click", _replaceTaskNameWithInput));

    let nameBox;
    if (e.target) {
        nameBox = e.target;
    } else {
        nameBox = e;
    }
    const taskIndex = nameBox.dataset.task;
    const taskInfoContainer = document.querySelector(`.task-info-container[data-task="${taskIndex}"]`);
    const nameInput = document.createElement("div");
    nameInput.contentEditable = true;
    nameInput.classList.add("name-change-input");
    nameInput.textContent = nameBox.textContent;

    nameBox.remove();
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
        document.addEventListener("click", _inputFunctionHandlers[0] = _replaceTaskInputWithName(e, taskInfoContainer, nameInput, taskIndex));
        document.addEventListener("keydown", _inputFunctionHandlers[0]);
    }, 10)
}
const _replaceTaskInputWithName = (e, taskInfoContainer, nameInput, taskIndex) => {
    return function actualFunction(e) {
            if ((e.type === "click" && e.target !== nameInput) || (e.type === "keydown" && e.key === "Enter")) {
                if (nameInput.textContent === "") {
                    nameInput.textContent = "New task name?";
                }
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
                _updateTaskList(model.taskArray[taskIndex].project);
            } else if (e.type === "keydown" && nameInput.textContent === "New task name?") {
                nameInput.textContent = "";
            }
    }
}
const _toggleCompleteClass = (e) => {
    const taskIndex = e.target.dataset.task;
    const taskContainer = document.querySelector(`.task-container[data-task="${taskIndex}"]`);
    if (taskContainer) {
        taskContainer.classList.toggle("complete-task");
    }
    controller.toggleTaskCompletion(model.taskArray[taskIndex]);
}

const _createNewItemButton = (project) => {
    const newItemBtn = document.createElement("button");
    newItemBtn.classList.add("new-item-btn");
    newItemBtn.textContent = "+";
    _contentDiv.append(newItemBtn);

    const footer = document.querySelector("footer");
    const displacementAmount = 15;
    newItemBtn.style.right = displacementAmount + "px";
    newItemBtn.style.bottom = footer.offsetHeight + displacementAmount + "px";

    newItemBtn.addEventListener("click", (e) => {
        _insertNewItemInput(e, project);
    })
}
const _insertNewItemInput = (e, project) => {
        if (project !== "allProjects") {
            const incompleteTaskList = document.querySelector(".incomplete-task-list");
            const newTask = controller.addNewTask("New task name?", project);
            incompleteTaskList.append(_createTaskElement(newTask));
            const taskNameDiv = document.querySelector(`.task-name[data-task="${model.taskArray.indexOf(newTask)}"]`);
            _replaceTaskNameWithInput(taskNameDiv);
        } else {
            _removeListenersFromProjects();
            
            const incompleteProjects = document.querySelector(".incomplete-project-list");
            const newProject = controller.addNewProject("New project name?");
            const projectIndex = model.projectArray.indexOf(newProject);
            incompleteProjects.append(_createProjectElement(newProject));
            const projectNameDiv = document.querySelector(`.project-container[data-project="${projectIndex}"] .project-name`);

             // all this range/selection stuff makes the cursor start at the end of the div
            const range = document.createRange();
            const selection = window.getSelection();
            range.setStart(projectNameDiv.childNodes[0], projectNameDiv.textContent.length);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            projectNameDiv.focus();

            setTimeout(() => {
                document.addEventListener("click", _inputFunctionHandlers[1] = _replaceProjectInputWithName(e, projectNameDiv, projectIndex));
                document.addEventListener("keydown", _inputFunctionHandlers[1]);
            }, 10)
        }
}
// ALL PROJECTS PAGE START
const _updateProjectList = () => {
    let projectListDiv = document.querySelector(".project-list-container");
    if (projectListDiv) {
        clearContent(projectListDiv);
    } else {
        projectListDiv = document.createElement("section");
        projectListDiv.classList.add("project-list-container");
    }

    const incompleteProjects = document.createElement("section");
    incompleteProjects.classList.add("project-list", "incomplete-project-list");
    projectListDiv.append(incompleteProjects);
    controller.sortIncompleteProjects().forEach(project => incompleteProjects.append(_createProjectElement(project)));

    const completeProjects = document.createElement("section");
    completeProjects.classList.add("project-list");
    projectListDiv.append(completeProjects);
    controller.sortCompleteProjects().forEach(project => completeProjects.append(_createProjectElement(project, true)));

    _contentDiv.append(projectListDiv);
    _addListenersToProjects();
}
const _createProjectElement = (project, isComplete = false) => {
    const projectContainer = document.createElement("div");
    projectContainer.classList.add("project-container");
    projectContainer.dataset.project = model.projectArray.indexOf(project);

    const projectNameElement = document.createElement("div");
    projectNameElement.classList.add("project-name");
    projectNameElement.textContent = project.name;
    projectNameElement.contentEditable = true;
    projectNameElement.addEventListener("mousedown", (e) => {
        e.preventDefault();
    });
    projectContainer.append(projectNameElement);
    if (!isComplete) {
        if (project.showProgress) {
            projectContainer.append(_createProgressBar(project));
        } else {
            projectContainer.append(_createRemainingTasksNum(project));
        }
    }
    return projectContainer;
}
const _createProgressBar = (project) => {
    const progressBarOuter = document.createElement("div");
    progressBarOuter.classList.add("progress-bar-outer", "project-progress");
    const progressBarInner = document.createElement("div");
    progressBarInner.classList.add("progress-bar-inner");
    progressBarOuter.append(progressBarInner);

    progressBarOuter.style.width = "50%";
    const completeTasks = controller.sortCompleteTasks(project).length;
    const totalTasks = controller.sortIncompleteTasks(project).length + completeTasks;
    const percentComplete = completeTasks * 100 / totalTasks;
    progressBarInner.style.width = `${percentComplete}%`;

    return progressBarOuter;
}
const _createRemainingTasksNum = (project) => {
    const remainingTasksNum = document.createElement("div");
    remainingTasksNum.classList.add("remaining-tasks-num", "project-progress");
    const numOfTasks = controller.sortIncompleteTasks(project).length;
    remainingTasksNum.textContent = `${numOfTasks} task${numOfTasks === 1 ? "" : "s"}`;
    return remainingTasksNum;
}
const _addListenersToProjects = () => {
    const allProjects = document.querySelectorAll(".project-container");
    allProjects.forEach(projectElement => projectElement.addEventListener("click", createProjectPage));
}
const _removeListenersFromProjects = () => {
    const allProjects = document.querySelectorAll(".project-container");
    allProjects.forEach(projectElement => projectElement.removeEventListener("click", createProjectPage));
}
const _replaceProjectInputWithName = (e, nameInput, projectIndex) => {
    return function actualFunction(e) {
            if ((e.type === "click" && e.target !== nameInput) || (e.type === "keydown" && e.key === "Enter")) {
                model.projectArray[projectIndex].name = nameInput.textContent;
                const projectNameElement = document.createElement("div");
                projectNameElement.textContent = nameInput.textContent;
                projectNameElement.classList.add("project-name");
                projectNameElement.dataset.project = projectIndex;
    
                nameInput.remove();
                const projectContainer = document.querySelector(`.project-container[data-project="${projectIndex}"]`);
                projectContainer.prepend(projectNameElement);
    
                document.removeEventListener("click", _inputFunctionHandlers[1]);
                document.removeEventListener("keydown", _inputFunctionHandlers[1]);

                _updateProjectList();
            } else if (e.type === "keydown" && nameInput.textContent === "New project name?") {
                nameInput.textContent = "";
            }
    }
}
// ALL PROJECTS PAGE END

const clearContent = (node = _contentDiv) => {
    const contentContainer = document.createRange(node);
    contentContainer.selectNodeContents(node);
    contentContainer.deleteContents();
    _numOfCheckboxes = 0;
}

export {
    createProjectPage,
    createLogbookPage,
    createAllProjectsPage,
    createCheckbox,
    clearContent,
}