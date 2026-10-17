react-express-admin/
├── client/ # 💻 React Frontend (Feature-Driven)
│ ├── src/
│ │ ├── components/ ----------------> Shared core components (Layouts, Sidebar, Buttons)
│ │ ├── features/ ------------------> ERP Core Business Modules
│ │ │ ├── feature_1/ ---------------> Feature 1 Module
│ │ │ │ ├── components/ ------------> feature-specific UI components (eg. StockTable)
│ │ │ │ ├── pages/ -----------------> Feature screens (eg. StockOverview.js)
│ │ │ │ └── inventoryApi.js --------> Dedicated API fetch calls
│ │ │ ├── feature_2/ ---------------> Feature 2 Module (eg. HR)
│ │ │ └── feature_3/ ---------------> Feature 3 Module (eg. Finance)
│ │ ├── store/ ---------------------> Global Token & Auth State
│ │ │ └── authStore.js  
│ │ ├── App.jsx
│ │ └── main.jsx
│
├── server/ ------------------------> ⚙️ Node.js / Express Backend (Modular)
│ ├── config/ ----------------------> Core configs (db.js, environment setups)
│ ├── middleware/ ------------------> Universal security & error guards
│ ├── modules/ ---------------------> ERP Business Domain Modules
│ │ ├── api_example_1/ -------------> Self-contained API functionality
│ │ │ ├── ApiModel.js  
│ │ │ ├── ApiController.js
│ │ │ ├── ApiService.js # Business logic (queries, hashing, tokens); called by the controller
│ │ │ └── ApiRoutes.js  
│ │ ├── api_example_2/ -------------> Self-contained API functionality
│ │ └── api_example_3/ -------------> Self-contained API functionality
│ ├── server.js --------------------> Mounts all module routes dynamically
│ └── package.json -----------------> Node.js package manifest
└── .github/ -----------------------> GitHub Actions (CI/CD)
