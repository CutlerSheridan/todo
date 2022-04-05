import * as model from "./model";
import { compareAsc, compareDesc } from "date-fns";

const _createTask = (name, project) => {
    return model.Task(name, project);
}
const _addTaskToArray = (task) => {
    model.taskArray.push(task);
}
const addNewTask = (name, project = model.projectArray[0]) => {
    const task = _createTask(name, project);
    _addTaskToArray(task);
    return task;
}
const _createProject = (name, showProgress) => {
    return model.Project(name, showProgress);
}
const _addProjectToArray = (project) => {
    model.projectArray.push(project);
}
const addNewProject = (name, showProgress = true) => {
    const project = _createProject(name,showProgress);
    _addProjectToArray(project);
    return project;
}
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
        .filter(project => {
            const numOfIncompleteTasks = sortIncompleteTasks(project).length;
            const numOfCompleteTasks = sortCompleteTasks(project).length; 
            return numOfIncompleteTasks > 0
                || (numOfCompleteTasks === 0 && numOfIncompleteTasks === 0);
        });
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

const addTasksToProject = (project, ...tasks) => {
    for (let i = 0; i < tasks.length; i++) {
        tasks[i].project = project;
    }
}

export {
    addNewTask,
    addNewProject,
    toggleTaskCompletion,
    sortIncompleteTasks,
    sortCompleteTasks,
    sortIncompleteProjects,
    sortCompleteProjects,
    addTasksToProject,
}