# ToDo Web App
## A website for keeping track of what you need to do
If you need a free place to keep track of your to-do list, look no further.

#### TO-DO NEXT
- add New Task button

#### TO-DO LATER
##### Features
- add button that goes to task details page
- save everything in localStorage
- read localStorage upon loading page
- add lastEdited property to project objects and, by default, sort projects page accordingly
- add options button for project pages
- add options button for Projects page
- add "delete all" button
- add "add sample tasks" button
- add "edit project name" option (but not from clicking title on Projects page as that should bring you to specific project page)
##### Behavior
- should tasks get auto-added to taskArray?
- fix footer so it isn't too high if you switch to a page while the address bar is minimized
- make header remain in place even when focusing on name change input
- make it so General is not an option on Projects page
- should each project have tasksComplete and tasksIncomplete properties so it doesn't have to constantly run the sorting algorithm?
- make empty projects still show up in Projects
##### Style
- decide on style
##### Other
##### Maybe
- write a function to make adding testing projects and tasks faster

#### DONE
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