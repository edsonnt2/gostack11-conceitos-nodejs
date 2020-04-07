const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");
const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid repository ID" });
  }

  return next();
}

app.use("/repositories/:id", validateProjectId);
app.use("/repositories/:id/like", validateProjectId);

app.get("/repositories", (req, res) => {
  res.json(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  const arrayTechs = techs.split(",").map((tech) => tech.trim());

  const repository = {
    id: uuid(),
    title,
    url,
    techs: [...arrayTechs],
    likes: 0,
  };

  repositories.push(repository);

  return res.json(repository);
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;

  const repoIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repoIndex < 0)
    return res.status(400).json({ error: "Repository not found !" });

  if (req.body.likes) return res.json({ likes: repositories[repoIndex].likes });

  const arrayTechs = techs.split(",").map((tech) => tech.trim());

  repository = {
    title,
    url,
    techs: [...arrayTechs],
  };
  repositories[repoIndex] = { ...repositories[repoIndex], ...repository };

  return res.json(repositories[repoIndex]);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repoIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repoIndex < 0)
    return res.status(400).json({ error: "Repository not found !" });

  repositories.splice(repoIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;

  const repoIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repoIndex < 0)
    return res.status(400).json({ error: "Repository not found !" });

  const likes = repositories[repoIndex].likes + 1;

  repositories[repoIndex] = {
    ...repositories[repoIndex],
    likes,
  };

  return res.json({ likes });
});

module.exports = app;
