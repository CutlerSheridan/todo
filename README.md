# ToDo Web App
## A website for keeping track of what you need to do
If you need a free place to keep track of your to-do list, look no further.

#### TO-DO NEXT
#### TO-DO LATER
##### Features
- add projects page
- add ability to go to a project's page from projects page
- add ability to click a task name and turn it into a form to change the name of the task
- add New Task button
- add button that goes to task details page
- save everything in localStorage
- read localStorage upon loading page
##### Behavior
- should tasks get auto-added to taskArray?
##### Style
- decide on style
##### Other
##### Maybe

#### DONE
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