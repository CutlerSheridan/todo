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
const Project = (name, optionsObj) => {
  let {
    id = `${Math.random()}`,
    showProgress = true,
    timeCreated = new Date(),
    sortMethod = sortMethods[0],
    incompleteTasks = 0,
    completeTasks = 0,
  } = optionsObj;
  return {
    name,
    id,
    showProgress,
    timeCreated,
    sortMethod,
    incompleteTasks,
    completeTasks,
  };
};

export { Task, Project, taskArray, projectArray, sortMethods };
