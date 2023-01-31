import * as model from './model';
import * as view from './view';
import * as controller from './controller';

const setup = (() => {
  controller.repopulateDataFromDatabase().then(() => {
    if (!model.projectArray.length > 0) {
      controller.addNewProject('general', { id: 'tempId' });
    }
    console.log(model.projectArray[0].id);
    view.createProjectPage();
    const generalTab = document.querySelector('#tab-general');
    generalTab.addEventListener('click', view.createProjectPage);
    const projectsTab = document.querySelector('#tab-projects');
    projectsTab.addEventListener('click', view.createAllProjectsPage);
    const logbookTab = document.querySelector('#tab-logbook');
    logbookTab.addEventListener('click', view.createIncompletePage);
  });
})();

// const setup = (async () => {
//   await controller.repopulateDataFromDatabase();
//   model.projectArray[0] = model.Project('general', { id: 'tempId' });

//   console.log(model.projectArray[0].id);
//   view.createProjectPage();
//   const generalTab = document.querySelector('#tab-general');
//   generalTab.addEventListener('click', view.createProjectPage);
//   const projectsTab = document.querySelector('#tab-projects');
//   projectsTab.addEventListener('click', view.createAllProjectsPage);
//   const logbookTab = document.querySelector('#tab-logbook');
//   logbookTab.addEventListener('click', view.createIncompletePage);
//   console.log(model.projectArray[0].id);
// })();
