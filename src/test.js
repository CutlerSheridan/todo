import * as view from "./view";
import * as controller from "./controller";
import * as model from "./model";

const _contentDiv = document.querySelector(".content");

const createClearAllButton = () => {
    const btn = document.createElement("button");
    btn.classList.add("clear-all-btn");
    btn.textContent = "Clear all";
    btn.addEventListener("click", () => {
        _clearAll();
        view.createProjectPage();
    });
    _contentDiv.append(btn);

    const footer = document.querySelector("footer");
    const displacementAmount = 15;
    btn.style.right = displacementAmount * 6 + "px";
    btn.style.bottom = footer.offsetHeight + displacementAmount + "px";
}
const _clearAll = () => {
    model.taskArray.splice(0, model.taskArray.length);
    model.projectArray.splice(1, model.projectArray.length - 1);
    model.projectArray[0].incompleteTasks = 0;
    model.projectArray[0].completeTasks = 0;
    localStorage.clear();
}

const createDemoButton = () => {
    const btn = document.createElement("button");
    btn.classList.add("demo-btn");
    btn.textContent = "Demo";
    btn.addEventListener("click", () => {
        _addSampleData();
        view.createProjectPage();
    });
    _contentDiv.append(btn);

    const footer = document.querySelector("footer");
    const displacementAmount = 15;
    btn.style.right = displacementAmount * 12 + "px";
    btn.style.bottom = footer.offsetHeight + displacementAmount + "px";
}
const _addTasksToProject = (project, ...tasks) => {
    for (let i = 0; i < tasks.length; i++) {
        controller.changeProperty(tasks[i], "project", project);
    }
}
const _addSampleData = () => {
    controller.addNewTask("First Test");
    model.taskArray[model.taskArray.length - 1].dueDate = new Date(2022, 6, 14);
    model.taskArray[model.taskArray.length - 1].isHighPriority = true;
    controller.addNewTask("This is the second test");
    model.taskArray[model.taskArray.length - 1].isHighPriority = true;
    controller.addNewTask("This is the third test");
    model.taskArray[model.taskArray.length - 1].dueDate = new Date(2022, 5, 16);
    controller.toggleTaskCompletion(model.taskArray[model.taskArray.length - 1]);
    model.taskArray[model.taskArray.length - 1].isHighPriority = true;
    controller.addNewTask("This is gonna be the fourth test right about here");
    model.taskArray[model.taskArray.length - 1].dueDate = new Date(2022, 4, 15);
    
    controller.addNewTask("This should not be in General", model.projectArray[1]);

    controller.addNewTask("Another test");
    controller.addNewTask("Past due task");
    model.taskArray[model.taskArray.length - 1].dueDate = new Date(2022, 1, 15);

    controller.addNewTask("Most recently finished task");
    controller.toggleTaskCompletion(model.taskArray[model.taskArray.length - 1]);

    controller.addNewTask("Another past due");
    model.taskArray[model.taskArray.length - 1].dueDate = new Date(2022, 1, 20);
    controller.addNewTask("Scroll test task");
    controller.addNewTask("Scroll test task");

    controller.addNewProject("empty", false);
    controller.addNewProject("other", false);
    const otherTasksArray = [];
    for (let i = 0; i < 7; i++) {
        otherTasksArray[i] = controller.addNewTask("This goes in Other");
        if (i % 2 === 0) {
            controller.toggleTaskCompletion(otherTasksArray[i]);
        }
    }
    _addTasksToProject(model.projectArray[model.projectArray.length - 1], ...otherTasksArray);

    controller.addNewTask("Scroll test task");
    controller.addNewTask("Scroll test task");
    controller.addNewTask("Scroll test task");

    controller.addNewProject("a complete project", false);
    controller.addNewTask("completed task", model.projectArray[model.projectArray.length - 1]);
    controller.toggleTaskCompletion(model.taskArray[model.taskArray.length - 1]);

    controller.addNewProject("another complete project", true);
    const completedTasksForTesting = [];
    for (let i = 0; i < 5; i++) {
        completedTasksForTesting[i] = controller.addNewTask("Another testing task");
        controller.toggleTaskCompletion(completedTasksForTesting[i]);
    }
    _addTasksToProject(model.projectArray[model.projectArray.length - 1], ...completedTasksForTesting);

    const _getRandomInt = (max) => {
        return Math.floor(Math.random() * max);
    }
    controller.addNewProject("a project with tasks");
    const moreTasksForTesting = [];
    for (let i = 0; i < 20; i++) {
        moreTasksForTesting[i] = controller.addNewTask("This is a testing task");
        if (i > 14)
        moreTasksForTesting[i].isHighPriority = true;
        if (i % 4 === 0) {
            controller.toggleTaskCompletion(moreTasksForTesting[i]);
        }
        moreTasksForTesting[i].dueDate = new Date(2022, (_getRandomInt(11) + 1), (_getRandomInt(27) + 1));
    }
    _addTasksToProject(model.projectArray[model.projectArray.length - 1], ...moreTasksForTesting);

    controller.addNewProject("Here's a project");
    const newProjectTasks = [];
    for (let i = 0; i < 10; i++) {
        newProjectTasks[i] = controller.addNewTask("Here's a task");
        if (i > 6) {
            newProjectTasks[i].isHighPriority = true;
        }
        if (i % 2 === 0) {
            controller.toggleTaskCompletion(newProjectTasks[i]);
        }
    }
    _addTasksToProject(model.projectArray[model.projectArray.length - 1], ...newProjectTasks);
    console.log("storedTaskArray at end of test.js");
    console.log(JSON.parse(localStorage.getItem("storedTaskArray")));
    console.log("model.taskArray at end of demo");
    console.log(model.taskArray);
    console.log("stored project array at end of test.js");
    console.log(JSON.parse(localStorage.getItem("storedProjectArray")));
    console.log("model.projectArray at end of test.js");
    console.log(model.projectArray);
}

export {
    createClearAllButton,
    createDemoButton,
}