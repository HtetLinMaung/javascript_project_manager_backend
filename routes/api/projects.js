const express = require("express");
const router = express.Router();
const moment = require("moment");
const uuid = require("uuid");

let projects = require("../../data/Projects");

const { getRelatedData } = require("../../utils/models");

router.get("/", (req, res) => {
  res.json(projects.map(project => getRelatedData(project)));
});

router.get("/:id", (req, res) => {
  const project = projects.find(
    project => project.id === parseInt(req.params.id)
  );

  if (!project)
    return res
      .status(404)
      .json({ msg: `No project with the id of ${req.params.id}` });

  res.json(getRelatedData(project));
});

router.post("/", (req, res) => {
  const { project_name, descriptions, status } = req.body;

  if (!project_name)
    return res.status(400).json({ msg: "Please inclue project's name" });

  const new_project = {
    id: uuid.v4(),
    project_name,
    descriptions,
    status: !status ? 4 : status,
    pub_date: moment().format("LLLL")
  };

  projects.push(new_project);

  res.json(getRelatedData(new_project));
});

router.put("/:id", (req, res) => {
  const { project_name, descriptions, status } = req.body;

  for (const project of projects) {
    if (project.id === parseInt(req.params.id)) {
      project.project_name = project_name || project.project_name;
      project.descriptions = descriptions || project.descriptions;
      project.status = status || project.status;
      project.updated_at = moment().format("LLLL");

      return res.json(getRelatedData(project));
    }
  }

  res.status(400).json({ msg: `No project with the id of ${req.params.id}` });
});

router.delete("/:id", (req, res) => {
  const project = projects.find(
    project => project.id === parseInt(req.params.id)
  );

  if (project) {
    projects = projects.filter(
      project => project.id !== parseInt(req.params.id)
    );
    res.json(getRelatedData(project));
  } else {
    res.status(400).json({ msg: `No project with id of ${req.params.id}` });
  }
});

module.exports = router;
