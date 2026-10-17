# Users, Roles & Role-Permissions

Adapted from the `tgp` ERP. Follows the module layout in [file_tree_structure.md](./file_tree_structure.md).

## 1. How tgp works

| Concept | tgp model | Purpose |
|---|---|---|
| Role | `{ name }` | A named group of users (Administrator, Staff, ...). |
| MenuRoute | `{ name, route, parent_menu, sequence }` | Catalog of every screen that can be permissioned (seeded from `menu.json`). |
| RolePermission | `{ role, permissions: [{ name, route, access[], parent_menu }] }` | One doc per role: which actions the role may do on which route. |
| User | `username, password, name, role, permissions[], expires_at, deleted, logs[]` | Account. Holds a **copy** of its role's permissions. |

Access actions: `View, Add, Update, Delete, Print, Approve, Cancel, Open, Verify, Audit, ...`

Flows in tgp:
- **Login** `POST /users/login`: validate -> find user (not deleted, not expired) -> `bcrypt.compare` -> sign JWT `{id, username, name, role}` -> return `Bearer` token + permissions.
- **Permission update**: checkbox toggle upserts the route entry in the role's RolePermission doc, then `User.updateMany({role}, {permissions})` syncs every user of that role.
- **Role duplicate**: copy a role's permissions to a new role name.
- **Client**: hides menu items unless `permissions` has `View` for that route.

tgp weaknesses we deliberately do **not** copy: routes not guarded server-side, password hash returned from `/auth`, hardcoded super user by username, role as free string, secret in a keys file, no error handling in `.then` chains, denormalized permission copies.

## 2. Data models (this project)

```
Role            { name (unique), description, isSuperAdmin: Boolean, timestamps }
MenuRoute       { name, route (unique), parentMenu, sequence }
RolePermission  { role: ObjectId(Role, unique), permissions: [{ route, access: [String] }] }
User            { name, username (unique), password (select:false), role: ObjectId(Role),
                  isActive, expiresAt, deletedAt, timestamps }
```

- Users reference the role by `ObjectId`.
- No permission copy on the user: `authorize` reads RolePermission, so there is no `updateMany` sync.
- Super admin is a role flag (`isSuperAdmin`), not a username check.
- Access constants live in one shared file: `ACCESS = { VIEW, ADD, UPDATE, DELETE, PRINT, APPROVE, CANCEL, ... }`.

## 3. Endpoints

All except login require `authenticate`; each also requires `authorize(route, access)`.

| Method | Path | Access | Notes |
|---|---|---|---|
| POST | `/api/users/login` | public | returns `{ token, user, permissions }` |
| GET | `/api/users/me` | any logged in | current user + permissions |
| GET | `/api/users` | View | paginated, excludes deleted |
| POST | `/api/users` | Add | hash password |
| PUT | `/api/users/:id` | Update | password optional |
| DELETE | `/api/users/:id` | Delete | soft delete (`deletedAt`) |
| GET/POST/PUT/DELETE | `/api/roles` | per action | `POST /:id/duplicate` copies permissions |
| GET | `/api/menu-routes` | View | grouped by `parentMenu` |
| GET | `/api/role-permissions/:roleId` | View | |
| PUT | `/api/role-permissions/:roleId` | Update | replace or toggle one route's `access[]` |

## 4. Login flow

1. Validate `username` and `password` are present.
2. Find user with `deletedAt: null`, `isActive`, and `expiresAt` empty or in the future; select `+password`.
3. `bcrypt.compare`; on failure return a generic "Invalid credentials" (do not reveal which field).
4. Sign JWT `{ id, role }` with secret and expiry from env.
5. Respond with token, user (no password) and the role's permissions.

## 5. Authorization flow

- `authenticate`: read `Authorization: Bearer`, verify JWT, load user, attach `req.user`.
- `authorize(route, access)`: allow if role `isSuperAdmin`, else find RolePermission for `req.user.role` and require the route entry's `access` to include the action; otherwise 403.
- Client: `authStore` keeps token + permissions; `hasAccess(route, action)` drives menus and buttons (UI only, the server is the real gate).

## 6. Mapping to this repo (server implemented)

```
server/
  config/        db.js, constants.js (ACCESS, JWT_SECRET, JWT_EXPIRES_IN), seed.js
  middleware/    authenticate.js, authorize.js, validate.js, errorHandler.js
  modules/
    role/            RoleModel, RoleValidations, RoleService, RoleController, RoleRoutes
    menuRoute/       MenuRouteModel, ... (same five files)
    rolePermission/  RolePermissionModel, ... (same five files)
    user/            UserModel, ... (same five files, includes login)
  server.js      auto-mounts modules/<camelCase>/*Routes.js at /api/<kebab-case>s
client/src/      (not built yet)
  store/authStore.js
  features/auth/            pages/LoginPage.jsx, authApi.js
  features/roles/ users/ permissions/   management screens
```

Notes:
- Routes -> `validate(fn)` + `authorize(route, access)` -> Controller (thin) -> Service (logic).
- Services throw `HttpError`; Express 5 forwards async errors to `errorHandler`.
- Permission route keys match the mount path: `/users`, `/roles`, `/role-permissions`, `/menu-routes`.
- Extra endpoint: `PUT /api/role-permissions/:roleId/route` sets one route's access list (checkbox toggle).
- Only a super admin can assign/modify/delete super admin users; nobody can delete their own account.
- Run: `npm run seed` (creates Super Admin role, admin user, menu routes), then `npm start` / `npm run dev`.
  Env (`server/.env.local`): `JWT_SECRET`, `JWT_EXPIRES_IN`, optional `SEED_ADMIN_USERNAME`, `SEED_ADMIN_PASSWORD`.

## 7. Build order

1. Deps: `bcryptjs`, `jsonwebtoken`; env vars `JWT_SECRET`, `JWT_EXPIRES_IN`. (done)
2. `ACCESS` constants + `errorHandler`. (done)
3. Role, MenuRoute, RolePermission modules. (done)
4. User module + login. (done)
5. `authenticate` / `authorize` middleware; protect routes. (done)
6. Seed: super-admin role, first user, menu routes. (done)
7. Client: authStore, login page, then management screens.
