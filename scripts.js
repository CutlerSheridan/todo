const model = (() => {
    const Task = (name) => {
        let priority = "m";
        let dueDate = null;
        let isPastDue = false;
        let project = projectArray[0];
        let notes = null;
        let checklist = null
        let isComplete = false;
        let completionDate = null;
        // let timeCreated = currentTime;
        return {
            name,
            priority,
            dueDate,
            isPastDue,
            project,
            notes,
            checklist,
            isComplete,
            completionDate,
            // timeCreated,
        }
    }
    const Project = (title) => {
        let showProgress = true;
        // let timeCreated = currentTime;
        return {title, showProgress}
    }
    let taskArray = [];
    let projectArray = [];
    return {Task, Project, taskArray, projectArray}
})();

const controller = (() => {
    // add code
})();

const view = (() => {
    const createTaskElement = (task) => {
        const taskContainer = document.createElement("div");
        taskContainer.classList.add("task-container");
        const taskLabel = document.createElement("label");
        taskLabel.classList.add("task-label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        taskLabel.append(checkbox);
        taskLabel.append(task.name);
        taskContainer.append(taskLabel);
        if (task.dueDate) {
            const dueDateElement = document.createElement("p");
            dueDateElement.classList.add("due-date");
            dueDateElement.textContent = task.dueDate;
            taskContainer.append(dueDateElement);
        }
        return taskContainer;
    }
    return {createTaskElement}
})();

const setup = (() => {
    model.taskArray.push(
        {name: "This is a third test", dueDate: "5/15"},
        {name: "This is a fourth test", dueDate: "6/16"},
    )
    const content = document.querySelector(".content");
    model.taskArray.forEach(task => {
        content.append(view.createTaskElement(task));
    })
})();