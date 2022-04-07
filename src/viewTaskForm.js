import * as model from "./model";
import * as view from "./view";
import * as controller from "./controller";

const _contentDiv = document.querySelector(".content");

const createTaskForm = (e) => {
    const task = model.taskArray[e.target.dataset.task];

    _contentDiv.append(_createHeader(task));
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

export {
    createTaskForm,
}