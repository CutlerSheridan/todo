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
    // let timeCreated = currentTime;
    return { name, showProgress }
}
let taskArray = [];
let projectArray = [];

export { Task, Project, taskArray, projectArray }