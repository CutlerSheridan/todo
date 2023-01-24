import * as model from './model';
import { parseJSON } from 'date-fns';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDoc,
  getDocs,
  addDoc,
  query,
  setDoc,
  where,
  orderBy,
  doc,
} from 'firebase/firestore/lite';
import { check, resolveConfig } from 'prettier';

const _firebaseConfig = {
  apiKey: 'AIzaSyAJzf9KFyABDAnqVoEJIF-4AJNdfR7HV9w',
  authDomain: 'todo-8d621.firebaseapp.com',
  projectId: 'todo-8d621',
  storageBucket: 'todo-8d621.appspot.com',
  messagingSenderId: '224157153436',
  appId: '1:224157153436:web:16702d301e30de556e9559',
};
const app = initializeApp(_firebaseConfig);
const db = getFirestore(app);

const checkAndAddToDatabase = async (obj, collectionName) => {
  await checkIfDocExists(obj, collectionName)
    .then((result) => {
      if (!result) {
        if (collectionName === 'tasks') {
          return addTaskToDatabase(obj);
        }
        return addProjectToDatabase(obj);
      } else {
        if (collectionName === 'tasks') {
          return overwriteDoc(obj, 'task');
        }
        return overwriteDoc(obj, 'projects');
      }
    })
    .catch((err) => console.error(err));
};
const checkIfDocExists = async (obj, collectionName) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  let docExists = false;
  querySnapshot.forEach((doc) => {
    const d = doc.data();
    if (d.name === obj.name && d.id === obj.id) {
      docExists = true;
    }
  });
  return docExists;
};
const addTaskToDatabase = async (task) => {
  try {
    const docRef = doc(db, 'tasks', task.id);
    await setDoc(docRef, task);
    console.log('task document written with id: ' + docRef.id);
  } catch (e) {
    console.error('Error adding task doucment: ', e);
  }
};
const addProjectToDatabase = async (project) => {
  try {
    const docRef = doc(db, 'projects', project.id);
    await setDoc(docRef, project);
    console.log('project document written with id: ' + docRef.id);
  } catch (e) {
    console.error('Error adding project document ', e);
  }
};
// const logAllComparisons = (task1, task2, props) => {
//   console.log('STEP 4');

//   console.log('--------------------');
//   console.log('~~~ TASK 1 VS. TASK 2: ~~~');
//   props.forEach((p) => {
//     console.log(`  -${p.toUpperCase()}-`);
//     console.log(`Task 1: ${task1[p]}`);
//     console.log(`Task 2: ${task2[p]}`);
//   });
//   console.log('--------------------');
// };

