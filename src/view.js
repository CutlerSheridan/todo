import * as controller from './controller';
import * as model from './model';
import * as viewTaskForm from './viewTaskForm';
import * as test from './test';
import { format } from 'date-fns';

const _contentDiv = document.querySelector('.content');
let _numOfCheckboxes = 0;
let deleteBtnsAreShowing = false;

const createProjectPage = (e) => {
  let project;
  if (e) {
    const clickedElement = e.currentTarget;
    project = model.projectArray[clickedElement.dataset.project];
    const header = document.querySelector('.header-project-name');
    if (
      header &&
      header.textContent.toLowerCase() !== project.name.toLowerCase()
    ) {
      deleteBtnsAreShowing = false;
    }
  } else {
    project = model.projectArray[0];
  }
  if (project.id === model.projectArray[0].id) {
    _makeActiveTab(project);
  }
  clearContent();
  _createHeader(project);
  _updateTaskList(project);
  _contentDiv.append(_createFooterButtons(project));
};
const createAllProjectsPage = () => {
  const header = document.querySelector('.header-project-name');
  if (header && header.textContent.toLowerCase() !== 'projects') {
    deleteBtnsAreShowing = false;
  }
  _makeActiveTab('projects');
  clearContent();
  _createHeader('allProjects');
  _updateProjectList();
  _contentDiv.append(_createFooterButtons('allProjects'));
};
const createIncompletePage = () => {
  const header = document.querySelector('.header-project-name');
  if (header && header.textContent.toLowerCase() !== 'incomplete') {
    deleteBtnsAreShowing = false;
  }
  _makeActiveTab('incomplete');
  clearContent();
  _createHeader('allIncompleteTasks');
  _updateTaskList('allIncompleteTasks');
};
const _makeActiveTab = (project) => {
  const tabs = document.querySelectorAll('.footer-tab');
  tabs.forEach((tab) => {
    if (
      tab.textContent.toLowerCase() === project ||
      (project.name &&
        tab.textContent.toLowerCase() === project.name.toLowerCase())
    ) {
      tab.classList.add('active-tab');
    } else {
      tab.classList.remove('active-tab');
    }
  });
};

