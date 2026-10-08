const MenuRoute = require("./MenuRouteModel");
const { HttpError } = require("../../middleware/errorHandler");

const fields = ({ name, route, parentMenu, sequence }) => ({
  name,
  route,
  parentMenu,
  sequence,
});

const findOrFail = async (id) => {
  const menuRoute = await MenuRoute.findById(id);
  if (!menuRoute) throw new HttpError(404, "Menu route not found");
  return menuRoute;
};

const list = () => MenuRoute.find().sort({ parentMenu: 1, sequence: 1 });

const create = (body) => MenuRoute.create(fields(body));

const update = async (id, body) => {
  const menuRoute = await findOrFail(id);
  menuRoute.set(fields(body));
  return menuRoute.save();
};

const remove = async (id) => {
  const menuRoute = await findOrFail(id);
  await menuRoute.deleteOne();
};

module.exports = { list, create, update, remove };
