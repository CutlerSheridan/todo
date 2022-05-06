import * as model from "./model";
import * as view from "./view";
import * as controller from "./controller";
import { format } from "date-fns";

const _contentDiv = document.querySelector(".content");

const createTaskForm = (e) => {
    view.clearContent();
    const task = model.taskArray[e.target.dataset.task];

    if (e.target.dataset.projectName === "allIncompleteTasks") {
        _contentDiv.append(_createHeader(task, true));
    } else {
        _contentDiv.append(_createHeader(task));
    }
    _contentDiv.append(_createChoiceContainer(
        "Project",
        _createProjectDropdown,
        task
    ));
    _contentDiv.append(_createChoiceContainer(
        "High priority?",
        _createPriorityToggle,
        task
    ));
    _contentDiv.append(_createChoiceContainer(
        "Due date?",
        _createDueDateOptions,
        task
    ));
    _contentDiv.append(_createChoiceContainer(
        "Notes:",
        _createNotesBox,
        task
    ))
    _contentDiv.append(_createDateCompleted(task));
    const allCheckboxes = document.querySelectorAll(".checkbox-container");
    allCheckboxes.forEach(checkbox => checkbox.classList.add("tf-checkbox-container"));
}

const _createHeader = (task, arrivedFromLogbook = false) => {
    const header = document.createElement("header");
    header.classList.add("tf-header");

    if (arrivedFromLogbook) {
        header.append(view.createBackBtn("allIncompleteTasks"));
    } else {
        header.append(view.createBackBtn(task.project));
    }
    header.append(view.createCheckbox(task));
    const _taskName = view.createEditBox(task, "name", "tf-task");
    header.append(_taskName);

    return header;
}

const _createChoiceContainer = (text, func, task) => {
    const choiceContainer = document.createElement("div");
    choiceContainer.classList.add("choice-container");
    choiceContainer.append(
        _createChoiceLabel(text),
        func(task));
    return choiceContainer;
}
const _createChoiceLabel = (text) => {
    const choiceLabel = document.createElement("div");
    choiceLabel.classList.add("choice-label");
    choiceLabel.textContent = text;
    return choiceLabel;
}
const _createProjectDropdown = (task) => {
    const projectDropdown = document.createElement("select");
    projectDropdown.dataset.task = model.taskArray.indexOf(task);
    model.projectArray.forEach(project => {
        const projectOption = document.createElement("option");
        projectOption.value = project.name;
        projectOption.textContent = project.name;
        projectDropdown.append(projectOption);
    })
    const proj = task.project;
    projectDropdown.value = proj.name;
    projectDropdown.addEventListener("change", (e) => {
        const newProj = model.projectArray.find(project => project.name === e.target.value);
        const task = model.taskArray[e.target.dataset.task];
        controller.changeProperty(task, "project", newProj);
    })
    return projectDropdown;
}
const _createPriorityToggle = (task) => {
    const _togglePriority = (e) => {
        const task = model.taskArray[e.target.dataset.task];
        controller.changeProperty(task, "isHighPriority", !task.isHighPriority);
    }
    const checkboxContainer = view.createCheckbox(task, task.isHighPriority, _togglePriority);
    return checkboxContainer;
}
const _createDueDateOptions = (task) => {
    const dueDateOptionsContainer = document.createElement("div");
    dueDateOptionsContainer.classList.add("tf-due-date-container");
    const picker = _createDueDatePicker(task);
    const toggle = view.createCheckbox(task, task.dueDate, _toggleDueDate);

    dueDateOptionsContainer.append(toggle, picker);
    return dueDateOptionsContainer;
}
const _toggleDueDate = (e) => {
    const task = model.taskArray[e.target.dataset.task];
    const picker = document.querySelector("input[type='date']");
    if (task.dueDate) {
        controller.changeProperty(task, "dueDate", null);
        picker.disabled = true;
    } else {
        const yearMonthDay = picker.value.split("-");
        controller.changeProperty(task, "dueDate", new Date(yearMonthDay[0], yearMonthDay[1] - 1, yearMonthDay[2]));
        picker.disabled = false;
    }
}
const _createDueDatePicker = (task) => {
    const picker = document.createElement("input");
    picker.type = "date";
    picker.dataset.task = model.taskArray.indexOf(task);
    if (task.dueDate) {
        picker.value = format(task.dueDate, "yyyy-MM-dd");
    } else {
        picker.value = format(new Date(), "yyyy-MM-dd");
        picker.disabled = true;
    }
       
    const _changeDueDate = (e) => {
        const task = model.taskArray[e.target.dataset.task];
        const yearMonthDay = picker.value.split("-");
        controller.changeProperty(task, "dueDate", new Date(yearMonthDay[0], yearMonthDay[1] - 1, yearMonthDay[2]));
    }
    picker.addEventListener("change", _changeDueDate);

    return picker;
}
const _createNotesBox = (task) => {
    return view.createEditBox(task, "notes", "tf-task");
}
const _createDateCompleted = (task) => {
    const completionStamp = document.createElement("div");
    completionStamp.classList.add("completion-date");
    if (task.completionDateTime) {
        completionStamp.textContent = `Completed on ${format(task.completionDateTime, "MMMM do, yyyy")}`;
    } else {
        completionStamp.classList.add("invisible");
    }
    const taskCheckbox = document.querySelector("#checkbox-0");
    taskCheckbox.addEventListener("change", (e) => {
        completionStamp.textContent = `Completed on ${format(new Date(), "MMMM do, yyyy")}`;
        completionStamp.classList.toggle("invisible");
    })
    return completionStamp;
}

export {
    createTaskForm,
}