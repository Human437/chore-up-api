const knex = require("knex");
const app = require("./app");
const { NODE_ENV } = require("./config");

const { PORT, DATABASE_URL } = require("./config");

const connectionObject =
  NODE_ENV === "development"
    ? { connectionString: DATABASE_URL }
    : {
        connectionString: DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      };

const db = knex({
  client: "pg",
  connection: connectionObject,
});

app.set("db", db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
