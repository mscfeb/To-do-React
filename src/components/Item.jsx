import React from "react";
import { FaXmark } from "react-icons/fa6";

const Item = ({ task, todos, setTodos }) => {
  const handleComplete = () => {
    const updatedTodos = todos.map((t) =>
      t.id === task.id ? { ...t, status: "Completed" } : t
    );
    setTodos(updatedTodos);
  };

  const handleDelete = () => {
    const filteredTodos = todos.filter((t) => t.id !== task.id);
    setTodos(filteredTodos);
  };

  return (
    <div className="w-96 bg-slate-100 text-black p-4 rounded-xl hover:border-purple-800 hover:border-2 flex justify-between items-center">
      {/* Left: Radio + Task Text */}
      <div className="flex items-center space-x-2 w-[50%]">
        <label className="w-5 h-5 rounded-full border-2 border-purple-800 flex items-center justify-center cursor-pointer">
          <input
            type="radio"
            name={`task-${task.id}`}
            className="peer hidden"
            onChange={handleComplete}
            checked={task.status === "Completed"}
          />
          <div className="w-2.5 h-2.5 bg-purple-800 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200"></div>
        </label>
        <span
          className={`${
            task.status === "Completed" ? "line-through text-gray-500" : ""
          }`}
        >
          {task.title}
        </span>
      </div>

      {/* Right: Delete Button */}
      <span
        className="text-slate-800 font-extrabold text-2xl w-8 text-center cursor-pointer"
        onClick={handleDelete}
        title="Delete Task"
      >
        <FaXmark />
      </span>
    </div>
  );
};

export default Item;
