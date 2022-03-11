const model = (() => {
    const Task = (name) => {
        let priority = "m";
        let dueDate = null;
        let isPastDue = false;
        let project = projectArray[0];
        let notes = null;
        let checklist = null
        let isComplete = false;
        let completionDateTime = null;
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
            completionDateTime,
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
    const _createTask = (name) => {
        return model.Task(name);
    }
    const _addTaskToArray = (task) => {
        model.taskArray.push(task);
    }
    const addNewTask = (name) => {
        const task = _createTask(name);
        _addTaskToArray(task);
    }
    // const _createProject = (name) => {
    //     return model.Project(name);
    // }
    // const _addProjectToArray = (project) => {
    //     model.projectArray.push(project);
    // }
    // const addNewProject = (name) => {
    //     const project = _createProject(name);
    //     _addProjectToArray(project);
    // }
    const toggleTaskCompletion = (task) => {
        task.isComplete = !task.isComplete;
        if (task.isComplete) {
            // task.completionDateTime = currentTime;
        } else {
            task.completionDateTime = null;
        }
    }
    return {
        addNewTask,
        toggleTaskCompletion,
    }
})();

const view = (() => {
    const _contentDiv = document.querySelector(".content");
    const createGeneralPage = () => {
        // create header
        const heading = document.createElement("h1");
        heading.textContent = "General";
        _contentDiv.append(heading);
        _updateTaskList();
    }
    const _updateTaskList = () => {
        const taskListDiv = document.createElement("section");
        const incompleteTasks = document.createElement("section");
        incompleteTasks.classList.add("task-list");
        const completeTasks = document.createElement("section");
        completeTasks.classList.add("task-list");
        taskListDiv.append(incompleteTasks, completeTasks);
        _contentDiv.append(taskListDiv);

        model.taskArray.forEach(task => {
            if (task.isComplete) {
                completeTasks.append(_createTaskElement(task));
            } else {
                incompleteTasks.append(_createTaskElement(task));
            }
        })
    }
    const _createTaskElement = (task) => {
        const taskContainer = document.createElement("div");
        taskContainer.classList.add("task-container");
        taskContainer.dataset.task = model.taskArray.indexOf(task);
        const taskLabel = document.createElement("label");
        taskLabel.classList.add("task-label");
        taskLabel.dataset.task = model.taskArray.indexOf(task);
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.dataset.task = model.taskArray.indexOf(task);
        checkbox.addEventListener("change", _toggleCompleteClass);

        taskLabel.append(checkbox);
        taskLabel.append(task.name);
        taskContainer.append(taskLabel);
        if (task.dueDate) {
            const dueDateElement = document.createElement("p");
            dueDateElement.classList.add("due-date");
            dueDateElement.textContent = task.dueDate;
            taskContainer.append(dueDateElement);
        }
        if (task.isComplete) {
            checkbox.checked = true;
            taskContainer.classList.add("complete-task");
        }
        return taskContainer;
    }
    const _toggleCompleteClass = (e) => {
        const taskIndex = e.target.dataset.task;
        const taskContainer = document.querySelector(`.task-container[data-task="${taskIndex}"]`);
        taskContainer.classList.toggle("complete-task");
        controller.toggleTaskCompletion(model.taskArray[taskIndex]);
        console.log(model.taskArray[taskIndex]);
    }
    return {
        createGeneralPage,
    }
})();

const setup = (() => {
    model.taskArray.push(
        {name: "First test", dueDate: "7/14"},
        {name: "This is the second test"},
        {name: "This is a third test", dueDate: "5/15"},
        {name: "This is a fourth test", dueDate: "6/16", isComplete: true},
    )
    const content = document.querySelector(".content");

    view.createGeneralPage();
})();