import * as model from "./model";
import * as view from "./view";
import * as controller from "./controller";

const setup = (() => {
    controller.addNewProject("general");


    view.createProjectPage();
    const generalTab = document.querySelector("#tab-general");
    generalTab.addEventListener("click", view.createProjectPage);
    const projectsTab = document.querySelector("#tab-projects");
    projectsTab.addEventListener("click", view.createAllProjectsPage);
    const logbookTab = document.querySelector("#tab-logbook");
    logbookTab.addEventListener("click", view.createLogbookPage);
    console.log(model.taskArray);
})();