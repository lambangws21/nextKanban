/** @format */

import { CheckIcon } from "@heroicons/react/20/solid";
import { Id, Tasks } from "../types";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/** @format */
interface Props {
  task: Tasks;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

function ContentCard({ task, deleteTask, updateTask }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-secondary p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-sky-400 cursor-grap relative"
      />
    );
  }
  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-secondary p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-ActionColor cursor-grap relative">
        <textarea
          className="h-[90%]
        w-full 
        bg-transparent
        resize-none
        text-white
        focus:outline-none
        "
          value={task.content}
          autoFocus
          placeholder="Edit here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              toggleEditMode();
            }
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className="bg-secondary p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-ActionColor cursor-grap relative task"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}>
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>

      {mouseIsOver && (
        <button
          onClick={() => {
            deleteTask(task.id);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary p-2  hover:bg-ActionColor hover:stroke-white  rounded-full stroke-white opacity-60 hover:opacity-100">
          <CheckIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default ContentCard;
