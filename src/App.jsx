import { useState, useEffect } from "react";
import "./App.css";
import { FaTrash, FaPlus, FaUndo, FaRedo } from "react-icons/fa";
import Item from "./components/Item";

function App() {
  const buttons = ["Active", "Completed", "All todos"];
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState("All todos");

  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleInput = () => {
    const input = prompt("Enter the task");
    if (!input) return;

    const task = {
      id: Date.now(),
      title: input,
      status: "Active",
    };

    pushUndo();
    setTodos((prev) => [...prev, task]);
    setRedoStack([]);
  };

  const handleDelete = () => {
    pushUndo();

    if (filter === "Active") {
      setTodos((prev) => prev.filter((task) => task.status !== "Active"));
    } else if (filter === "Completed") {
      setTodos((prev) => prev.filter((task) => task.status !== "Completed"));
    } else {
      setTodos([]);
    }

    setRedoStack([]);
  };

  const pushUndo = () => {
    setUndoStack((prev) => [...prev, todos]);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack((prevStack) => prevStack.slice(0, -1));
    setRedoStack((redo) => [...redo, todos]);
    setTodos(prev);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prevStack) => prevStack.slice(0, -1));
    setUndoStack((undo) => [...undo, todos]);
    setTodos(next);
  };

  const filteredTodos = todos.filter((task) => {
    if (filter === "Active") return task.status === "Active";
    if (filter === "Completed") return task.status === "Completed";
    return true;
  });

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-6 bg-slate-100">
      <div className="flex flex-col items-center space-y-6 w-full max-w-xl">

        {/* Action Buttons */}
        <div className="flex justify-center flex-wrap items-center gap-3 w-full">
          <button
            className="w-12 h-12 rounded-full bg-purple-800 flex items-center justify-center"
            onClick={handleInput}
          >
            <FaPlus className="w-6 h-6 text-white" />
          </button>

          {undoStack.length > 0 && (
            <button
              onClick={handleUndo}
              className="w-12 h-12 rounded-full bg-purple-800 flex items-center justify-center"
            >
              <FaUndo className="w-6 h-6 text-white" />
            </button>
          )}

          {redoStack.length > 0 && (
            <button
              onClick={handleRedo}
              className="w-12 h-12 rounded-full bg-purple-800 flex items-center justify-center"
            >
              <FaRedo className="w-6 h-6 text-white" />
            </button>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-3 w-full">
          {buttons.map((b) => (
            <button
              key={b}
              onClick={() => setFilter(b)}
              className={`p-2 rounded-3xl text-sm sm:text-base px-4 sm:px-6 
                ${
                  filter === b
                    ? "bg-purple-800 text-white"
                    : "bg-slate-100 text-purple-800 hover:bg-purple-800 hover:text-slate-100"
                }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="flex flex-col gap-4 w-full items-center min-h-[150px]">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((task) => (
              <Item
                key={task.id}
                task={task}
                todos={todos}
                setTodos={(updated) => {
                  pushUndo();
                  setTodos(updated);
                  setRedoStack([]);
                }}
              />
            ))
          ) : (
            <p className="text-gray-400 text-center">No todos available</p>
          )}
        </div>

        {/* Trash Button */}
        <button
          onClick={handleDelete}
          className="w-12 h-12 rounded-full bg-purple-800 flex items-center justify-center"
        >
          <FaTrash className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}

export default App;