const addNewTask = async (name, project = model.projectArray[0], id = null) => {
  const task = _createTask(name, project, id);
  _addTaskToArray(task);
  await _addTaskToProject(task);

  localStorage.setItem('storedTaskArray', JSON.stringify(model.taskArray));
  localStorage.setItem(
    'storedProjectArray',
    JSON.stringify(model.projectArray)
  );
  //   await checkAndAddToDatabase(task, 'tasks');
  await addTaskToDatabase(task);
  return task;
};
const _createTask = (name, project, id) => {
  return model.Task(name, project, id);
};
const _addTaskToArray = (task) => {
  model.taskArray.push(task);
};
const deleteTask = (taskIndex) => {
  const task = model.taskArray[taskIndex];
  _subtractTaskFromProject(task);
  model.taskArray.splice(taskIndex, 1);

  localStorage.setItem('storedTaskArray', JSON.stringify(model.taskArray));
  localStorage.setItem(
    'storedProjectArray',
    JSON.stringify(model.projectArray)
  );
};
const addNewProject = async (name, id = null, showProgress = true) => {
  const project = _createProject(name, id, showProgress);
  _addProjectToArray(project);
  await checkAndAddToDatabase(project, 'projects');

  return project;
};
const _createProject = (name, id, showProgress) => {
  return model.Project(name, id, showProgress);
};
const _addProjectToArray = (project) => {
  model.projectArray.push(project);
};
const deleteProject = (projectIndex) => {
  _deleteTasksFromProject(projectIndex);
  model.projectArray.splice(projectIndex, 1);

  localStorage.setItem('storedTaskArray', JSON.stringify(model.taskArray));
  localStorage.setItem(
    'storedProjectArray',
    JSON.stringify(model.projectArray)
  );
};
const _deleteTasksFromProject = (projectIndex) => {
  const filteredTasks = model.taskArray.filter(
    (task) => task.project.id === model.projectArray[projectIndex].id
  );
  const testTaskIndices = [];
  filteredTasks.forEach((task) =>
    testTaskIndices.push(model.taskArray.indexOf(task))
  );
  const taskIndicesToDelete = model.taskArray
    .filter((task) => task.project.id === model.projectArray[projectIndex].id)
    .map((task) => model.taskArray.indexOf(task));
  for (let i = taskIndicesToDelete.length - 1; i >= 0; i--) {
    deleteTask(taskIndicesToDelete[i]);
  }
};
const changeProperty = async (obj, property, newValue) => {
  obj = await obj;
  try {
    let currentDoc;

    if (property === 'project') {
      _subtractTaskFromProject(obj);
    }
    if (obj.showProgress === undefined) {
      currentDoc = doc(db, 'tasks', obj.id);
    } else {
      currentDoc = doc(db, 'projects', obj.id);
    }
    obj[property] = newValue;
    await setDoc(currentDoc, obj);
    if (property === 'project') {
      await _addTaskToProject(obj);
    }
  } catch (e) {
    console.error(e);
  }
};
const _addTaskToProject = async (task) => {
  if (task.isComplete) {
    task.project.completeTasks++;
  } else {
    task.project.incompleteTasks++;
  }
  console.log('db project before:');
  console.log((await getDoc(doc(db, 'projects', task.project.id))).data());
  await setDoc(doc(db, 'projects', task.project.id), task.project);
  console.log('altered db project:');
  console.log((await getDoc(doc(db, 'projects', task.project.id))).data());
};
const _subtractTaskFromProject = async (task) => {
  if (task.isComplete) {
    task.project.completeTasks--;
  } else {
    task.project.incompleteTasks--;
  }
  await setDoc(doc(db, 'projects', task.project.id), task.project);
};
const sortIncompleteTasks = (project) => {
  let sortFuncName;
  if (project === 'allIncompleteTasks') {
    sortFuncName = model.sortMethods[0];
  } else {
    sortFuncName = project.sortMethod;
  }
  const sortedArray = model.taskArray
    .filter((task) => {
      if (project !== 'allIncompleteTasks') {
        return task.project.id === project.id;
      } else {
        return true;
      }
    })
    .filter((task) => !task.isComplete)
    .sort((x, y) => {
      let result = 0;
      result = sortMethod[sortFuncName](x, y);
      if (result !== 0) {
        return result;
      }
      for (let func in sortMethod) {
        if (func !== sortFuncName) {
          result = sortMethod[func](x, y);
          if (result !== 0) {
            return result;
          }
        }
      }
      return result;
    });
  console.log('sortedArray');
  console.log(sortedArray);
  return sortedArray;
};
const sortMethod = (() => {
  const sortByPriority = (x, y) => {
    return y.isHighPriority - x.isHighPriority;
  };
  const sortByDueDate = (x, y) => {
    if (!x.dueDate && y.dueDate) {
      return 1;
    } else if (x.dueDate && !y.dueDate) {
      return -1;
    } else {
      return x.dueDate - y.dueDate;
    }
  };
  const sortByCreationTime = (x, y) => {
    return y.creationDateTime - x.creationDateTime;
  };
  const sortByAlphabet = (x, y) => {
    return x.name.localeCompare(y.name);
  };
  return {
    sortByPriority,
    sortByDueDate,
    sortByCreationTime,
    sortByAlphabet,
  };
})();
const swapSortMethod = (project) => {
  const projectIndex = model.projectArray.indexOf(project);
  const sortMethodIndex = model.sortMethods.indexOf(project.sortMethod);
  project.sortMethod =
    model.sortMethods[(sortMethodIndex + 1) % model.sortMethods.length];

  localStorage.setItem(
    'storedProjectArray',
    JSON.stringify(model.projectArray)
  );
  if (model.taskArray.length > 0) {
    localStorage.setItem('storedTaskArray', JSON.stringify(model.taskArray));
  }
};
const sortCompleteTasks = (project) => {
  let sortedArray = model.taskArray.filter((task) => task.isComplete);
  if (project !== 'allIncompleteTasks') {
    sortedArray = sortedArray.filter((task) => task.project.id === project.id);
  }
  sortedArray.sort((x, y) => y.completionDateTime - x.completionDateTime);
  return sortedArray;
};
const sortIncompleteProjects = () => {
  const sortedProjects = model.projectArray
    .filter((project) => {
      return (
        project.incompleteTasks > 0 ||
        (project.incompleteTasks === 0 && project.completeTasks === 0)
      );
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  return sortedProjects;
};
const sortCompleteProjects = () => {
  return model.projectArray.filter(
    (project) => project.incompleteTasks === 0 && project.completeTasks > 0
  );
};
const toggleTaskCompletion = async (task) => {
  await _subtractTaskFromProject(task);
  task.isComplete = !task.isComplete;
  await _addTaskToProject(task);

  if (task.isComplete) {
    task.completionDateTime = new Date();
  } else {
    task.completionDateTime = null;
  }
  await overwriteTaskAndItsProject(task);
};
const overwriteDoc = async (obj, taskOrProject) => {
  if (taskOrProject === 'task') {
    const taskDoc = doc(db, 'tasks', obj.id);
    await setDoc(taskDoc, obj);
  } else {
    const projectDoc = doc(db, 'projects', obj.id);
    await setDoc(projectDoc, obj);
  }
};
const overwriteTaskAndItsProject = async (task) => {
  await overwriteDoc(task, 'task');
  await overwriteDoc(
    model.projectArray.find((x) => x.id === task.project.id),
    'project'
  );
};
const repopulateDataFromLocalStorage = async () => {
  try {
    await _repopulateProjects();
    await _repopulateTasks();
    console.log('done repopulating all');
  } catch (err) {
    console.error(err);
  }
};
const _repopulateProjects = async () => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'projects'), orderBy('timeCreated'))
    );
    querySnapshot.forEach(async (doc) => {
      const project = doc.data();
      const newProj = await addNewProject(project.name, project.id);
      for (let prop in project) {
        if (
          prop !== 'incompleteTasks' &&
          prop !== 'completeTasks' &&
          prop !== 'id' &&
          newProj[prop] !== project[prop]
        ) {
          await changeProperty(newProj, prop, project[prop]);
        }
      }
    });
  } catch (e) {
    console.error(e);
  }
};
const _repopulateTasks = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'tasks'));
    querySnapshot.forEach(async (doc) => {
      const task = doc.data();
      const newTask = await addNewTask(
        task.name,
        model.projectArray.find((p) => p.id === task.project.id),
        task.id
      );
      for (let prop in task) {
        if (prop === 'isComplete') {
          if (task[prop] === true) {
            await toggleTaskCompletion(newTask);
          }
        } else if (prop !== 'project') {
          await changeProperty(newTask, prop, task[prop]);
        }
      }
    });
    console.log('done repopulatingTasks');
  } catch (e) {
    console.error(e);
  }
};

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
  repopulateDataFromLocalStorage,
};
