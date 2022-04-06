import * as model from "./model";

const createTaskForm = (e) => {
    const task = model.taskArray[e.target.dataset.task];
}

export {
    createTaskForm,
}