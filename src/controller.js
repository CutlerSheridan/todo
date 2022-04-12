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
    console.log(task.project.name);
    console.log("incomplete:");
    console.log(task.project.incompleteTasks);
    console.log("complete:");
    console.log(task.project.completeTasks);
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

export {
    addNewTask,
    deleteTask,
    addNewProject,
    changeProperty,
    toggleTaskCompletion,
    swapSortMethod,
    sortIncompleteTasks,
    sortCompleteTasks,
    sortIncompleteProjects,
    sortCompleteProjects,
    addTasksToProject,
}