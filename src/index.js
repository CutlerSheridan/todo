import * as model from "./model";
import * as view from "./view";
import * as controller from "./controller";

const setup = (() => {
    controller.repopulateDataFromLocalStorage();
    if (!model.projectArray.length > 0) {
        controller.addNewProject("general");
    }
    console.log(model.taskArray);
    console.log(model.projectArray);
    console.log("hello");

    view.createProjectPage();
    console.log("completed task");
    console.log(model.taskArray.find(task => task.name === "completed task"));
    const generalTab = document.querySelector("#tab-general");
    generalTab.addEventListener("click", view.createProjectPage);
    const projectsTab = document.querySelector("#tab-projects");
    projectsTab.addEventListener("click", view.createAllProjectsPage);
    const logbookTab = document.querySelector("#tab-logbook");
    logbookTab.addEventListener("click", view.createLogbookPage);
    console.log(model.taskArray);
})();