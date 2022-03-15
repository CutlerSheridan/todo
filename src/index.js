import * as model from "./model";
import * as view from "./view";
import * as controller from "./controller";

const setup = (() => {
    const generalProj = model.Project("General");
    model.projectArray.push(generalProj);
    console.log(model.projectArray);

    const otherProj = model.Project("Other");
    model.projectArray.push(otherProj);

    controller.addNewTask("First Test");
    model.taskArray[0].dueDate = "7/14";
    model.taskArray[0].priority = 0;
    controller.addNewTask("This is the second test");
    model.taskArray[1].priority = 2;
    controller.addNewTask("This is the third test");
    model.taskArray[2].dueDate = "6/16";
    model.taskArray[2].isComplete = true;
    model.taskArray[2].priority = 2;
    controller.addNewTask("This is gonna be the fourth test right about here");
    model.taskArray[3].dueDate = "5/15";

    model.taskArray.forEach(task => task.project = model.projectArray[0]);
    
    controller.addNewTask("This should not be in General");
    model.taskArray[4].project = model.projectArray[1];

    controller.addNewTask("Another test");

    view.createGeneralPage();
    console.log(model.taskArray);
})();