const _createHeader = (project) => {
  const headerContainer = document.createElement('header');
  if (typeof project !== 'string' && project !== model.projectArray[0]) {
    headerContainer.append(createBackBtn('allProjects'));
    const headerProjectName = createEditBox(project, 'name', 'header-project');
    headerContainer.append(headerProjectName);
  } else {
    const heading = document.createElement('div');
    heading.classList.add('header-project-name');
    heading.classList.add('preset-name');
    heading.textContent = (() => {
      switch (project) {
        case 'allIncompleteTasks':
          return 'Incomplete';
        case 'allProjects':
          return 'Projects';
        default:
          return project.name;
      }
    })();
    headerContainer.append(heading);
  }
  const headerBtnsContainer = document.createElement('div');
  headerBtnsContainer.classList.add('header-btns-container');
  if (project !== 'allProjects') {
    if (project !== 'allIncompleteTasks') {
      headerBtnsContainer.append(_createSortButton(project));
    }
    headerBtnsContainer.append(_createRefreshTasksButton(project));
  }
  if (project === 'allProjects') {
    headerBtnsContainer.append(_createProgressTogglesToggle());
  }
  headerBtnsContainer.append(_createDeleteToggle());
  headerContainer.append(headerBtnsContainer);
  _contentDiv.append(headerContainer);

  // SIGN-IN ELEMENTS BELOW
  if (project === model.projectArray[0]) {
    const signInContainer = document.createElement('div');
    signInContainer.classList.add('signIn-container');
    const userInfoContainer = document.createElement('div');
    userInfoContainer.classList.add('userInfo-container');
    const userPic = document.createElement('div');
    userPic.classList.add('user-pic', 'userElements-hidden');
    userPic.setAttribute('referrerpolicy', 'no-referrer');
    const userName = document.createElement('div');
    userName.classList.add('user-name', 'userElements-hidden');
    userInfoContainer.append(userPic, userName);
    const signOutButton = document.createElement('button');
    signOutButton.classList.add(
      'signOut-button',
      'user-button',
      'userElements-hidden'
    );
    signOutButton.textContent = 'Sign-out';
    const signInButton = document.createElement('button');
    signInButton.classList.add('signIn-button', 'user-button');
    signInButton.textContent = 'Sign in with Google';
    const accountCircle = document.createElement('span');
    _addIcon(accountCircle, 'account_circle');
    signInButton.append(accountCircle);
    signInContainer.append(userInfoContainer, signOutButton, signInButton);
    _contentDiv.append(signInContainer);
    controller.initSignInLogic();
  }
};
const _createSortButton = (project) => {
  const sortContainer = document.createElement('div');
  sortContainer.classList.add('sort-container');
  const sortLabel = document.createElement('div');
  sortLabel.textContent = 'Sort by:';
  const sortBtn = document.createElement('button');
  sortBtn.classList.add('sort-button');
  sortBtn.dataset.project = model.projectArray.indexOf(project);
  sortBtn.textContent = (() => {
    switch (project.sortMethod) {
      case 'sortByPriority':
        return 'Priority';
      case 'sortByDueDate':
        return 'Due Date';
      case 'sortByCreationTime':
        return 'Time Created';
    }
  })();
  sortBtn.addEventListener('click', _changeSortAndUpdate);
  sortContainer.append(sortLabel, sortBtn);
  return sortContainer;
};
const _changeSortAndUpdate = (e) => {
  const projectIndex = e.target.dataset.project;
  const project = model.projectArray[projectIndex];
  const alteredEvent = { ...e };
  alteredEvent.currentTarget = e.target;
  controller.swapSortMethod(project).then(() => {
    createProjectPage(alteredEvent);
  });
};
const createBackBtn = (project) => {
  const backBtn = document.createElement('button');
  backBtn.classList.add('back-btn');
  _addIcon(backBtn, 'chevron_left');
  if (typeof project === 'object') {
    backBtn.dataset.project = model.projectArray.indexOf(project);
  } else {
    backBtn.dataset.project = project;
  }
  backBtn.addEventListener('click', (e) => {
    switch (e.target.dataset.project) {
      case 'allProjects':
        createAllProjectsPage();
        break;
      case 'allIncompleteTasks':
        createIncompletePage();
        break;
      default:
        createProjectPage(e);
        break;
    }
  });
  return backBtn;
};
const _createRefreshTasksButton = (project) => {
  const refreshTasks = document.createElement('button');
  refreshTasks.classList.add('refresh');
  _addIcon(refreshTasks, 'refresh');
  refreshTasks.dataset.project = model.projectArray.indexOf(project);

  refreshTasks.addEventListener('click', (e) => {
    if (project !== 'allIncompleteTasks') {
      createProjectPage(e);
    } else {
      createIncompletePage();
    }
  });
  return refreshTasks;
};
const _createDeleteToggle = () => {
  const deleteToggle = document.createElement('button');
  deleteToggle.classList.add('delete-toggle');
  if (deleteBtnsAreShowing) {
    _addIcon(deleteToggle, 'remove');
    deleteToggle.dataset.isInactive = -1;
  } else {
    _addIcon(deleteToggle, 'delete_sweep');
    deleteToggle.dataset.isInactive = 1;
  }

  deleteToggle.addEventListener('mousedown', _toggleDeleteBtns);
  return deleteToggle;
};
const _toggleDeleteBtns = () => {
  const deleteToggle = document.querySelector('.delete-toggle');
  let isInactive = deleteToggle.dataset.isInactive;
  deleteBtnsAreShowing = !deleteBtnsAreShowing;
  isInactive *= -1;
  deleteToggle.dataset.isInactive = isInactive;
  if (isInactive > 0) {
    _addIcon(deleteToggle, 'delete_sweep');
  } else {
    _addIcon(deleteToggle, 'remove');
    const progressTogglesToggle = document.querySelector(
      '.progress-toggles-toggle'
    );
    if (progressTogglesToggle && progressTogglesToggle.dataset.isInactive < 0) {
      _toggleProgressToggles();
    }
  }
  const taskFormBtns = document.querySelectorAll('.task-form-btn');
  const deleteBtns = document.querySelectorAll('.delete-btn');
  taskFormBtns.forEach((btn) => btn.classList.toggle('invisible'));
  deleteBtns.forEach((btn) => btn.classList.toggle('invisible'));
  if (document.querySelector('.demo-btn')) {
    document.querySelector('.clear-all-btn').classList.toggle('invisible');
    document.querySelector('.demo-btn').classList.toggle('invisible');
  }
};

