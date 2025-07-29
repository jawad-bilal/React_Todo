import React, { useState, useEffect } from "react";
import "./App.css";

// fetch api starts
// 🔹 API functions
const fetchTodosAPI = (setTodo) => {
  fetch("http://localhost:5000/api/todos")
    .then((res) => res.json())
    .then((data) => {
      const mapped = data.map((item) => ({
        id: item._id,
        text: item.title,
        done: item.completed,
      }));
      setTodo(mapped);
    })
    .catch((err) => console.error(err));
};

const createTodoAPI = (todo) => {
  fetch("http://localhost:5000/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: todo.text }),
  }).catch((err) => console.error(err));
};

const updateTodoAPI = (todo) => {
  fetch(`http://localhost:5000/api/todos/${todo.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: todo.text, completed: todo.done }),
  }).catch((err) => console.error(err));
};

const deleteTodoAPI = (id) => {
  fetch(`http://localhost:5000/api/todos/${id}`, { method: "DELETE" }).catch(
    (err) => console.error(err)
  );
};

// fetch api ends
function Todo() {
  const [todo, setTodo] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTodosAPI(setTodo);
  }, []);

  const Change = (e) => setInput(e.target.value);
  const Submit = (e) => {
    e.preventDefault();
    if (!input) return;
    if (editId !== null) {
      const updatetodo = todo.map((todo) =>
        todo.id === editId ? { ...todo, text: input } : todo
      );
      setTodo(updatetodo);
      const updatedItem = updatetodo.find((t) => t.id === editId);
      updateTodoAPI(updatedItem);
      setEditId(null);
    } else {
      const newTodo = {
        id: Date.now(),
        text: input,
        done: false,
      };
      setTodo([...todo, newTodo]);
      createTodoAPI(newTodo);
    }
    setInput("");
  };
  const Delete = (id) => {
    setTodo(todo.filter((todo) => todo.id !== id));
    deleteTodoAPI(id);
  };
  const DoneAndUndo = (id) => {
    const updatedTodos = todo.map((todo) =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    );
    setTodo(updatedTodos);
    const toggledItem = updatedTodos.find((t) => t.id === id);
    updateTodoAPI(toggledItem);
  };
  const Edit = (id) => {
    const toEdit = todo.find((todo) => todo.id === id);
    setInput(toEdit.text);
    setEditId(id);
  };
  return (
    <div className="App">
      <h1>React Todo List</h1>
      <form onSubmit={Submit}>
        <input
          type="text"
          value={input}
          onChange={Change}
          placeholder="Enter a task..."
        />
        <button type="submit">{editId !== null ? "Update" : "Add"}</button>
      </form>
      <ol>
        {todo.map((todo) => (
          <li key={todo.id}>
            <span
              style={{
                textDecoration: todo.done ? "line-through" : "none",
              }}
            >
              {todo.text}
            </span>
            <div>
              <button onClick={() => DoneAndUndo(todo.id)}>
                {todo.done ? "Undo" : "Done"}
              </button>
              <button onClick={() => Edit(todo.id)}>Edit</button>
              <button onClick={() => Delete(todo.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
export default Todo;
