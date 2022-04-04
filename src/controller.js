import * as model from "./model";
import { compareAsc, compareDesc } from "date-fns";

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
const sortIncompleteTasks = (project) => {
    const sortedArray = model.taskArray
        .filter(task => task.project === project)
        .filter(task => !task.isComplete)
        .sort((x, y) => {
            if (x.priority > y.priority) {
                return -1;
            } else if (x.priority < y.priority) {
                return 1;
            } else {
                if (!x.dueDate && y.dueDate) {
                    return 1;
                } else if (x.dueDate && !y.dueDate) {
                    return -1;
                } else {
                    const comparison = compareAsc(x.dueDate, y.dueDate);
                    if (comparison !== 0) {
                        return comparison;
                    } else {
                        return compareDesc(x.creationDateTime, y.creationDateTime);
                    }
                }
            }
        });
    return sortedArray;
}
const sortCompleteTasks = (project) => {
    let sortedArray = model.taskArray.filter(task => task.isComplete);
    if (project !== "logbook") {
        sortedArray = sortedArray.filter(task => task.project === project);
    }
    sortedArray.sort((x, y) => compareDesc(x.completionDateTime, y.completionDateTime));
    return sortedArray;
}
const sortIncompleteProjects = () => {
    const sortedProjects = model.projectArray
        .filter(project => sortIncompleteTasks(project).length > 0);
    return sortedProjects;
}
const sortCompleteProjects = () => {
    const sortedProjects = model.projectArray
        .filter(project => 
            sortIncompleteTasks(project).length === 0
            && sortCompleteTasks(project).length > 0);
    return sortedProjects;
}
const toggleTaskCompletion = (task) => {
    task.isComplete = !task.isComplete;
    if (task.isComplete) {
        task.completionDateTime = new Date();
    } else {
        task.completionDateTime = null;
    }
}

export {
    addNewTask,
    toggleTaskCompletion,
    sortIncompleteTasks,
    sortCompleteTasks,
    sortIncompleteProjects,
    sortCompleteProjects,
}