const _updateTaskList = (project) => {
  let taskListDiv = document.querySelector('.task-list-container');
  if (taskListDiv) {
    clearContent(taskListDiv);
  } else {
    taskListDiv = document.createElement('section');
    taskListDiv.classList.add('task-list-container');
  }
  if (
    project.incompleteTasks > 0 ||
    (project === 'allIncompleteTasks' && model.taskArray.length > 0)
  ) {
    const incompleteTasks = document.createElement('section');
    incompleteTasks.classList.add('task-list', 'incomplete-task-list');
    if (project !== 'allIncompleteTasks' && project.completeTasks > 0) {
      incompleteTasks.classList.add('incomplete-task-list-border');
    } else {
      incompleteTasks.classList.remove('incomplete-task-list-border');
    }
    taskListDiv.append(incompleteTasks);
    controller
      .sortIncompleteTasks(project)
      .forEach((task) => incompleteTasks.append(_createTaskElement(task)));
  }
  if (project !== 'allIncompleteTasks') {
    const completeTasks = document.createElement('section');
    completeTasks.classList.add('task-list', 'complete-task-list');
    taskListDiv.append(completeTasks);
    controller
      .sortCompleteTasks(project)
      .forEach((task) => completeTasks.append(_createTaskElement(task)));
  }
  taskListDiv.append(_createEmptySpaceForBottomOfPage());
  if (project.id === model.projectArray[0].id) {
    taskListDiv.append(_createCredit());
  }
  _contentDiv.append(taskListDiv);
};
const _createTaskElement = (task) => {
  const taskIndex = model.taskArray.indexOf(task);

  const taskContainer = document.createElement('div');
  taskContainer.classList.add('task-container');
  taskContainer.dataset.task = taskIndex;

  taskContainer.append(createCheckbox(task));
  if (task.isComplete) {
    taskContainer.classList.add('complete-task');
  }

  const taskInfoContainer = document.createElement('div');
  taskInfoContainer.classList.add('task-info-container');
  taskInfoContainer.dataset.task = taskIndex;
  const taskName = createEditBox(task, 'name', 'task');

  taskInfoContainer.append(taskName);
  if (task.dueDate && !task.isComplete) {
    taskInfoContainer.append(_createDueDateElement(task));
  }
  taskContainer.append(taskInfoContainer);
  taskContainer.append(_createTaskFormButton(task));
  taskContainer.append(_createDeleteBtn(task));

  if (task.isHighPriority) {
    taskContainer.classList.add('priority-high');
  }
  return taskContainer;
};
const createCheckbox = (
  task,
  isChecked = task.isComplete,
  func = _toggleCompleteClass
) => {
  const checkboxContainer = document.createElement('div');
  checkboxContainer.classList.add('checkbox-container');
  const taskIndex = model.taskArray.indexOf(task);

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.dataset.task = taskIndex;
  checkbox.checked = isChecked;
  checkbox.id = `checkbox-${_numOfCheckboxes}`;

  const taskLabel = document.createElement('label');
  taskLabel.classList.add('task-label');
  taskLabel.dataset.task = taskIndex;
  taskLabel.htmlFor = `checkbox-${_numOfCheckboxes}`;
  taskLabel.addEventListener('click', func);

  checkboxContainer.append(checkbox, taskLabel);
  _numOfCheckboxes++;
  return checkboxContainer;
};
const _createDueDateElement = (task) => {
  const taskDueDate = task.dueDate.seconds
    ? task.dueDate.toDate()
    : task.dueDate;
  const dueDateElement = document.createElement('p');
  dueDateElement.classList.add('due-date');
  dueDateElement.textContent = format(taskDueDate, 'M/d');
  if (taskDueDate < new Date()) {
    dueDateElement.classList.add('past-due');
  }
  return dueDateElement;
};
const _createTaskFormButton = (task) => {
  const taskFormBtn = document.createElement('button');
  taskFormBtn.classList.add('task-form-btn');
  if (deleteBtnsAreShowing) {
    taskFormBtn.classList.add('invisible');
  }
  _addIcon(taskFormBtn, 'chevron_right');
  taskFormBtn.dataset.task = model.taskArray.indexOf(task);
  if (
    document.querySelector('.header-project-name').textContent.toLowerCase() ===
    'incomplete'
  ) {
    taskFormBtn.dataset.projectName = 'allIncompleteTasks';
  }

  taskFormBtn.addEventListener('click', (e) => {
    setTimeout(() => {
      viewTaskForm.createTaskForm(e);
    }, 10);
  });
  return taskFormBtn;
};
const _createDeleteBtn = (taskOrProject) => {
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete-btn');
  if (!deleteBtnsAreShowing) {
    deleteBtn.classList.add('invisible');
  }
  _addIcon(deleteBtn, 'close');

  const taskIndex = model.taskArray.indexOf(taskOrProject);
  if (taskIndex !== -1) {
    deleteBtn.dataset.task = taskIndex;
    deleteBtn.dataset.project = model.projectArray.indexOf(
      taskOrProject.project
    );
  } else {
    deleteBtn.dataset.project = model.projectArray.indexOf(taskOrProject);
  }

  deleteBtn.addEventListener('click', async (e) => {
    await _deleteTaskOrProject(e);
    if (taskIndex !== -1) {
      const header = document.querySelector('.header-project-name');
      const isLogbook = header.textContent.toLowerCase() === 'incomplete';
      if (isLogbook) {
        createIncompletePage();
      } else {
        const alteredEvent = { ...e };
        alteredEvent.currentTarget = e.target;
        createProjectPage(alteredEvent);
      }
    } else {
      createAllProjectsPage();
    }
  });
  return deleteBtn;
};
const _deleteTaskOrProject = async (e) => {
  if (e.target.dataset.task) {
    await controller.deleteTask(e.target.dataset.task);
  } else {
    await controller.deleteProject(e.target.dataset.project);
  }
};
// this is currying to be able to pass arguments to the callback below and still be able to remove it
const _inputHandlers = [];
const createEditBox = (obj, property, classPrefix) => {
  const propEditBox = document.createElement('div');
  propEditBox.classList.add(`${classPrefix}-${property}`);
  if (obj[property]) {
    propEditBox.textContent = obj[property];
  } else {
    propEditBox.textContent = `(Enter ${property} here)`;
  }
  let objectIndex = model.taskArray.indexOf(obj);
  if (objectIndex === -1) {
    objectIndex = model.projectArray.indexOf(obj);
    propEditBox.dataset.project = objectIndex;
  } else {
    propEditBox.dataset.task = objectIndex;
  }
  propEditBox.contentEditable = true;
  propEditBox.autocapitalize = 'sentences';
  propEditBox.addEventListener(
    'focus',
    (_inputHandlers[0] = _handleEditBoxFocus(obj, property))
  );
  if (classPrefix === 'project') {
    propEditBox.addEventListener('mousedown', (e) => e.preventDefault());
  }
  return propEditBox;
};

