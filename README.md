# ToDo Web App
## A website for keeping track of what you need to do
If you need a free place to keep track of your to-do list, look no further.

If you click the trash can toggle on the General page, in addition to toggling the delete buttons for each individual task, two other buttons will also appear:  "Demo" and "Clear All."

The "Demo" button adds a bunch of sample tasks and projects so you can see a demonstration of what the app looks like in use.  To delete all tasks and projects, click "Clear all," and you'll have a clean slate once again.

#### TO-DO NEXT

#### TO-DO LATER
##### Features

##### Behavior
- ? get new tasks/projects to show up faster
- ? fix .gitattributes lol
- ? make new project text highlightable (new task text already works fine)
- ? change Notes edit box in task form to allow line breaks from pressing enter
##### Style
- ? change progress icon?
##### Other
##### Maybe
- add checklist capability to task form page?
- sort completed projects according to last one completed
- make completed tasks / projects collapsible
- make New Task box have translucent placeholder text
- figure out how to assign a changeable, persistent sort method to Incomplete since I foolishly didn't create a project for logbook

#### DONE
- *1.1.5.2*
- delete remaining console.log
- *1.1.5.1*
- build dist folder
- *1.1.5*
- disable buttons and tabs when signed out (except more task info and sign-in/out)
- clean up console.logss
- *1.1.4*
- make sign-in option only appear on General page
- make projects and tasks disappear upon sign-out
- make placeholder project and task if not signed in
- make sure brand new user works

- *1.1.3*
- make sample data apply the current year for due dates
- optimize Clear All (from 15s to 8s using sample data)

- *1.1.2*
- make user's tasks populate upon initial load instead of only when tabbing away and tabbing back

- *1.1.1*
- make tasks and projects account-specific
- get tasks/projects not to duplicate upon populating

- *1.1.0*
- implement sign-in/-out functionality
- get sign-in/-out UI looking decent

- *1.0.11*
- write safeguards for when demo or clear all is pressed so nothing else can interrupt

- *1.0.10*
- optimize loading demo content (25s)
  - refactor model.Project to accept options object as parameter
  - refactor test.js so each task/project is created with all parameters immediately except completion status (21s, 19s)
- refactor toggleTaskCompletion to use three database calls instead of four
  - reduce that to two calls (20s, 16s)
- create test.js-specific _createTask() which allows new tasks to be created without updating project number of tasks, allowing batch updates after each project data population finishes (12s, 10s, 8s)
  - fix groceries sample data appearing incorrectly
  - remove Household Chores from demo (8s, 7s)

- *1.0.9*
- refactor model.Task to accept options object as parameter
- *1.0.8*
- get clear all button working
- get demo content working
- fix Clear All button :/
- get rid of console.logs

- *1.0.7*
- add ability to delete tasks
- add ability to delete projects
- integrate Sort Method swaps into database

- *1.0.6*
- make tasks retain details (like if high priority) immediately upon refresh; currently happens too late (a high priority general task will not load as such, but if you tab away and tab back, it will be shown properly)
  - incidentally fixed the progress display on new Projects upon creation
  
- *1.0.5*
- fix date object type errors for due dates
- fix due dates claiming to be past due even when not upon first loading

- *1.0.4*
- make _addTaskToProject add task to DB as well
- refactor _subtract... as well
- figure out why new task no longer auto-focuses on the input box to rename it (fixed by making _insertNewItemInput async in view.js and awaiting addNewTask)
- get tasks to show up by fixing syntax of repopulateDataFromLocalStorage
- get task details screen to work

- *1.0.3*
- add ids to tasks
- add ids to projects
- prevent page initialization from adding a new project
- get changeProperty to change the database entries
- figure out why renaming project upon initial creation doesn't work
- make sure main project is always General

- *1.0.2*
- import and initialize firebase
- figure out why identical tasks aren't registering as such in checkIfTaskExists()
- figure out why checkIfTaskExists() result isn't carrying over into following operation

