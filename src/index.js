import * as model from "./model";
import * as view from "./view";
import * as controller from "./controller";

const setup = (() => {
    controller.addNewProject("general");
    controller.addNewProject("other", false);
    controller.addNewProject("empty", false);
    controller.addNewProject("a complete project", false);

    controller.addNewTask("First Test");
    model.taskArray[0].dueDate = new Date(2022, 6, 14);
    model.taskArray[0].isHighPriority = true;
    controller.addNewTask("This is the second test");
    model.taskArray[1].isHighPriority = true;
    controller.addNewTask("This is the third test");
    model.taskArray[2].dueDate = new Date(2022, 5, 16);
    controller.toggleTaskCompletion(model.taskArray[2]);
    model.taskArray[2].isHighPriority = true;
    controller.addNewTask("This is gonna be the fourth test right about here");
    model.taskArray[3].dueDate = new Date(2022, 4, 15);

    model.taskArray.forEach(task => task.project = model.projectArray[0]);
    
    controller.addNewTask("This should not be in General", model.projectArray[1]);

    controller.addNewTask("Another test");
    controller.addNewTask("Past due task");
    model.taskArray[6].dueDate = new Date(2022, 1, 15);

    controller.addNewTask("Most recently finished task");
    controller.toggleTaskCompletion(model.taskArray[7]);

    controller.addNewTask("Another past due");
    model.taskArray[8].dueDate = new Date(2022, 1, 20);
    controller.addNewTask("Scroll test task");
    controller.addNewTask("Scroll test task");

    const otherTasksArray = [];
    for (let i = 0; i < 7; i++) {
        otherTasksArray[i] = controller.addNewTask("This goes in Other");
        if (i % 2 === 0) {
            controller.toggleTaskCompletion(otherTasksArray[i]);
        }
    }
    controller.addTasksToProject(model.projectArray[1], ...otherTasksArray);

    controller.addNewTask("Scroll test task");
    controller.addNewTask("Scroll test task");
    controller.addNewTask("Scroll test task");

    controller.addNewTask("completed task", model.projectArray[3]);
    const finalIndex = model.taskArray.length - 1;
    controller.toggleTaskCompletion(model.taskArray[finalIndex]);

    controller.addNewProject("another complete project", true);
    const completedTasksForTesting = [];
    for (let i = 0; i < 5; i++) {
        completedTasksForTesting[i] = controller.addNewTask("Another testing task");
        controller.toggleTaskCompletion(completedTasksForTesting[i]);
    }
    controller.addTasksToProject(model.projectArray[model.projectArray.length - 1], ...completedTasksForTesting);

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
    controller.addTasksToProject(model.projectArray[model.projectArray.length - 1], ...moreTasksForTesting);

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
    controller.addTasksToProject(model.projectArray[model.projectArray.length - 1], ...newProjectTasks);

    view.createProjectPage();
    const generalTab = document.querySelector("#tab-general");
    generalTab.addEventListener("click", view.createProjectPage);
    const projectsTab = document.querySelector("#tab-projects");
    projectsTab.addEventListener("click", view.createAllProjectsPage);
    const logbookTab = document.querySelector("#tab-logbook");
    logbookTab.addEventListener("click", view.createLogbookPage);
    console.log(model.taskArray);
})();