const _handleEditBoxFocus = (obj, property) => {
  return function realHandleEditBoxFocus(e) {
    const domElement = e.target;
    document.addEventListener(
      'mousedown',
      (_inputHandlers[1] = _submitTextValue(e, domElement, obj, property))
    );
    document.addEventListener('keydown', _inputHandlers[1]);
    document.addEventListener('focusout', _inputHandlers[1]);
  };
};
const _submitTextValue = (e, domElement, obj, property) => {
  return async function realSubmitTextValueFunction(e) {
    if (
      (e.type === 'mousedown' && e.target !== domElement) ||
      (e.type === 'keydown' && e.key === 'Enter') ||
      e.type === 'focusout'
    ) {
      e.preventDefault();
      domElement.blur();
      if (domElement.textContent === '') {
        if (domElement.classList.contains('project-name')) {
          domElement.textContent = '(New project name)';
        } else {
          domElement.textContent = `(Enter ${property} here)`;
        }
      }
      await controller.changeProperty(obj, property, domElement.textContent);
      document.removeEventListener('mousedown', _inputHandlers[1]);
      document.removeEventListener('keydown', _inputHandlers[1]);
      document.removeEventListener('focusout', _inputHandlers[1]);

      if (document.querySelector('.project-list')) {
        _updateProjectList();
      }
    } else if (
      e.type === 'keydown' &&
      (domElement.textContent === `(Enter ${property} here)` ||
        domElement.textContent === '(New project name)')
    ) {
      domElement.textContent = '';
    }
  };
};

