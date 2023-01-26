import * as view from './view';
import * as controller from './controller';
import * as model from './model';

const _contentDiv = document.querySelector('.content');

const createClearAllButton = () => {
  const btn = document.createElement('button');
  btn.classList.add('clear-all-btn');
  if (!view.deleteBtnsAreShowing) {
    btn.classList.add('invisible');
  }
  btn.textContent = 'Clear all';
  btn.addEventListener(
    'click',
    async () => {
      btn.textContent = 'Working...';
      const clickBlocker = document.createElement('div');
      clickBlocker.classList.add('click-blocker');
      document.body.append(clickBlocker);
      await _clearAll();
      clickBlocker.remove();
      btn.textContent = 'Clear all';
      view.createProjectPage();
    },
    { once: true }
  );

  return btn;
};
const _clearAll = async () => {
  await controller.deleteTasksFromProject(0);
  for (let i = model.projectArray.length - 1; i > 0; i--) {
    await controller.deleteProject(i);
  }
};

const createDemoButton = () => {
  const btn = document.createElement('button');
  btn.classList.add('demo-btn');
  if (!view.deleteBtnsAreShowing) {
    btn.classList.add('invisible');
  }
  btn.textContent = 'Demo';
  btn.addEventListener(
    'click',
    async () => {
      btn.textContent = 'Loading...';
      const clickBlocker = document.createElement('div');
      clickBlocker.classList.add('click-blocker');
      document.body.append(clickBlocker);
      await _addSampleData();
      clickBlocker.remove();
      btn.textContent = 'Demo';
      view.deleteBtnsAreShowing = false;
      view.createProjectPage();
    },
    { once: true }
  );

  return btn;
};
const _getRandomInt = (exclusiveMax) => {
  return Math.floor(Math.random() * exclusiveMax);
};
const _createTask = async (name, optionsObj = {}) => {
  const task = model.Task(name, optionsObj);
  model.taskArray.push(task);
  await controller.addTaskToDatabase(task);
  return task;
};
const _updateTasksInProject = async (
  tempComplete,
  tempIncomplete,
  currentProject
) => {
  let newComplete = currentProject.completeTasks + tempComplete;
  let newIncomplete = currentProject.incompleteTasks + tempIncomplete;
  currentProject.completeTasks = newComplete;
  await controller.changeProperty(currentProject, 'completeTasks', newComplete);
  currentProject.incompleteTasks = newIncomplete;
  await controller.changeProperty(
    currentProject,
    'incompleteTasks',
    newIncomplete
  );
};

