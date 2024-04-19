import "./App.css";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import TodoItems from "./component/TodoItems";

function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");
  useEffect(() => {
    async function getTodos() {
      const res = await fetch("todos");
      const todos = await res.json();

      setTodos(todos);
    }
    getTodos();
  }, []);

  const createNewTodo = async (e) => {
    e.preventDefault();

    if (content.length > 3) {
      const res = await fetch("todos", {
        method: "POST",
        body: JSON.stringify({ todo: content, id: uuidv4() }),
        headers: {
          "content-type": "application/json",
        },
      });
      const newTodo = await res.json();

      setTodos([...todos, newTodo]);
      setContent("");
    }
  };

  return (
    <main className="container">
      <h1 className="title">Todo List</h1>
      <form className="form" onSubmit={createNewTodo}>
        <input
          className="form__input"
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter a new todo"
          required
        />
        <button type="submit">Created Todo</button>
      </form>
      <div className="todos">
        {todos.length > 0 &&
          todos.map((todo) => (
            <TodoItems todo={todo} key={todo.id} setTodos={setTodos} />
          ))}
      </div>
    </main>
  );
}

export default App;