const _toggleCompleteClass = async (e) => {
  const taskIndex = e.target.dataset.task;
  const taskContainer = document.querySelector(
    `.task-container[data-task="${taskIndex}"]`
  );
  if (taskContainer) {
    taskContainer.classList.toggle('complete-task');
  }
  await controller.toggleTaskCompletion(model.taskArray[taskIndex]);
};
const _createFooterButtons = (project) => {
  const footerBtnContainer = document.createElement('div');
  footerBtnContainer.classList.add('footer-btn-container');
  if (project.id === model.projectArray[0].id) {
    footerBtnContainer.append(
      test.createClearAllButton(),
      test.createDemoButton()
    );
  }
  footerBtnContainer.append(_createNewItemButton(project));
  const footer = document.querySelector('footer');
  footerBtnContainer.style.bottom = footer.offsetHeight / 10 + 'rem';
  return footerBtnContainer;
};
const _createNewItemButton = (project) => {
  const newItemBtn = document.createElement('button');
  newItemBtn.classList.add('new-item-btn');
  _addIcon(newItemBtn, 'add');

  newItemBtn.addEventListener('click', (e) => {
    if (project === 'allProjects') {
      const progressTogglesToggle = document.querySelector(
        '.progress-toggles-toggle'
      );
      if (progressTogglesToggle.dataset.isInactive < 0) {
        _toggleProgressToggles();
      }
    }
    _insertNewItemInput(e, project);
  });
  return newItemBtn;
};

const _insertNewItemInput = async (e, project) => {
  if (typeof project === 'object' && project.id === 'tempId') {
    project = model.projectArray[0];
  }
  if (project !== 'allProjects') {
    let incompleteTaskList;
    if (!document.querySelector('.incomplete-task-list')) {
      const taskListDiv = document.querySelector('.task-list-container');
      incompleteTaskList = document.createElement('section');
      incompleteTaskList.classList.add('task-list', 'incomplete-task-list');
      taskListDiv.prepend(incompleteTaskList);
    } else {
      incompleteTaskList = document.querySelector('.incomplete-task-list');
    }
    const newTask = await controller.addNewTask('(Enter name here)', {
      project,
    });
    incompleteTaskList.append(_createTaskElement(newTask));

    const taskNameDiv = document.querySelector(
      `.task-name[data-task="${model.taskArray.indexOf(newTask)}"]`
    );
    _moveCaretToEnd(taskNameDiv);
  } else {
    _removeListenersFromProjects();

    let incompleteProjects;
    if (!document.querySelector('.incomplete-project-list')) {
      const projectListDiv = document.querySelector('.project-list-container');
      incompleteProjects = document.createElement('section');
      incompleteProjects.classList.add(
        'project-list',
        'incomplete-project-list'
      );
      projectListDiv.prepend(incompleteProjects);
    } else {
      incompleteProjects = document.querySelector('.incomplete-project-list');
    }

    const newProject = await controller.addNewProject('(New project name)');
    const projectIndex = model.projectArray.indexOf(newProject);
    incompleteProjects.append(_createProjectElement(newProject));

    const projectNameDiv = document.querySelector(
      `.project-info-container[data-project="${projectIndex}"] .project-name`
    );
    _moveCaretToEnd(projectNameDiv);
  }
};
const _moveCaretToEnd = (element) => {
  const range = document.createRange();
  const selection = window.getSelection();
  range.setStart(element.childNodes[0], element.textContent.length);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  element.focus();
};
const _addIcon = (element, iconCode) => {
  element.textContent = iconCode;
  element.classList.add('material-symbols-outlined');
};
const _createEmptySpaceForBottomOfPage = () => {
  const space = document.createElement('div');
  space.classList.add('empty-space');
  return space;
};
const _createCredit = () => {
  const creditElement = document.createElement('div');
  creditElement.classList.add('credit');
  creditElement.textContent = 'Made by ';
  const creditLink = document.createElement('a');
  creditLink.href = 'https://cutlersheridan.github.io/portfolio/';
  creditLink.textContent = 'Cutler Sheridan';
  creditElement.append(creditLink);
  return creditElement;
};

