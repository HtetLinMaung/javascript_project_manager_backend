const express = require("express");
const router = express.Router();
const moment = require("moment");
const uuid = require("uuid");

let tasks = require("../../data/Tasks");

const { getRelatedData } = require("../../utils/models");

router.get("/", (req, res) => {
  res.json(tasks.map(task => getRelatedData(task, "project")));
});

router.get("/:id", (req, res) => {
  const task = tasks.find(task => task.id == req.params.id);

  if (task) {
    res.json(getRelatedData(task, "project"));
  } else {
    res.status(400).json({ msg: `No task with the id of ${req.params.id}` });
  }
});

router.post("/", (req, res) => {
  const { task_name, descriptions, status, project } = req.body;
  let msg = "Please inclue";

  if (!task_name || !project) {
    if (!task_name) {
      msg = `${msg} task's name`;
    } else if (!project) {
      msg = `${msg} project's id`;
    }
    return res.status(400).json({ msg });
  }

  const new_task = {
    id: uuid.v4(),
    task_name,
    descriptions,
    status: status || 4,
    project,
    pub_date: moment().format("LLLL")
  };

  tasks.push(new_task);

  res.json(getRelatedData(new_task, "project"));
});

module.exports = router;
