const service = require("./RoleService");

const list = async (req, res) => res.json(await service.list());

const get = async (req, res) => res.json(await service.get(req.params.id));

const create = async (req, res) =>
  res.status(201).json(await service.create(req.body));

const update = async (req, res) =>
  res.json(await service.update(req.params.id, req.body));

const remove = async (req, res) => {
  await service.remove(req.params.id);
  res.status(204).end();
};

const duplicate = async (req, res) =>
  res.status(201).json(await service.duplicate(req.params.id, req.body));

module.exports = { list, get, create, update, remove, duplicate };