- *1.0.1.8*
- fix .gitattributes
- *1.0.1.7*
- fix .gitattributes
- *1.0.1.6*
- adjust .gitattributes
- *1.0.1.5*
- adjust .gitattributes
- *1.0.1.4*
- adjust .gitattributes
- *1.0.1.3*
- adjust .gitattributes
- *1.0.1.2*
- adjust .gitattributes
- *1.0.1.1*
- implement ESLint
- implement Prettier
- add .gitattributes so GitHub recognizes languages appropriately
- *1.0.1*
- make footer buttons sticky again
- *1.0.0*
- restructure footer buttons so they all return a container div and use that for placement
- *0.15.1*
- make project name edit icon an ::after pseudo-element to prevent it from being deletable
- prevent edit icon from disappearing on mobile if project names are a certain length
- fix credit placement (again)
- *0.15.0*
- fix sortByCreationTime()
- replace logbook with Incomplete tab
- fix back buttons of task forms arrived at from Incomplete
- *0.14.10*
- make number of tasks always shows but the progress bar is toggle-able
- fix progress toggles toggle fucking up if it's active and you click "new project"
- fix how, if Progress Toggles Toggle is active and you click New Project, one toggle  remains next to the focused project name
- *0.14.9*
- rephrase placeholder text
- make my name only appear in General
- change delete toggle icon for more clear symbol
- fix progress bar width scaling
- add visual indicator that project name is editable
- *0.14.8*
- further adjust credit placement
- make sample projects better, like add a grocery list
- fix task lists and credit placement; min-height won't work because it leaves a huge space before completed tasks start
- *0.14.7*
- switch demo buttons' displacement units to rem for consistency across scaling font sizes based on screen width
- fix task list divider to only show up if there are incomplete tasks AND complete tasks
- fix divider for projects, too
- add min-height for .task-lists so credit isn't too high up on empty projects
- *0.14.6*
- decide how to handle past due indicator
- add my name
- *0.14.5*
- change fonts
- adjust footer tab borders
- make the red a nicer shade
- change project progress bar color to clr-pri
- adjust width for desktop
- adjust font size with media query
- make General and Projects page headers equal in height
- *0.14.4*
- add hover colors for buttons
- *0.14.3*
- make sort method button equal height of other header buttons
- make in/complete tasks divider line only appear if there are incomplete tasks
- make in/complete projects divider line only appear if there are incomplete tasks
- make delete toggle revert upon implementing demo
- *0.14.2*
- add transition to footer tabs
- make preset header names bigger
- make custom header names smaller
- adjust header line breaks/hyphenation
- prevent sort method from wrapping
- *0.14.1*
- change everything to off-white and off-black again but a little nicer
- import material icons
- apply icons
- prevent icon ligature from displaying before icon loads
- make header buttons smaller
- fix back button returning to Projects page only working the first time
- fix Projects page delete toggle and progress toggles toggle not properly switching to the other if one is already active
- put header right buttons into div for cleaner, more consistent formatting
- *0.14.0*
- create CSS color variables
- make tasks/projects fade into header as user scrolls
- play with a blueprint-style color palette
- attach Demo and Clear All buttons to Delete Button toggle
- *0.13.7*
- fix delete buttons maintaining hover behavior on iOS after clicking one
- fix checkboxes maintaining hover after tap
- fix all buttons retaining hover status on mobile
- stop delete button or progress toggle appearance on Projects page from changing the width of the progress bars
- *0.13.6*
- adjust task form style
- clean up console.log()s
- make footer tabs highlight active one
- make headers all same height
- make project progresses same height
- *0.13.5*
- make text inputs start with shift key down using input[autocapitalize="on"] (this didn't totally work but not worth wasting time on)
- make it so pressing "done" on "new project" interface adds back the listeners so you can click through to projects
- fix "done" on task names too, if possible, though it works correctly with two taps instead of one when trying to click another name to edit it
- *0.13.4*
- fix repopulating checking sortMethod messing up if a project's sortMethod is different (currently, if you go to a project, change the sort method, and refresh, all of those tasks go into General)
- *0.13.3*
- sort Projects alphabetically
- fix tasks not sorting alphabetically
- *0.13.2*
- clean up console.log()s
- make Back button in task form within logbook go back to logbook
- *0.13.1*
- make progress of projects calculate correctly (currently says 0 for all)
  - is it checking before arrays get populated?
  - or actually addNewTask() isn't properly adding task to project because of how the arrays are repopulating; should try to pass the correct project into the addNewTask() argument in _repopulateTask()
  - the task.isComplete property is accurate; for some reason the _addTaskToProject() function isn't working
  - use toggleTaskCompletion in _repopulateTasks() if the property is isComplete and the value is true
- *0.13.0*
- add localStorage.setItem() for storedTaskArray and storedProjectArray
- move addTasksToProject() to test.js
- save everything in localStorage
- read localStorage upon loading page
- figure out why localStorage is emptying the storedTaskArray
  - it's happening during _repopulateProjects() because console.log() shows the array is full before that and at least as far as localStorage.removeItem();
  - it's happening during the forEach loop
  - it's happening during changeProperty()
  - it happens when changeProperty() tries to call localStorage.setItem("storedTaskArray");
  - ohhh it's because this is changing storedTaskArray before _repopulateTaskArray() is called, which requires the full storedTaskArray to work
- figure out why projects are repopulated but tasks aren't
  - oh I bet it's because it's not actually linking the new tasks with the same projects, they're just identical objects, so I need to save the indices of the projects
- import parseJSON from date-fns to parse the JSON date strings into Date objects
- add conditional in _repopulateTasks() to only assign date properties if the stored date is not null
- *0.12.1*
- create new "test" module
- move "clear all" to "test" module
- add "add sample tasks" button
- *0.12.0*
- add Clear All button
- fix create___() functions so, if a tab is clicked on from a task form page, the tab navigates the user correctly
- *0.11.3*
- add progress toggle button on each project element
- make progress toggle buttons work
- adjust progress toggle so it changes the project property
- prevent progress toggles from appearing on completed projects
- *0.11.2*
- add progress toggles toggle for Projects page
- *0.11.1*
- change project elements so project name and progress are in one container, delete button and progress toggle are separate
- fix complete projects not showing up in Projects
- make it so General is not an option on Projects page
- add another sample project
- fix New Project button so focus directs correctly
- *0.11.0*
- fix Delete buttons
- expand Delete buttons to delete projects too on Projects page
- add Delete buttons and toggle to Projects page
- make Delete Toggle revert upon switching to Projects page
- prevent Delete buttons on Projects page from opening a project
- *0.10.11*
- refactor New Project to use createEditBox() if possible
- adjust createEditBox() so clicking a project name in Projects creates the project page without the keyboard briefly popping up
- fix Projects page so, when you're typing in the name of a new project, you can tap another project name to focus out without it taking you to that other project's page
- *0.10.10*
- delete most of the _replaceProjectInputWithName() function because it calls _updateProjectList()
- fix this godforsaken bug that makes it so, on iOS, pressing "New Task" creates a new task element and gives it focus, but the keyboard doesn't pop up
  - on subsequent presses of New Task, the keyboard DOES pop up, but ONLY if there is already a task with the same name as the placeholder task name
  - the contentEditable div works fine on project names
  - FocusEvent fires twice if New Task placeholder name is unique, triggering _handleEditBoxFocus() twice
  - the other task(s) with identical name(s) do not need to be immediately before the new task
  - the FocusEvent attributes in the console should have relatedTarget: button.new-item-button, but the extra Event's relatedTarget is null
  - doesn't matter what the identically-named task is (as in, the issue is not related to creating a task with the same placeholder name that the listener checks for to delete or repopulate when a user is typing)
  - the focus/keyboard functions correctly even when no other identically-named task exists IF another task name has accidentally allowed an "enter" line break to occur...?
  - confirmed the textContent in the newly-created Task Name derives from the task.name property, it's not going too fast and using the placeholder for empty task names
  - if I use createEditBox() in _createProjectElement(), same issue occurs
  - the e.preventDefault() on the project name element is not what makes project names function fine
  - _submitTextValue() is getting called via click immediately upon pressing the New Item button
  -OH MY GOD.  This has to do with the "focus" and "click" events interrupting each other; setting the "focus" listener to {once: true} solves this, but then you can't edit a task name more than once.  PROGRESS
  - change "click" event to "mousedown"
  - curry _handleEditBoxFocus().  Somehow... somehow this fixed it.  Jesus Christ.  Three days on this.
- make clicking away from mid-edit task name not switch to editing another task name (also fixed thanks to previous bug fix)
- abstract _moveCaretToEnd() as a function for reuse
- *0.10.9.1*
- (placeholder build while I try to fix this task name focus issue)
- *0.10.9*
- fix Sort By so it's not centered at the top
- change the task names to contentEditable divs just to simplify everything + reuse the same functions in the Task Form as well
- migrate createEditBox() and related functions to view.js for reuse
- make Project header names editable only when you're on the project page
- *0.10.8*
- prevent sort button from appearing in logbook
- *0.10.7*
- fix refresh button to work in logbook
- *0.10.6*
- get delete button to revert when the page changes
- fix delete button so it switches textContent the way it should
- *0.10.5*
- get delete buttons working correctly on logbook
- make those methods use in/completeTasks properties instead of sort____.length
- *0.10.4*
- add "completeTasks" and "incompleteTasks" properties to projects
- *0.10.3*
- add sort button that each project remembers
- make sort button cycle between sorting options
- *0.10.2*
- remove date-fns dependence from controller.js
- *0.10.1*
- refactor sortIncompleteTasks() so it's scalable and ready for sort button integration
- *0.10.0*
- add button up top that makes delete buttons appear!  They swap with Task Form buttons
- isolate Task Form checkboxes for styling
- make it so New Task button doesn't cover buttons on tasks
- fix empty space so it doesn't shift to top of task list upon task deletion
- add global variable to track if delete buttons should be displayed or not
- *0.9.12*
- move createBackBtn() to view.js for reuse
- add back button to project pages
- *0.9.11*
- make completed tasks' Task Form button grey
- add Date Completed line to Task Form
- make Date Completed line toggle visibility and update upon clicking Task Completed checkbox
- whoa fix checkboxes fucking up the first time you check or uncheck them upon page load before a refresh
- fix issue where typing in a task name on a project page then clicking a Task Form arrow will bring up a fucked up combo page (just added setTimeout of 10ms to Task Form so it triggers after text submission)
- *0.9.10*
- add notes to task form
- make edit boxes auto-populate text if null is entered
- *0.9.9*
- enable due date picker to pick due dates
- *0.9.8*
- create Due Date option
- create Due Date picker
- make picker display due date or current date upon load
- make picker disable upon toggling
- make picker apply or remove current dueDate property from task upon toggling
- *0.9.7*
- fix _createProjectDropdown() so the task's current project is selected to begin with
- create "high priority" choice
- rewrite checkbox id/for algorithm to eliminate redundancies
- *0.9.6*
- isolate _createChoiceLabel() for reuse
- change _createProjectSelectorContainer() to _createChoiceContainer() and pass a function as argument
- *0.9.5*
- add project dropdown to Task Form
- connect dropdown choice to task's project
- *0.9.4*
- add changeProperty() to controller
- *0.9.3*
- make _createEditBox() handle inputs
- *0.9.2*
- write _createBackBtn() for Task Form
- write reusable _createEditBox() function
- *0.9.1*
- isolate createCheckbox()
- *0.9.0*
- isolate _createDeleteTaskBtn() into its own function
- add button that goes to task details page
- *0.8.2*
- change to only have two priorities.  default has nothing special about it, only high priority looks different
- simplify sortIncompleteTasks()
- *0.8.1*
- make checkboxes grey on hover
- prevent project names from becoming text boxes upon mousedown before triggering createProjectPage()
- *0.8.0*
- add Delete Task button
- make Delete Task button work
- make cursor start at beginning of project name input
- *0.7.2*
- make empty projects still show up in Projects
- add New Project button
- *0.7.1*
- add placeholder text for New Task input that disappears when you start typing
- make new tasks auto-sort upon entering them
- *0.7.0*
- write function to create New Task button
- make New Task button work
- *0.6.2*
- make project names title case
- maybe progress bar only goes halfway across the screen
- make projects in complete section hide progress
- add more projects with more tasks for testing.
- make progress bars show % complete instead of % incomplete
- *0.6.1*
- add createNewProject()
- add addTasksToProject() for testing
- add a few more tasks to Other for testing
- *0.6.0*
- refactor createGeneralPage() to createProjectPage() for reusability
- add ability to go to a project's page from Projects page
- prevent Refresh button creation on Projects page
- *0.5.2*
- make _createProjectElement() show progress bar
- *0.5.1*
- make _createProjectElement() show num of incomplete tasks
- add section for completed projects
- *0.5.0*
- write controller.sortIncompleteProjects()
- write _updateProjectList()
- write basics of _createProjectElement()
- get Projects page working at a baseline
- *0.4.4*
- add transition to marking tasks complete
- start work on createAllProjectsPage()
- switch text input boxes to textarea elements to allow for line breaking
- make name input boxes as wide and tall as task names
- switch textarea elements to contentEditable divs to automatically resize when typing
- make cursor start at end of task name input
- *0.4.3*
- make pressing enter change name from form
- *0.4.2*
- make _replaceInputWithName() trigger even if you move the cursor within the input by rewriting function to pass in (e) and work from there
- use currying to allow eventListener to remove itself outside the scope
- *0.4.1*
- make tapping anywhere else onscreen change name from form
- add ability to change multiple names without refreshing
- fix refresh button
- *0.4.0*
- add ability to click a task name and turn it into a form to (once this part is implemented) change the name of the task
- disable other event listeners once one input is added
- style the input a little
- *0.3.3*
- make checkbox label element to replace browser checkbox
- add ::after box that fills when checked
- retain checkbox color if marking complete but switch if task in in Complete section already
- *0.3.2*
- adjusted :root{} css so mouse scrollbar doesn't affect page layout
- put task name and due date in a column flex so left boundary aligns with all text lines and due date
- adjust checkbox/label layout so it's halfway through the top line no matter how tall the line
- *0.3.1*
- fix footer to bottom of screen
- pad .content bottom so it's not covered by footer tabs
- adjust _updateTaskList() to clear task list container and repopulate it, thus cleaning up page creation function
- make _clearContent() more broadly useful
- write reusable function to create headers
- make header sticky
- *0.3.0*
- make sure completed tasks are sorting properly
- make past due items show in red
- make items in completed section not show dueDate
- make "refresh" button to refresh the task list for testing
- create logbook creation function
- make "general" and "logbook" tabs functional
- *0.2.1*
- import date-fns from webpack
- auto-add creationDateTime to tasks
- auto-add completionDateTime to tasks upon toggle
- for sorting incomplete tasks, chain -> dueDate ->  creationDateTime
- for sorting complete tasks, chain -> completionDateTime
- *0.2.0*
- restructure files and integrate npm + JS modules
- fix webpack-dev-server so the overlay doesn't display warnings every refresh
- *0.1.0*
- add "completed" tab
- give different priorities different colors
- by default, sort incomplete tasks project -> isComplete -> priority
- sort complete tasks project -> isComplete
- *0.0.2*
- write code to generate General page
- create function to toggle appearance of completed tasks
- create function to toggle tasks' isComplete property upon clicking the checkbox
- *0.0.1*
- create basic Index page
- add light styling to Index
- write JS to generate task element using task object information