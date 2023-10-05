/** @format */

import { SquaresPlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import { Board, Id, Tasks } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import ContentCard from "./ContentCard";

/** @format */
interface Props {
  board: Board;
  deleteBoard: (id: Id) => void;
  updateBoard: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
  tasks: Tasks[];
}
function BoardContainer(props: Props) {
  const {
    board,
    deleteBoard,
    updateBoard,
    createTask,
    tasks,
    deleteTask,
    updateTask,
  } = props;
  const [editMode, setEditMode] = useState(false);
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: board.id,
    data: {
      type: "Board",
      board,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="  bg-primary
        opacity-90
        border-2
        border-sky-400
        w-[450px]
        h-[600px]
        max-h-[500px]
        rounded-md
        flex
        flex-col
    "
      />
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
  bg-primary
  w-[450px]
  h-[500px]
  max-h-[500px]
  rounded-md
  flex
  flex-col
  ">
      {/* Board Title */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="
      bg-secondary
      text-md
      h-[45px]
      max-h-[650px]
      rounded-lg
      p-2
      font-bold
      rounded-b-none
      border-4 border-primary
      items-center
      justify-between
      flex
      shadow-sm
      ">
        <div className="flex gap-2">
          <div
            className="flex justify-center 
        items-center
        bg-primary
        px-2
        py-1
        text-sm 
        rounded-full
      ">
            0
          </div>
          {!editMode && board.title}
          {editMode && (
            <input
              type="text"
              className="bg-black
            focus:border-ActionColor
            outline-none 
            px-2"
              value={board.title}
              onChange={(e) => updateBoard(board.id, e.target.value)}
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.shiftKey) {
                  setEditMode(false);
                }
              }}
            />
          )}
        </div>
        <button
          onClick={() => deleteBoard(board.id)}
          className="flex gap-2
        hover:bg-ActionColor
        px-1 py-2 rounded">
          <TrashIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Board Content */}
      <div className="flex flex-col flex-grow gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <ContentCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      {/* Board Footer */}
      <button
        onClick={() => {
          createTask(board.id);
        }}
        className="flex gap-4 items-center p-4 justify-center hover:text-yellow-200 bg-transparent">
        <SquaresPlusIcon className="w-8 h-8 stroke-transparent items-center bg-transparent" />
        Add Schedule
      </button>
    </div>
  );
}

export default BoardContainer;
