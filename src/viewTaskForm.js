import * as model from "./model";
import * as view from "./view";

const createTaskForm = (e) => {
    const task = model.taskArray[e.target.dataset.task];

    _createHeader(task);
}

const _createHeader = (task) => {
    const header = document.createElement("header");
    const backBtn = document.createElement("button");

    view.createCheckbox(task);
}

export {
    createTaskForm,
}