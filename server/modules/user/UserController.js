const service = require("./UserService");

const login = async (req, res) => res.json(await service.login(req.body));

const me = async (req, res) => res.json(await service.me(req.user));

const list = async (req, res) => res.json(await service.list(req.query));

const get = async (req, res) => res.json(await service.get(req.params.id));

const create = async (req, res) =>
  res.status(201).json(await service.create(req.body, req.user));

const update = async (req, res) =>
  res.json(await service.update(req.params.id, req.body, req.user));

const remove = async (req, res) => {
  await service.remove(req.params.id, req.user);
  res.status(204).end();
};

module.exports = { login, me, list, get, create, update, remove };
