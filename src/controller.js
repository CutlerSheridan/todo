import * as model from './model';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDoc,
  getDocs,
  query,
  setDoc,
  orderBy,
  doc,
  deleteDoc,
} from 'firebase/firestore/lite';

const addNewTask = async (name, optionsObj = {}) => {
  const task = _createTask(name, optionsObj);
  _addTaskToArray(task);
  await _addTaskToProject(task);
  await addTaskToDatabase(task);
  return task;
};
const _createTask = (name, optionsObj) => {
  return model.Task(name, optionsObj);
};
const _addTaskToArray = (task) => {
  model.taskArray.push(task);
};
const deleteTask = async (taskIndex) => {
  const task = model.taskArray[taskIndex];
  await _subtractTaskFromProject(task);
  model.taskArray.splice(taskIndex, 1);
  await deleteDoc(doc(db, 'tasks', task.id));
};
const addNewProject = async (name, optionsObj = {}) => {
  const project = _createProject(name, optionsObj);
  _addProjectToArray(project);
  await _addProjectToDatabase(project);

  return project;
};
const _createProject = (name, optionsObj) => {
  return model.Project(name, optionsObj);
};
const _addProjectToArray = (project) => {
  model.projectArray.push(project);
};
const deleteProject = async (projectIndex) => {
  await deleteTasksFromProject(projectIndex);
  const projectId = model.projectArray[projectIndex].id;
  model.projectArray.splice(projectIndex, 1);
  await deleteDoc(doc(db, 'projects', projectId));
};
const deleteTasksFromProject = async (projectIndex) => {
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
    await deleteTask(taskIndicesToDelete[i]);
  }
  return Promise.resolve();
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
  await setDoc(doc(db, 'projects', task.project.id), task.project);
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
const swapSortMethod = async (project) => {
  const sortMethodIndex = model.sortMethods.indexOf(project.sortMethod);
  project.sortMethod =
    model.sortMethods[(sortMethodIndex + 1) % model.sortMethods.length];
  await setDoc(
    doc(db, 'projects', project.id),
    { sortMethod: project.sortMethod },
    { merge: true }
  );
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
  const project = model.projectArray.find((p) => p.id === task.project.id);
  task.isComplete = !task.isComplete;
  if (task.isComplete) {
    task.completionDateTime = new Date();
    project.completeTasks++;
    project.incompleteTasks--;
  } else {
    task.completionDateTime = null;
    project.completeTasks--;
    project.incompleteTasks++;
  }
  await setDoc(
    doc(db, 'tasks', task.id),
    {
      isComplete: task.isComplete,
      completionDateTime: task.completionDateTime,
    },
    { merge: true }
  );
  await setDoc(
    doc(db, 'projects', project.id),
    {
      completeTasks: project.completeTasks,
      incompleteTasks: project.incompleteTasks,
    },
    { merge: true }
  );
};
const repopulateDataFromDatabase = async () => {
  try {
    await _repopulateProjects();
    await _repopulateTasks();
  } catch (err) {
    console.error(err);
  }
};
const _repopulateProjects = async () => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'projects'), orderBy('timeCreated'))
    );
    querySnapshot.forEach((doc) => {
      const project = doc.data();
      _addProjectToArray(project);
    });
  } catch (e) {
    console.error(e);
  }
};
const _repopulateTasks = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'tasks'));
    querySnapshot.forEach((doc) => {
      const task = doc.data();
      task.project = model.projectArray.find((p) => p.id === task.project.id);
      _addTaskToArray(task);
    });
  } catch (e) {
    console.error(e);
  }
};

// DATABASE LOGIC START
let userPicElement;
let userNameElement;
let signInButtonElement;
let signOutButtonElement;

const addTaskToDatabase = async (task) => {
  try {
    const docRef = doc(db, 'tasks', task.id);
    await setDoc(docRef, task);
    console.log('task document written with id: ' + docRef.id);
  } catch (e) {
    console.error('Error adding task doucment: ', e);
  }
};
const _addProjectToDatabase = async (project) => {
  try {
    const docRef = doc(db, 'projects', project.id);
    await setDoc(docRef, project);
    console.log('project document written with id: ' + docRef.id);
  } catch (e) {
    console.error('Error adding project document ', e);
  }
};
// getting all below code from https://firebase.google.com/codelabs/firebase-web#6
const signIn = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
};
const signOutUser = () => {
  signOut(auth);
};
const initFirebaseAuth = () => {
  onAuthStateChanged(auth, authStateObserver);
};
const initSignInLogic = () => {
  userPicElement = document.querySelector('.user-pic');
  userNameElement = document.querySelector('.user-name');
  signInButtonElement = document.querySelector('.signIn-button');
  signOutButtonElement = document.querySelector('.signOut-button');
  signOutButtonElement.addEventListener('click', signOutUser);
  signInButtonElement.addEventListener('click', signIn);
  initFirebaseAuth();
};
const getProfilePicUrl = () => {
  return auth.currentUser.photoURL || '/images/profile_placeholder.png';
};
const getUserName = () => {
  return auth.currentUser.displayName;
};
const isUserSignedIn = () => {
  return !!auth.currentUser;
};
// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
  if (user) {
    // User is signed in!
    // Get the signed-in user's profile pic and name.
    const profilePicUrl = getProfilePicUrl();
    const userName = getUserName();

    // Set the user's profile pic and name.
    userPicElement.style.backgroundImage =
      'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
    userNameElement.textContent = userName;

    // Show user's profile and sign-out button.
    userNameElement.classList.remove('userElements-hidden');
    userPicElement.classList.remove('userElements-hidden');
    signOutButtonElement.classList.remove('userElements-hidden');

    // Hide sign-in button.
    signInButtonElement.classList.add('userElements-hidden');
  } else {
    // User is signed out!
    // Hide user's profile and sign-out button.
    userNameElement.classList.add('userElements-hidden');
    userPicElement.classList.add('userElements-hidden');
    signOutButtonElement.classList.add('userElements-hidden');

    // Show sign-in button.
    signInButtonElement.classList.remove('userElements-hidden');
  }
}
// Returns true if user is signed-in. Otherwise false and displays a message.
function checkSignedInWithMessage() {
  // Return true if the user is signed in Firebase
  if (isUserSignedIn()) {
    return true;
  }

  // Display a message to the user using a Toast.
  const data = {
    message: 'You must sign-in first',
    timeout: 2000,
  };
  // ADD SOMETHING HERE TO DISPLAY THINGS
  return false;
}
const addSizeToGoogleProfilePic = (url) => {
  if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
    return url + '?sz=150';
  }
  return url;
};

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
const auth = getAuth(app);
initFirebaseAuth();

export {
  addNewTask,
  deleteTask,
  addNewProject,
  deleteProject,
  deleteTasksFromProject,
  changeProperty,
  toggleTaskCompletion,
  swapSortMethod,
  sortIncompleteTasks,
  sortCompleteTasks,
  sortIncompleteProjects,
  sortCompleteProjects,
  repopulateDataFromDatabase,
  addTaskToDatabase,
  initSignInLogic,
};
