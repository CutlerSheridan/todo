import * as model from "./model";
import { parseJSON } from "date-fns";

const addNewTask = (name, project = model.projectArray[0]) => {
    const task = _createTask(name, project);
    _addTaskToArray(task);
    _addTaskToProject(task);

    localStorage.setItem("storedTaskArray", JSON.stringify(model.taskArray));
    localStorage.setItem("storedProjectArray", JSON.stringify(model.projectArray));
    return task;
}
const _createTask = (name, project) => {
    return model.Task(name, project);
}
const _addTaskToArray = (task) => {
    model.taskArray.push(task);
}
const deleteTask = (taskIndex) => {
    const task = model.taskArray[taskIndex];
    _subtractTaskFromProject(task);
    model.taskArray.splice(taskIndex, 1);

    localStorage.setItem("storedTaskArray", JSON.stringify(model.taskArray));
    localStorage.setItem("storedProjectArray", JSON.stringify(model.projectArray));
}
const addNewProject = (name, showProgress = true) => {
    const project = _createProject(name, showProgress);
    _addProjectToArray(project);
    localStorage.setItem("storedProjectArray", JSON.stringify(model.projectArray));
    return project;
}
const _createProject = (name, showProgress) => {
    return model.Project(name, showProgress);
}
const _addProjectToArray = (project) => {
    model.projectArray.push(project);
}
const deleteProject = (projectIndex) => {
    _deleteTasksFromProject(projectIndex);
    model.projectArray.splice(projectIndex, 1);

    localStorage.setItem("storedTaskArray", JSON.stringify(model.taskArray));
    localStorage.setItem("storedProjectArray", JSON.stringify(model.projectArray));
}
const _deleteTasksFromProject = (projectIndex) => {
    const filteredTasks = model.taskArray.filter(task => task.project === model.projectArray[projectIndex]);
    const testTaskIndices = [];
    filteredTasks.forEach(task => testTaskIndices.push(model.taskArray.indexOf(task)));
    const taskIndicesToDelete = model.taskArray.filter(task => task.project === model.projectArray[projectIndex])
        .map(task => model.taskArray.indexOf(task));
    for (let i = taskIndicesToDelete.length - 1; i >= 0; i--) {
        deleteTask(taskIndicesToDelete[i]);
    }
}
const changeProperty = (object, property, newValue) => {
    if (property === "project") {
        _subtractTaskFromProject(object);
    }
    object[property] = newValue;
    if (property === "project") {
        _addTaskToProject(object);
    }
    if (model.taskArray.length > 0) {
        localStorage.setItem("storedTaskArray", JSON.stringify(model.taskArray));
    }
    if (model.projectArray.length > 0) {
        localStorage.setItem("storedProjectArray", JSON.stringify(model.projectArray));
    }
}
const _addTaskToProject = (task) => {
    if (task.isComplete) {
        task.project.completeTasks++;
    } else {
        task.project.incompleteTasks++;
    }
}
const _subtractTaskFromProject = (task) => {
    if (task.isComplete) {
        task.project.completeTasks--;
    } else {
        task.project.incompleteTasks--;
    }
}
const sortIncompleteTasks = (project) => {
    const sortedArray = model.taskArray
        .filter(task => task.project === project)
        .filter(task => !task.isComplete)
        .sort((x, y) => {
            let result = 0;
            result = sortMethod[project.sortMethod](x, y);
            if (result !== 0) {
                return result;
            }
            for (let func in sortMethod) {
                if (func !== project.sortMethod) {
                    result = sortMethod[func](x, y);
                    if (result !== 0) {
                        return result;
                    }
                }
            }
            return result;
        });
    return sortedArray;
}
const sortMethod = (() => {
    const sortByPriority = (x, y) => {
        return y.isHighPriority - x.isHighPriority;
    }
    const sortByDueDate = (x, y) => {
        if (!x.dueDate && y.dueDate) {
            return 1;
        } else if (x.dueDate && !y.dueDate) {
            return -1;
        } else {
            return x.dueDate - y.dueDate;
        }
    }
    const sortByCreationTime = (x, y) => {
        return y.creationDateTime - x.creationDateTime;
    }
    const sortByAlphabet = (x, y) => {
        return x.name.localeCompare(y.name);
    }
    return {
        sortByPriority,
        sortByDueDate,
        sortByCreationTime,
        sortByAlphabet,
    }
})();
const swapSortMethod = (project) => {
    const projectIndex = model.projectArray.indexOf(project);
    const sortMethodIndex = model.sortMethods.indexOf(project.sortMethod);
    project.sortMethod = model.sortMethods[(sortMethodIndex + 1) % model.sortMethods.length];

    localStorage.setItem("storedProjectArray", JSON.stringify(model.projectArray));
}
const sortCompleteTasks = (project) => {
    let sortedArray = model.taskArray.filter(task => task.isComplete);
    if (project !== "logbook") {
        sortedArray = sortedArray.filter(task => task.project === project);
    }
    sortedArray.sort((x, y) => y.completionDateTime - x.completionDateTime);
    return sortedArray;
}
const sortIncompleteProjects = () => {
    const sortedProjects = model.projectArray
        .filter(project => {
            return project.incompleteTasks > 0
                || (project.incompleteTasks === 0 && project.completeTasks === 0)
        }).sort((a, b) => a.name.localeCompare(b.name));
    return sortedProjects;
}
const sortCompleteProjects = () => {
    return model.projectArray
        .filter(project =>
            project.incompleteTasks === 0
            && project.completeTasks > 0);
}
const toggleTaskCompletion = (task) => {
    _subtractTaskFromProject(task);
    task.isComplete = !task.isComplete;
    _addTaskToProject(task);

    if (task.isComplete) {
        task.completionDateTime = new Date();
    } else {
        task.completionDateTime = null;
    }

    localStorage.setItem("storedTaskArray", JSON.stringify(model.taskArray));
    localStorage.setItem("storedProjectArray", JSON.stringify(model.projectArray));
}
const repopulateDataFromLocalStorage = () => {
    if (localStorage.length > 0) {
        _repopulateProjects();
        _repopulateTasks();
    } else {
        return;
    }
}
const _repopulateProjects = () => {
    if (localStorage.getItem("storedProjectArray")) {
        const storedProjectArray = JSON.parse(localStorage.getItem("storedProjectArray"));
        localStorage.removeItem("storedProjectArray");
        storedProjectArray.forEach(project => {
            const newProj = addNewProject(project.name);
            for (let prop in project) {
                if (prop === "timeCreated") {
                    changeProperty(newProj, prop, parseJSON(project[prop]));
                } else if (prop !== "incompleteTasks"
                    && prop !== "completeTasks") {
                    changeProperty(newProj, prop, project[prop]);
                }
            }
        })
    }
}
const _repopulateTasks = () => {
    if (localStorage.getItem("storedTaskArray")) {
        const storedTaskArray = JSON.parse(localStorage.getItem("storedTaskArray"));
        localStorage.removeItem("storedTaskArray");
        storedTaskArray.forEach(task => {
            const projectIndex = model.projectArray.findIndex(project => {
                return (project.name === task.project.name
                    && project.showProgress === task.project.showProgress
                    && project.sortMethod === task.project.sortMethod
                )
            });
            const newTask = addNewTask(task.name, model.projectArray[projectIndex]);
            for (let prop in task) {
                if (prop === "dueDate"
                    || prop === "completionDateTime"
                    || prop === "creationDateTime"
                ) {
                    if (task[prop] !== null) {
                        changeProperty(newTask, prop, parseJSON(task[prop]));
                    }
                } else if (prop === "isComplete") {
                    if (task[prop] === true) {
                        toggleTaskCompletion(newTask);
                    }
                } else if (prop !== "isPastDue" && prop !== "project") {
                    changeProperty(newTask, prop, task[prop]);
                }
            }
        })
    }
}


export {
    addNewTask,
    deleteTask,
    addNewProject,
    deleteProject,
    changeProperty,
    toggleTaskCompletion,
    swapSortMethod,
    sortIncompleteTasks,
    sortCompleteTasks,
    sortIncompleteProjects,
    sortCompleteProjects,
    repopulateDataFromLocalStorage,
}