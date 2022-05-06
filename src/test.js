import * as view from "./view";
import * as controller from "./controller";
import * as model from "./model";

const _contentDiv = document.querySelector(".content");

const createClearAllButton = () => {
    const btn = document.createElement("button");
    btn.classList.add("clear-all-btn");
    if (!view.deleteBtnsAreShowing) {
        btn.classList.add("invisible");
    }
    btn.textContent = "Clear all";
    btn.addEventListener("click", () => {
        _clearAll();
        view.createProjectPage();
    });

    return btn;
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
    if (!view.deleteBtnsAreShowing) {
        btn.classList.add("invisible");
    }
    btn.textContent = "Demo";
    btn.addEventListener("click", () => {
        _addSampleData();
        view.deleteBtnsAreShowing = false;
        view.createProjectPage();
    });

    return btn;
}
const _addTasksToProject = (project, ...tasks) => {
    for (let i = 0; i < tasks.length; i++) {
        controller.changeProperty(tasks[i], "project", project);
    }
}
const _addSampleData = () => {
    controller.addNewTask("Book my flight for Paris");
    model.taskArray[model.taskArray.length - 1].dueDate = new Date(2022, 6, 14);
    model.taskArray[model.taskArray.length - 1].isHighPriority = true;
    controller.addNewTask("Give that book back to Will");
    model.taskArray[model.taskArray.length - 1].isHighPriority = true;
    controller.addNewTask("Finish Poisonwood Bible for book club");
    model.taskArray[model.taskArray.length - 1].dueDate = new Date(2022, 5, 16);
    controller.toggleTaskCompletion(model.taskArray[model.taskArray.length - 1]);
    model.taskArray[model.taskArray.length - 1].isHighPriority = true;
    controller.addNewTask("Get car serviced");
    model.taskArray[model.taskArray.length - 1].dueDate = new Date(2022, 4, 15);
    
    controller.addNewTask("See if that apartment in Santa Monica is still available");
    controller.addNewTask("Send thank you note to Grandma");
    model.taskArray[model.taskArray.length - 1].dueDate = new Date(2022, 1, 15);

    controller.addNewTask("Check on party timing for Mom");
    controller.toggleTaskCompletion(model.taskArray[model.taskArray.length - 1]);

    controller.addNewTask("Cancel gym membership");
    model.taskArray[model.taskArray.length - 1].dueDate = new Date(2022, 1, 20);
    controller.addNewTask("Find a time to get lunch with Ivana");
    controller.addNewTask("Call Sarah back");

    controller.addNewProject("grocery list", false);

    const groceryArray = [];
    const groceries = [
        "Bananas",
        "Apples",
        "Garlic",
        "Soy sauce",
        "Pasta",
        "Crushed tomatoes",
        "Hamburgers",
        "Hamburger buns",
        "Swiss cheese",
        "Bagels",
        "Cream cheese",
        "La Croix",
        "Broccoli",
        "Ribs",
        "Oregano",
        "Amber ale",
    ]
    groceries.forEach(name => {
        groceryArray.push(controller.addNewTask(name));
        if (name[0].toLowerCase() === "b" || name[0].toLowerCase() === "a") {
            controller.toggleTaskCompletion(groceryArray[groceryArray.length - 1]);
        }
    })
    _addTasksToProject(model.projectArray[model.projectArray.length - 1], ...groceryArray);

    controller.addNewProject("Party checklist", true);
    const partyTaskArray = [];
    const partyTasks = [
        "Get alcohol",
        "Clean living room",
        "Confirm everyone's coming",
        "Find a good playlist",
        "Make snacks",
    ]
    for (let i = 0; i < partyTasks.length; i++) {
        partyTaskArray[i] = controller.addNewTask(partyTasks[i]);
        controller.toggleTaskCompletion(partyTaskArray[i]);
    }
    _addTasksToProject(model.projectArray[model.projectArray.length - 1], ...partyTaskArray);

    const _getRandomInt = (max) => {
        return Math.floor(Math.random() * max);
    }
    controller.addNewProject("school stuff");
    const schoolStuffArray = [];
    const schoolTasks = [
        "Finish Gatsby essay",
        "Get new highlighters",
        "Study for SAT",
        "See if Chelsea will let me copy her APUSH vocab",
        "Memorize hand bones",
        "Look at colleges",
        "Bake something for French",
        "See if I left my stat folder in the locker room",
        "Renew my parking pass",
        "Email Ms. Fishman about test grade",
        "Decorate poster for lit presentation",
    ]
    for (let i = 0; i < schoolTasks.length; i++) {
        schoolStuffArray[i] = controller.addNewTask(schoolTasks[i]);
        if (i > schoolTasks.length / 4 * 3) {
            schoolStuffArray[i].isHighPriority = true;
        }
        if (i % 3 === 0) {
            controller.toggleTaskCompletion(schoolStuffArray[i]);
        }
        schoolStuffArray[i].dueDate = new Date(2022, (_getRandomInt(11) + 1), (_getRandomInt(27) + 1));
    }
    _addTasksToProject(model.projectArray[model.projectArray.length - 1], ...schoolStuffArray);

    controller.addNewProject("Household chores");
    const choreArray = [];
    const chores = [
        "Do the dishes",
        "Put clean clothes away",
        "Scrub stick spot on kitchen floor",
        "Clean shower grout",
        "Vacuum living room",
        "Find extra charging cable",
        "See if that new needle will work with the record player",
        "Get the guest room ready",
        "Get screw for that outlet extender",
        "Hang tree art in the living room",
        "Finish tidying bedroom",
        "Dust the entertainment console",
        "Find new art for the wall over the bar cart",
        "Fix the printer",
        "Put the fire alarm back up",
        "Water the cactus",
    ]
    for (let i = 0; i < chores.length; i++) {
        choreArray[i] = controller.addNewTask(chores[i]);
        if (i > chores.length / 3 * 2) {
            choreArray[i].isHighPriority = true;
        }
        if (i > chores.length / 4 * 3) {
            controller.toggleTaskCompletion(choreArray[i]);
        }
    }
    _addTasksToProject(model.projectArray[model.projectArray.length - 1], ...choreArray);
}

export {
    createClearAllButton,
    createDemoButton,
}