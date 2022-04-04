import * as model from "./model";
import * as view from "./view";
import * as controller from "./controller";

const setup = (() => {
    const generalProj = model.Project("general", false);
    model.projectArray.push(generalProj);
    console.log(model.projectArray);

    const otherProj = model.Project("Other", false);
    model.projectArray.push(otherProj);

    const emptyProj = model.Project("empty", false);
    const completeProj = model.Project("complete", false);
    model.projectArray.push(emptyProj, completeProj);

    controller.addNewTask("First Test");
    model.taskArray[0].dueDate = new Date(2022, 6, 14);
    model.taskArray[0].priority = 0;
    controller.addNewTask("This is the second test");
    model.taskArray[1].priority = 2;
    controller.addNewTask("This is the third test");
    model.taskArray[2].dueDate = new Date(2022, 5, 16);
    controller.toggleTaskCompletion(model.taskArray[2]);
    model.taskArray[2].priority = 2;
    controller.addNewTask("This is gonna be the fourth test right about here");
    model.taskArray[3].dueDate = new Date(2022, 4, 15);

    model.taskArray.forEach(task => task.project = model.projectArray[0]);
    
    controller.addNewTask("This should not be in General");
    model.taskArray[4].project = model.projectArray[1];

    controller.addNewTask("Another test");
    controller.addNewTask("Past due task");
    model.taskArray[6].dueDate = new Date(2022, 1, 15);

    controller.addNewTask("Most recently finished task");
    controller.toggleTaskCompletion(model.taskArray[7]);

    controller.addNewTask("Another past due");
    model.taskArray[8].dueDate = new Date(2022, 1, 20);
    controller.addNewTask("Scroll test task");
    controller.addNewTask("Scroll test task");
    controller.addNewTask("Scroll test task");
    controller.addNewTask("Scroll test task");
    controller.addNewTask("Scroll test task");
    controller.addNewTask("Scroll test task");
    controller.addNewTask("Scroll test task");
    controller.addNewTask("Scroll test task");
    controller.addNewTask("Scroll test task");
    controller.addNewTask("Scroll test task");
    controller.addNewTask("Scroll test task");
    controller.addNewTask("Scroll test task");
    controller.addNewTask("Scroll test task");
    controller.addNewTask("Scroll test task");

    controller.addNewTask("completed task");
    const finalIndex = model.taskArray.length - 1;
    controller.toggleTaskCompletion(model.taskArray[finalIndex]);
    model.taskArray[finalIndex].project = model.projectArray[3];




    view.createGeneralPage();
    const generalTab = document.querySelector("#tab-general");
    generalTab.addEventListener("click", view.createGeneralPage);
    const projectsTab = document.querySelector("#tab-projects");
    projectsTab.addEventListener("click", view.createAllProjectsPage);
    const logbookTab = document.querySelector("#tab-logbook");
    logbookTab.addEventListener("click", view.createLogbookPage);
    console.log(model.taskArray);
})();