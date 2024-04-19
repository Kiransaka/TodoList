const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "todoList.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(5000, () => {
      console.log("Server Running at http://localhost:5000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

app.get("/todos/", async (request, response) => {
  const getTodoQuery = `
    SELECT
      *
    FROM
      todo
    `;
  const todoArray = await db.all(getTodoQuery);

  response.send(todoArray);
});

app.post("/todos/", async (request, response) => {
  const { id, todo } = request.body;
  const status = 0;
  const todoQuery = `
  INSERT INTO
    todo (id, todo, status)
  VALUES
    ('${id}', '${todo}', ${status});`;
  await db.run(todoQuery);
});

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;

  const todoDetails = request.body;
  const { status } = todoDetails;

  let statuss = !status;
  if (statuss) {
    statuss = 1;
  } else {
    statuss = 0;
  }

  const updateTodoQuery = `
    UPDATE
      todo
    SET
        status=${statuss}
    WHERE
      id = '${todoId}';`;
  await db.run(updateTodoQuery);
});

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodoQuery = `
    DELETE FROM
      todo
    WHERE
      id = '${todoId}';`;
  await db.run(deleteTodoQuery);
});
