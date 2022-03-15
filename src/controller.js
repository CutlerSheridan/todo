import * as model from "./model";

const _createTask = (name) => {
    return model.Task(name);
}
const _addTaskToArray = (task) => {
    model.taskArray.push(task);
}
const addNewTask = (name) => {
    const task = _createTask(name);
    _addTaskToArray(task);
}
// const _createProject = (name) => {
//     return model.Project(name);
// }
// const _addProjectToArray = (project) => {
//     model.projectArray.push(project);
// }
// const addNewProject = (name) => {
//     const project = _createProject(name);
//     _addProjectToArray(project);
// }
const sortIncompleteTasks = (project = model.projectArray[0]) => {
    const sortedArray = model.taskArray
        .filter(task => task.project === project)
        .filter(task => !task.isComplete)
        .sort((x, y) => x.priority > y.priority ? -1 : 1);
    return sortedArray;
}
const sortCompleteTasks = (project = model.projectArray[0]) => {
    const sortedArray = model.taskArray
        .filter(task => task.project === project)
        .filter(task => task.isComplete)
        .sort((x, y) => x.completionDateTime > y.completionDateTime ? -1 : 1);
    return sortedArray;
}
const toggleTaskCompletion = (task) => {
    task.isComplete = !task.isComplete;
    if (task.isComplete) {
        // task.completionDateTime = currentTime;
    } else {
        task.completionDateTime = null;
    }
}

export {
    addNewTask,
    toggleTaskCompletion,
    sortIncompleteTasks,
    sortCompleteTasks,
}