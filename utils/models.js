const projects = require("../data/Projects");
const tasks = require("../data/Tasks");
const status = require("../data/Status");

const Model = {
  getRelatedStatus: s => status.find(sta => sta.id === s).text,
  getRelatedTasks: project_id =>
    tasks
      .filter(task => task.project === project_id)
      .map(task => {
        const copy_task = {
          ...task,
          status: Model.getRelatedStatus(task.status)
        };
        delete copy_task["project"];
        return copy_task;
      }),
  getRelatedProject: project_id => {
    const project = projects.find(project => project.id === project_id);
    return { ...project, status: Model.getRelatedStatus(project.status) };
  },
  getRelatedData: (data, option = "tasks") => ({
    ...data,
    status: Model.getRelatedStatus(data.status),
    [option]:
      option === "tasks"
        ? Model.getRelatedTasks(data.id)
        : Model.getRelatedProject(data.project)
  })
};

module.exports = Model;
