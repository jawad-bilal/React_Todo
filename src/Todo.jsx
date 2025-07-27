import React, { useState } from "react";
import "./App.css";

function Todo() {
  const [todo, setTodo] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const Change = (e) => setInput(e.target.value);
  const Submit = (e) => {
    e.preventDefault();
    if (!input) return;
    if (editId !== null) {
      const updatetodo = todo.map((todo) =>
        todo.id === editId ? { ...todo, text: input } : todo
      );
      setTodo(updatetodo);
      setEditId(null);
    } else {
      const newTodo = {
        id: Date.now(),
        text: input,
        done: false,
      };
      setTodo([...todo, newTodo]);
    }
    setInput("");
  };
  const Delete = (id) => {
    setTodo(todo.filter((todo) => todo.id !== id));
  };
  const DoneAndUndo = (id) => {
    const updatedTodos = todo.map((todo) =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    );
    setTodo(updatedTodos);
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
          <li
            key={todo.id}
          >
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
