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
  btn.addEventListener('click', async () => {
    await _clearAll();
    view.createProjectPage();
  });

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
  btn.addEventListener('click', async () => {
    await _addSampleData();
    view.deleteBtnsAreShowing = false;
    view.createProjectPage();
  });

  return btn;
};
const _addSampleData = async () => {
  let tempTask = await controller.addNewTask('Book my flight for Paris');
  await controller.changeProperty(tempTask, 'dueDate', new Date(2023, 6, 14));
  await controller.changeProperty(tempTask, 'isHighPriority', true);
  tempTask = await controller.addNewTask('Give that book back to Will');
  await controller.changeProperty(tempTask, 'isHighPriority', true);

  tempTask = await controller.addNewTask(
    'Finish Poisonwood Bible for book club'
  );
  await controller.changeProperty(tempTask, 'dueDate', new Date(2023, 5, 16));
  await controller.toggleTaskCompletion(tempTask);
  await controller.changeProperty(tempTask, 'isHighPriority', true);
  tempTask = await controller.addNewTask('Get car serviced');
  await controller.changeProperty(tempTask, 'dueDate', new Date(2023, 4, 15));

  await controller.addNewTask(
    'See if that apartment in Santa Monica is still available'
  );
  tempTask = await controller.addNewTask('Send thank you note to Grandma');
  await controller.changeProperty(tempTask, 'dueDate', new Date(2023, 1, 15));

  tempTask = await controller.addNewTask('Check on party timing for Mom');
  await controller.toggleTaskCompletion(tempTask);

  tempTask = await controller.addNewTask('Cancel gym membership');
  await controller.changeProperty(tempTask, 'dueDate', new Date(2023, 1, 20));
  await controller.addNewTask('Find a time to get lunch with Ivana');
  await controller.addNewTask('Call Sarah back');

  const groceryProject = await controller.addNewProject('grocery list');
  await controller.changeProperty(groceryProject, 'showProgress', false);

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
  groceries.forEach(async (name) => {
    let groceryTask = await controller.addNewTask(name, groceryProject);
    if (name[0].toLowerCase() === 'b' || name[0].toLowerCase() === 'a') {
      await controller.toggleTaskCompletion(groceryTask);
    }
  });

  const partyProject = await controller.addNewProject('Party checklist');
  const partyTaskArray = [];
  const partyTasks = [
    'Get alcohol',
    'Clean living room',
    "Confirm everyone's coming",
    'Find a good playlist',
    'Make snacks',
  ];
  for (let i = 0; i < partyTasks.length; i++) {
    partyTaskArray[i] = await controller.addNewTask(
      partyTasks[i],
      partyProject
    );
    await controller.toggleTaskCompletion(partyTaskArray[i]);
  }

  const _getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  };
  const schoolProject = await controller.addNewProject('school stuff');
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
    schoolStuffArray[i] = await controller.addNewTask(
      schoolTasks[i],
      schoolProject
    );
    if (i > (schoolTasks.length / 4) * 3) {
      await controller.changeProperty(
        schoolStuffArray[i],
        'isHighPriority',
        true
      );
    }
    if (i % 3 === 0) {
      await controller.toggleTaskCompletion(schoolStuffArray[i]);
    }
    await controller.changeProperty(
      schoolStuffArray[i],
      'dueDate',
      new Date(2023, _getRandomInt(11) + 1, _getRandomInt(27) + 1)
    );
  }

  const choresProject = await controller.addNewProject('Household chores');
  const choreArray = [];
  const chores = [
    'Do the dishes',
    'Put clean clothes away',
    'Scrub stick spot on kitchen floor',
    'Clean shower grout',
    'Vacuum living room',
    'Find extra charging cable',
    'See if that new needle will work with the record player',
    'Get the guest room ready',
    'Get screw for that outlet extender',
    'Hang tree art in the living room',
    'Finish tidying bedroom',
    'Dust the entertainment console',
    'Find new art for the wall over the bar cart',
    'Fix the printer',
    'Put the fire alarm back up',
    'Water the cactus',
  ];
  for (let i = 0; i < chores.length; i++) {
    choreArray[i] = await controller.addNewTask(chores[i], choresProject);
    if (i > (chores.length / 3) * 2) {
      await controller.changeProperty(choreArray[i], 'isHighPriority', true);
    }
    if (i > (chores.length / 4) * 3) {
      await controller.toggleTaskCompletion(choreArray[i]);
    }
  }
};

export { createClearAllButton, createDemoButton };
