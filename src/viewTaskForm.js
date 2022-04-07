import * as model from "./model";
import * as view from "./view";
import * as controller from "./controller";
import { format } from "date-fns";

const _contentDiv = document.querySelector(".content");

const createTaskForm = (e) => {
    const task = model.taskArray[e.target.dataset.task];

    _contentDiv.append(_createHeader(task));
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
    ))
}

const _createHeader = (task) => {
    const header = document.createElement("header");
    header.classList.add("tf-header");

    header.append(_createBackBtn(task));
    header.append(view.createCheckbox(task));
    const _taskName = _createEditBox(task, "name");
    header.append(_taskName);

    return header;
}
const _createBackBtn = (task) => {
    const backBtn = document.createElement("button");
    backBtn.classList.add("back-btn");
    backBtn.dataset.project = model.projectArray.indexOf(task.project);
    backBtn.textContent = "<";
    backBtn.addEventListener("click", (e) => {
        view.createProjectPage(e);
    });
    return backBtn;
}
const _createEditBox = (task, property) => {
    const propEditBox = document.createElement("div");
    propEditBox.contentEditable = true;
    propEditBox.classList.add(`tf-task-${property}`);
    propEditBox.textContent = task[property];
    propEditBox.dataset.task = model.taskArray.indexOf(task);
    propEditBox.addEventListener("focusin", (e) => {
        _handleEditBoxFocus(e, task, property);
    });
    return propEditBox;
}
const _inputHandler = [];
const _handleEditBoxFocus = (e, task, property) => {
    const domElement = e.target;
    document.addEventListener("click", _inputHandler[0] = _submitTextValue(e, domElement, task, property));
    domElement.addEventListener("keydown", _inputHandler[0]);
    // document.addEventListener("blur", _inputHandler[0]);
}
const _submitTextValue = (e, domElement, task, property) => {
    return function realSubmitTextValueFunction(e) {
        if ((e.type === "click" && e.target !== domElement) || (e.type === "keydown" && e.key === "Enter")) {
            // if (e.type !== "blur") {
            //     domElement.blur();
            // }
            controller.changeProperty(task, property, domElement.textContent);
            domElement.textContent = "success!";
            document.removeEventListener("click", _inputHandler[0]);
            domElement.removeEventListener("keydown", _inputHandler[0]);
            // document.removeEventListener("blur", _inputHandler[0]);
        }
    }
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
        console.log(task.isComplete);
    }
    const checkboxContainer = view.createCheckbox(task, task.isHighPriority, _togglePriority);
    return checkboxContainer;
}
const _createDueDateOptions = (task) => {
    const dueDateOptionsContainer = document.createElement("div");
    dueDateOptionsContainer.classList.add("tf-due-date-container");
    const picker = _createDueDatePicker(task);
    const toggle = _createDueDateToggle(task);
    
    dueDateOptionsContainer.append(toggle, picker);
    return dueDateOptionsContainer;
}
const _createDueDateToggle = (task) => {
    const _toggleDueDate = (e) => {
        const task = model.taskArray[e.target.dataset.task];
        const picker = document.querySelector("input[type='date']");
        if (task.dueDate) {
            console.log(picker.value);
            console.log(task.dueDate);
            controller.changeProperty(task, "dueDate", null);
            picker.disabled = true;
        } else {
            const yearMonthDay = picker.value.split("-");
            controller.changeProperty(task, "dueDate", new Date(yearMonthDay[0], yearMonthDay[1] - 1, yearMonthDay[2]));
            picker.disabled = false;
        }
    }
    const checkboxContainer = view.createCheckbox(task, task.dueDate, _toggleDueDate);
    return checkboxContainer;
}
const _createDueDatePicker = (task) => {
    const picker = document.createElement("input");
    picker.type = "date";
    if (task.dueDate) {
        picker.value = format(task.dueDate, "yyyy-MM-dd");
        console.log(format(task.dueDate, "yyyy-MM-dd"));
    } else {
        picker.value = format(new Date(), "yyyy-MM-dd");
        picker.disabled = true;
    }

    return picker;
}

export {
    createTaskForm,
}