// ALL PROJECTS PAGE START
const _createProgressTogglesToggle = () => {
  const toggle = document.createElement('button');
  toggle.classList.add('progress-toggles-toggle');
  toggle.dataset.isInactive = 1;
  _addIcon(toggle, 'percent');

  toggle.addEventListener('click', _toggleProgressToggles);
  return toggle;
};
const _toggleProgressToggles = () => {
  const progressTogglesToggle = document.querySelector(
    '.progress-toggles-toggle'
  );
  let isInactive = progressTogglesToggle.dataset.isInactive;
  isInactive *= -1;
  progressTogglesToggle.dataset.isInactive = isInactive;
  if (isInactive > 0) {
    _addIcon(progressTogglesToggle, 'percent');
  } else {
    _addIcon(progressTogglesToggle, 'remove');
    const deleteToggle = document.querySelector('.delete-toggle');
    if (deleteToggle.dataset.isInactive < 0) {
      _toggleDeleteBtns();
    }
  }
  const allProgressToggles = document.querySelectorAll('.progress-toggle');
  if (allProgressToggles.length > 0) {
    allProgressToggles.forEach((toggle) =>
      toggle.classList.toggle('invisible')
    );
  }
};
const _updateProjectList = () => {
  let projectListDiv = document.querySelector('.project-list-container');
  if (projectListDiv) {
    clearContent(projectListDiv);
  } else {
    projectListDiv = document.createElement('section');
    projectListDiv.classList.add('project-list-container');
  }

  if (
    model.projectArray.some(
      (project) =>
        (project.incompleteTasks > 0 &&
          project.id !== model.projectArray[0].id) ||
        (project.incompleteTasks === 0 &&
          project.completeTasks === 0 &&
          project.id !== model.projectArray[0].id)
    )
  ) {
    const incompleteProjects = document.createElement('section');
    incompleteProjects.classList.add('project-list', 'incomplete-project-list');
    if (controller.sortCompleteProjects().length > 0) {
      incompleteProjects.classList.add('incomplete-project-list-border');
    } else {
      incompleteProjects.classList.remove('incomplete-project-list-border');
    }
    projectListDiv.append(incompleteProjects);
    controller.sortIncompleteProjects().forEach((project) => {
      if (project.id !== model.projectArray[0].id) {
        incompleteProjects.append(_createProjectElement(project));
      }
    });
  }

  const completeProjects = document.createElement('section');
  completeProjects.classList.add('project-list');
  projectListDiv.append(completeProjects);
  controller
    .sortCompleteProjects()
    .forEach((project) =>
      completeProjects.append(_createProjectElement(project, true))
    );

  _contentDiv.append(projectListDiv);
  _addListenersToProjects();
};
const _createProjectElement = (project, isComplete = false) => {
  const projectContainer = document.createElement('div');
  projectContainer.classList.add('project-container');

  const nameAndProgressContainer = document.createElement('div');
  nameAndProgressContainer.dataset.project =
    model.projectArray.indexOf(project);
  nameAndProgressContainer.classList.add('project-info-container');
  const projectNameElement = createEditBox(project, 'name', 'project');
  nameAndProgressContainer.append(projectNameElement);
  if (!isComplete) {
    const progressContainer = document.createElement('div');
    progressContainer.classList.add('progress-container');
    progressContainer.append(_createRemainingTasksNum(project));
    if (project.showProgress) {
      progressContainer.append(_createProgressBar(project));
    }
    nameAndProgressContainer.append(progressContainer);
  } else {
    projectContainer.classList.add('complete-project');
  }
  projectContainer.append(nameAndProgressContainer, _createDeleteBtn(project));
  if (!isComplete) {
    projectContainer.append(_createProgressToggle(project));
  }
  return projectContainer;
};
const _createProgressBar = (project) => {
  const progressBarOuter = document.createElement('div');
  progressBarOuter.classList.add(
    'progress-bar-outer',
    'project-progress-element'
  );
  progressBarOuter.dataset.project = model.projectArray.indexOf(project);
  const progressBarInner = document.createElement('div');
  progressBarInner.classList.add('progress-bar-inner');
  progressBarOuter.append(progressBarInner);

  const totalTasks = project.incompleteTasks + project.completeTasks;
  const percentComplete = (project.completeTasks * 100) / totalTasks;
  progressBarInner.style.width = `${percentComplete}%`;

  return progressBarOuter;
};
const _createRemainingTasksNum = (project) => {
  const remainingTasksNum = document.createElement('div');
  remainingTasksNum.classList.add(
    'remaining-tasks-num',
    'project-progress-element'
  );
  remainingTasksNum.dataset.project = model.projectArray.indexOf(project);
  const numOfTasks = project.incompleteTasks;
  remainingTasksNum.textContent = `${numOfTasks} item${
    numOfTasks === 1 ? '' : 's'
  }`;
  return remainingTasksNum;
};
const _createProgressToggle = (project) => {
  const toggle = document.createElement('button');
  toggle.classList.add('progress-toggle');
  _addIcon(toggle, 'percent');
  toggle.dataset.project = model.projectArray.indexOf(project);
  toggle.classList.add('invisible');

  toggle.addEventListener('click', _toggleProgressStyle);
  return toggle;
};
const _toggleProgressStyle = async (e) => {
  const projectIndex = e.target.dataset.project;
  const project = model.projectArray[projectIndex];
  const progressContainer = document.querySelector(
    `.project-info-container[data-project="${projectIndex}"] .progress-container`
  );
  const progressBar = document.querySelector(
    `.progress-bar-outer[data-project="${projectIndex}"]`
  );
  if (progressBar) {
    progressBar.remove();
  } else {
    progressContainer.append(_createProgressBar(project));
  }
  await controller.changeProperty(
    project,
    'showProgress',
    !project.showProgress
  );
};
const _addListenersToProjects = () => {
  const allProjects = document.querySelectorAll('.project-info-container');
  allProjects.forEach((projectElement) =>
    projectElement.addEventListener('click', createProjectPage)
  );
};
const _removeListenersFromProjects = () => {
  const allProjects = document.querySelectorAll('.project-info-container');
  allProjects.forEach((projectElement) =>
    projectElement.removeEventListener('click', createProjectPage)
  );
};
// ALL PROJECTS PAGE END

const clearContent = (node = _contentDiv) => {
  const contentContainer = document.createRange(node);
  contentContainer.selectNodeContents(node);
  contentContainer.deleteContents();
  _numOfCheckboxes = 0;
};

export {
  deleteBtnsAreShowing,
  createProjectPage,
  createBackBtn,
  createEditBox,
  createIncompletePage,
  createAllProjectsPage,
  createCheckbox,
  clearContent,
  _updateTaskList,
};
