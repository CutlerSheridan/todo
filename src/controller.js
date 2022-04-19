import * as model from "./model";

const _createTask = (name, project) => {
    return model.Task(name, project);
}
const _addTaskToArray = (task) => {
    model.taskArray.push(task);
}
const addNewTask = (name, project = model.projectArray[0]) => {
    const task = _createTask(name, project);
    _addTaskToArray(task);
    _addTaskToProject(task);
    return task;
}
const deleteTask = (taskIndex) => {
    const task = model.taskArray[taskIndex];
    _subtractTaskFromProject(task);
    model.taskArray.splice(taskIndex, 1);
}
const _createProject = (name, showProgress) => {
    return model.Project(name, showProgress);
}
const _addProjectToArray = (project) => {
    model.projectArray.push(project);
}
const addNewProject = (name, showProgress = true) => {
    const project = _createProject(name, showProgress);
    _addProjectToArray(project);
    return project;
}
const deleteProject = (projectIndex) => {
    _deleteTasksFromProject(projectIndex);
    model.projectArray.splice(projectIndex, 1);
}
const _deleteTasksFromProject = (projectIndex) => {
    const filteredTasks = model.taskArray.filter(task => task.project === model.projectArray[projectIndex]);
    console.log("tasks matching project:");
    console.log(filteredTasks);
    console.log("array of their indices:");
    const testTaskIndices = [];
    filteredTasks.forEach(task => testTaskIndices.push(model.taskArray.indexOf(task)));
    console.log(testTaskIndices);
    const taskIndicesToDelete = model.taskArray.filter(task => task.project === model.projectArray[projectIndex])
        .map(task => model.taskArray.indexOf(task));
    console.log("real resulting array of indices");
    console.log(taskIndicesToDelete);
    console.log("full array");
    console.log(model.taskArray);
    for (let i = taskIndicesToDelete.length - 1; i >= 0; i--) {
        console.log("Task being deleted:");
        console.log(model.taskArray[taskIndicesToDelete[i]].name);
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
}
const _addTaskToProject = (task) => {
    if (task.isComplete) {
        task.project.completeTasks++;
    } else {
        task.project.incompleteTasks++;
    }
    console.log(task.project.name);
    console.log("incomplete:");
    console.log(task.project.incompleteTasks);
    console.log("complete:");
    console.log(task.project.completeTasks);
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
        return y.name - x.name;
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
                || (project.incompleteTasks === 0 && project.completeTasks === 0);
        });
    return sortedProjects;
}
const sortCompleteProjects = () => {
    const sortedProjects = model.projectArray
        .filter(project =>
            project.incompleteTasks === 0
            && project.completeTasks > 0);
    return sortedProjects;
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
}

const addTasksToProject = (project, ...tasks) => {
    for (let i = 0; i < tasks.length; i++) {
        changeProperty(tasks[i], "project", project);
    }
}
const clearAll = () => {
    console.log("gets to clearAll()");
    model.taskArray.splice(0, model.taskArray.length);
    model.projectArray.splice(1, model.projectArray.length - 1);
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
    addTasksToProject,
    clearAll,
}