const taskArray = [];
const projectArray = [];
const sortMethods = [
    "sortByPriority",
    "sortByDueDate",
    "sortByCreationTime",
]
const Task = (name, project) => {
    let isHighPriority = false;
    let dueDate = null;
    let isPastDue = false;
    let notes = null;
    let checklist = null
    let isComplete = false;
    let completionDateTime = null;
    let creationDateTime = new Date();
    return {
        name,
        isHighPriority,
        dueDate,
        isPastDue,
        project,
        notes,
        checklist,
        isComplete,
        completionDateTime,
        creationDateTime,
    }
}
const Project = (name, showProgress = true) => {
    let timeCreated = new Date();
    let sortMethod = sortMethods[0];
    let incompleteTasks = 0;
    let completeTasks = 0;
    return { 
        name,
        showProgress,
        timeCreated,
        sortMethod,
        incompleteTasks,
        completeTasks,
    }
}

export {
    Task,
    Project,
    taskArray,
    projectArray,
    sortMethods,
 }