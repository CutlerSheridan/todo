const taskArray = [];
const projectArray = [];
const sortMethods = ['sortByDueDate', 'sortByPriority', 'sortByCreationTime'];

const Task = (name, optionsObj) => {
  let {
    project = projectArray[0],
    isHighPriority = false,
    dueDate = null,
    isPastDue = false,
    notes = null,
    checklist = null,
    isComplete = false,
    completionDateTime = null,
    creationDateTime = new Date(),
    id = `${Math.random()}`,
  } = optionsObj;
  return {
    name,
    project,
    id,
    isHighPriority,
    dueDate,
    isPastDue,
    notes,
    checklist,
    isComplete,
    completionDateTime,
    creationDateTime,
  };
};
const Project = (name, prevId, showProgress = true) => {
  let timeCreated = new Date();
  let sortMethod = sortMethods[0];
  let incompleteTasks = 0;
  let completeTasks = 0;
  const id = prevId === null ? `${Math.random()}` : prevId;
  return {
    name,
    showProgress,
    timeCreated,
    sortMethod,
    incompleteTasks,
    completeTasks,
    id,
  };
};

export { Task, Project, taskArray, projectArray, sortMethods };
