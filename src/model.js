const taskArray = [];
const projectArray = [];
const sortMethods = ['sortByDueDate', 'sortByPriority', 'sortByCreationTime'];
const Task = (name, project, prevId) => {
  let isHighPriority = false;
  let dueDate = null;
  let isPastDue = false;
  let notes = null;
  let checklist = null;
  let isComplete = false;
  let completionDateTime = null;
  let creationDateTime = new Date();
  const id = prevId === null ? `${Math.random()}` : prevId;
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