const _addSampleData = async () => {
  let tempComplete = 0;
  let tempIncomplete = 0;
  let tempTask = await _createTask('Book my flight for Paris', {
    dueDate: new Date(2023, 6, 14),
    isHighPriority: true,
  });
  tempIncomplete++;
  tempTask = await _createTask('Give that book back to Will', {
    isHighPriority: true,
  });
  tempIncomplete++;
  tempTask = await _createTask('Finish Poisonwood Bible for book club', {
    dueDate: new Date(2023, 5, 16),
    isHighPriority: true,
    isComplete: true,
    completionDateTime: new Date(),
  });
  tempComplete++;
  tempTask = await _createTask('Get car serviced', {
    dueDate: new Date(2023, 4, 15),
  });
  tempIncomplete++;
  await _createTask('See if that apartment in Santa Monica is still available');
  tempIncomplete++;
  tempTask = await _createTask('Send thank you note to Grandma', {
    dueDate: new Date(2023, 1, 15),
  });
  tempIncomplete++;
  tempTask = await _createTask('Check on party timing for Mom', {
    isComplete: true,
    completionDateTime: new Date(),
  });
  tempComplete++;
  tempTask = await _createTask('Cancel gym membership', {
    dueDate: new Date(2023, 1, 20),
  });
  tempIncomplete++;
  await _createTask('Find a time to get lunch with Ivana');
  tempIncomplete++;
  await _createTask('Call Sarah back');
  tempIncomplete++;
  await _updateTasksInProject(
    tempComplete,
    tempIncomplete,
    model.projectArray[0]
  );

  const groceryProject = await controller.addNewProject('grocery list', {
    showProgress: false,
  });
  tempComplete = 0;
  tempIncomplete = 0;

  const groceryArray = [];
  const groceries = [
    'Bananas',
    'Apples',
    'Garlic',
    'Soy sauce',
    'Pasta',
    'Crushed tomatoes',
    'Hamburgers',
    'Hamburger buns',
    'Swiss cheese',
    'Bagels',
    'Cream cheese',
    'La Croix',
    'Broccoli',
    'Ribs',
    'Oregano',
    'Amber ale',
  ];
  for (let i = 0; i < groceries.length; i++) {
    const isComplete = /a|b/i.test(groceries[i].charAt(0));
    await _createTask(groceries[i], {
      project: groceryProject,
      isComplete,
      completionDateTime: isComplete ? new Date() : null,
    });
    if (isComplete) {
      tempComplete++;
    } else {
      tempIncomplete++;
    }
  }
  await _updateTasksInProject(tempComplete, tempIncomplete, groceryProject);

  const partyProject = await controller.addNewProject('Party checklist');
  tempComplete = 0;
  tempIncomplete = 0;
  const partyTaskArray = [];
  const partyTasks = [
    'Get alcohol',
    'Clean living room',
    "Confirm everyone's coming",
    'Find a good playlist',
    'Make snacks',
  ];
  for (let i = 0; i < partyTasks.length; i++) {
    await _createTask(partyTasks[i], {
      project: partyProject,
      isComplete: true,
      completionDateTime: new Date(),
    });
    tempComplete++;
  }
  await _updateTasksInProject(tempComplete, tempIncomplete, partyProject);

  const schoolProject = await controller.addNewProject('school stuff');
  tempComplete = 0;
  tempIncomplete = 0;
  const schoolStuffArray = [];
  const schoolTasks = [
    'Finish Gatsby essay',
    'Get new highlighters',
    'Study for SAT',
    'See if Chelsea will let me copy her APUSH vocab',
    'Memorize hand bones',
    'Look at colleges',
    'Bake something for French',
    'See if I left my stat folder in the locker room',
    'Renew my parking pass',
    'Email Ms. Fishman about test grade',
    'Decorate poster for lit presentation',
  ];
  for (let i = 0; i < schoolTasks.length; i++) {
    const isComplete = i % 3 === 0;
    await _createTask(schoolTasks[i], {
      project: schoolProject,
      isHighPriority: i > (schoolTasks.length / 4) * 3 ? true : false,
      dueDate: new Date(2023, _getRandomInt(12), _getRandomInt(27) + 1),
      isComplete,
      completionDateTime: isComplete ? new Date() : null,
    });
    if (isComplete) {
      tempComplete++;
    } else {
      tempIncomplete++;
    }
  }
  await _updateTasksInProject(tempComplete, tempIncomplete, schoolProject);

  //   const choresProject = await controller.addNewProject('Household chores');
  //   tempComplete = 0;
  //   tempIncomplete = 0;
  //   const choreArray = [];
  //   const chores = [
  //     'Do the dishes',
  //     'Put clean clothes away',
  //     'Scrub stick spot on kitchen floor',
  //     'Clean shower grout',
  //     'Vacuum living room',
  //     'Find extra charging cable',
  //     'See if that new needle will work with the record player',
  //     'Get the guest room ready',
  //     'Get screw for that outlet extender',
  //     'Hang tree art in the living room',
  //     'Finish tidying bedroom',
  //     'Dust the entertainment console',
  //     'Find new art for the wall over the bar cart',
  //     'Fix the printer',
  //     'Put the fire alarm back up',
  //     'Water the cactus',
  //   ];
  //   for (let i = 0; i < chores.length; i++) {
  //     const isComplete = i > (chores.length / 4) * 3;
  //     await _createTask(chores[i], {
  //       project: choresProject,
  //       isHighPriority: i > (chores.length / 3) * 2 ? true : false,
  //       isComplete,
  //       completionDateTime: isComplete ? new Date() : null,
  //     });
  //     if (isComplete) {
  //       tempComplete++;
  //     } else {
  //       tempIncomplete++;
  //     }
  //   }
  //   await _updateTasksInProject(tempComplete, tempIncomplete, choresProject);
  console.log('done');
};

export { createClearAllButton, createDemoButton };
