const service = require("./MenuRouteService");

const list = async (req, res) => res.json(await service.list());

const create = async (req, res) =>
  res.status(201).json(await service.create(req.body));

const update = async (req, res) =>
  res.json(await service.update(req.params.id, req.body));

const remove = async (req, res) => {
  await service.remove(req.params.id);
  res.status(204).end();
};

module.exports = { list, create, update, remove };
