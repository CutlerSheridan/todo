import * as controller from "./controller";
import * as model from "./model";
import * as viewTaskForm from "./viewTaskForm";
import { format } from "date-fns";

const _contentDiv = document.querySelector(".content");
let _numOfCheckboxes = 0;
let deleteBtnsAreShowing = false;

const createProjectPage = (e) => {
    let project;
    if (e) {
        const clickedElement = e.currentTarget;
        project = model.projectArray[clickedElement.dataset.project];
        
        const header = document.querySelector("h1");
        if (header && header.textContent.toLowerCase() !== project.name) {
            deleteBtnsAreShowing = false;
        }
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
    const header = document.querySelector("h1");
    if (header.textContent.toLowerCase() !== "logbook") {
        deleteBtnsAreShowing = false;
    }
    clearContent();
    _createHeader("logbook");
    _updateTaskList("logbook");
}

const _createHeader = (project) => {
    const headerContainer = document.createElement("header");
    if (typeof(project) !== "string"
        && project !== model.projectArray[0]) {
            headerContainer.append(createBackBtn("allProjects"));
            headerContainer.append(createEditBox(project, "name", "header-project"));
    } else {
        const heading = document.createElement("div");
        heading.classList.add("header-project-name");
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
    }
    if (project !== "allProjects") {
        if (project !== "logbook") {
            headerContainer.append(_createSortButton(project));
        }
        headerContainer.append(_createRefreshTasksButton(project));
        headerContainer.append(_createDeleteToggle());
    }
    _contentDiv.append(headerContainer);
}
const _createSortButton = (project) => {
    const sortContainer = document.createElement("div");
    sortContainer.classList.add("sort-container");
    const sortLabel = document.createElement("div");
    sortLabel.textContent = "Sort by:";
    const sortBtn = document.createElement("button");
    sortBtn.classList.add("sort-button");
    sortBtn.dataset.project = model.projectArray.indexOf(project);
    sortBtn.textContent = (() => {
        switch(project.sortMethod) {
            case "sortByPriority":
                return "Priority";
            case "sortByDueDate":
                return "Due Date";
            case "sortByCreationTime":
                return "Time Created";
        }
    })();
    sortBtn.addEventListener("click", _changeSortAndUpdate);
    sortContainer.append(sortLabel, sortBtn);
    return sortContainer;
}
const _changeSortAndUpdate = (e) => {
    const projectIndex = e.target.dataset.project;
    const project = model.projectArray[projectIndex];
    controller.swapSortMethod(project);
    createProjectPage(e);
}
const createBackBtn = (project) => {
    const backBtn = document.createElement("button");
    backBtn.classList.add("back-btn");
    backBtn.textContent = "<";
    if (typeof(project) === "object") {
        backBtn.dataset.project = model.projectArray.indexOf(project);
    } else {
        backBtn.dataset.project = "allProjects";
    }
    console.log(`project: ${project}`);
    console.log(`backBtn.dataset.project: ${backBtn.dataset.project}`);
    backBtn.addEventListener("click", (e) => {
        console.log(`e.target.dataset.project: ${e.target.dataset.project}`);
        if (e.target.dataset.project !== "allProjects") {
            createProjectPage(e);
        } else {
            createAllProjectsPage();
        }
    });
    return backBtn;
}
const _createRefreshTasksButton = (project) => {
    const refreshTasks = document.createElement("button");
    refreshTasks.textContent = "Refresh";
    refreshTasks.classList.add("refresh");
    refreshTasks.dataset.project = model.projectArray.indexOf(project);

    refreshTasks.addEventListener("click", (e) => {
        if (project !== "logbook") {
            createProjectPage(e);
        } else {
            createLogbookPage();
        }
    });
    return refreshTasks;
}
const _createDeleteToggle = () => {
    const deleteToggle = document.createElement("button");
    deleteToggle.classList.add("delete-toggle");
    if (deleteBtnsAreShowing) {
        deleteToggle.textContent = "—";
        deleteToggle.dataset.isInactive = -1;

    } else {
        deleteToggle.textContent = "X";
        deleteToggle.dataset.isInactive = 1;
    }

    deleteToggle.addEventListener("click", _toggleDeleteBtns)
    return deleteToggle;
}
const _toggleDeleteBtns = (e) => {
    let isInactive = e.target.dataset.isInactive;
    deleteBtnsAreShowing = !deleteBtnsAreShowing;
    isInactive *= -1;
    if (isInactive > 0) {
        e.target.textContent = "X";
    } else {
        e.target.textContent = "—";
    }
    e.target.dataset.isInactive = isInactive;
    const taskFormBtns = document.querySelectorAll(".task-form-btn");
    const deleteBtns = document.querySelectorAll(".delete-task-btn");
    taskFormBtns.forEach(btn => btn.classList.toggle("invisible"));
    deleteBtns.forEach(btn => btn.classList.toggle("invisible"));
}

const _updateTaskList = (project, deleteButtonsAreOn = false) => {
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
    taskListDiv.append(_createEmptySpaceForBottomOfPage());

    _contentDiv.append(taskListDiv);
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
    const taskName = createEditBox(task, "name", "task");
    taskInfoContainer.append(taskName);
    if (task.dueDate && !task.isComplete) {
        taskInfoContainer.append(_createDueDateElement(task));
    }
    taskContainer.append(taskInfoContainer);
    taskContainer.append(_createTaskFormButton(task));
    taskContainer.append(_createDeleteTaskBtn(task));

    if (task.isHighPriority) {
        taskContainer.classList.add(`priority-high`);
    }
    return taskContainer;
}
const createCheckbox = (task, isChecked = task.isComplete, func = _toggleCompleteClass) => {
    const checkboxContainer = document.createElement("div");
    checkboxContainer.classList.add("checkbox-container");
    const taskIndex = model.taskArray.indexOf(task);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.task = taskIndex;
    checkbox.checked = isChecked;
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
    if (deleteBtnsAreShowing) {
        taskFormBtn.classList.add("invisible");
    }
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
    if (!deleteBtnsAreShowing) {
        deleteBtn.classList.add("invisible");
    }
    deleteBtn.textContent = "X";
    deleteBtn.dataset.task = model.taskArray.indexOf(task);
    deleteBtn.dataset.project = model.projectArray.indexOf(task.project);

    deleteBtn.addEventListener("click", (e) => {
        _deleteTask(e);
        const header = document.querySelector("h1");
        const isLogbook = header.textContent.toLowerCase() === "logbook";
        if (isLogbook) {
            createLogbookPage();
        } else {
            createProjectPage(e);
        }
    });
    return deleteBtn;
}
const _deleteTask = (e) => {
    const taskIndex = e.target.dataset.task;
    controller.deleteTask(taskIndex);
}
const createEditBox = (obj, property, classPrefix) => {
    const propEditBox = document.createElement("div");
    propEditBox.contentEditable = true;
    propEditBox.classList.add(`${classPrefix}-${property}`);
    if (obj[property]) {
        propEditBox.textContent = obj[property];
    } else {
        propEditBox.textContent = `Enter ${property} here`;
    }
    let objectIndex = model.taskArray.indexOf(obj);
    if (objectIndex === -1) {
        objectIndex = model.projectArray.indexOf(obj);
    }
    propEditBox.dataset.task = objectIndex;
    propEditBox.addEventListener("focusin", (e) => {
        _handleEditBoxFocus(e, obj, property);
    });
    return propEditBox;
}
// this is currying to be able to pass arguments to the callback below and still be able to remove it
const _inputHandler = [];
const _handleEditBoxFocus = (e, obj, property) => {
    const domElement = e.target;
    document.addEventListener("click", _inputHandler[0] = _submitTextValue(e, domElement, obj, property));
    domElement.addEventListener("keydown", _inputHandler[0]);
    // document.addEventListener("blur", _inputHandler[0]);
}
const _submitTextValue = (e, domElement, obj, property) => {
    return function realSubmitTextValueFunction(e) {
        if ((e.type === "click" && e.target !== domElement) || (e.type === "keydown" && e.key === "Enter")) {
            // if (e.type !== "blur") {
                domElement.blur();
            // }
            controller.changeProperty(obj, property, domElement.textContent);
            document.removeEventListener("click", _inputHandler[0]);
            domElement.removeEventListener("keydown", _inputHandler[0]);
            // document.removeEventListener("blur", _inputHandler[0]);
            if (domElement.textContent === "") {
                domElement.textContent = `Enter ${property} here`;
            }
        } else if (e.type === "keydown" && domElement.textContent === `Enter ${property} here`) {
            domElement.textContent = "";
        }
    }
}

    // // all this range/selection stuff makes the cursor start at the end of the div
    // const range = document.createRange();
    // const selection = window.getSelection();
    // range.setStart(nameInput.childNodes[0], nameInput.textContent.length);
    // range.collapse(true);
    // selection.removeAllRanges();
    // selection.addRange(range);
    // nameInput.focus();

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
const _createEmptySpaceForBottomOfPage = () => {
    const space = document.createElement("div");
    space.classList.add("empty-space");
    return space;
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
    const totalTasks = project.incompleteTasks + project.completeTasks;
    const percentComplete = project.completeTasks * 100 / totalTasks;
    progressBarInner.style.width = `${percentComplete}%`;

    return progressBarOuter;
}
const _createRemainingTasksNum = (project) => {
    const remainingTasksNum = document.createElement("div");
    remainingTasksNum.classList.add("remaining-tasks-num", "project-progress");
    const numOfTasks = project.incompleteTasks;
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
    createBackBtn,
    createEditBox,
    createLogbookPage,
    createAllProjectsPage,
    createCheckbox,
    clearContent,
}