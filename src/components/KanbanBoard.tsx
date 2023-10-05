/** @format */
"use client";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useMemo, useState } from "react";
import { Board, Id, Tasks } from "../types";
import BoardContainer from "./BoardContainer";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";
import ContentCard from "./ContentCard";

const defaultBoards: Board[] = [
  {
    id: "OK 1",
    title: "OK 1",
  },
  {
    id: "OK 2",
    title: "OK 2",
  },
  {
    id: "OK 3",
    title: "OK 3",
  },
  {
    id: "OK 4",
    title: "OK 4",
  },
  {
    id: "OK 5",
    title: "OK 5",
  },
];
const defaultTasks: Tasks[] = [
  {
    id: "1",
    columnId: "OK 1",
    content: "Laparaskopi Chole/ dr. A ",
  },
  {
    id: "2",
    columnId: "OK 2",
    content: "Total knee Replacement dextracted (TKR) with bone graft",
  },
  {
    id: "3",
    columnId: "OK 3",
    content: "Total Hip Replacement",
  },
  {
    id: "4",
    columnId: "OK 4",
    content: "Eksisi multipel punggung",
  },
  {
    id: "5",
    columnId: "OK 5",
    content: "TURP ",
  },
  {
    id: "6",
    columnId: "Holding",
    content: "aff CDL",
  },
];

function KanbanBoard() {
  const [boards, setBoards] = useState<Board[]>(defaultBoards);
  const boardsId = useMemo(() => boards.map((board) => board.id), [boards]);

  const [tasks, setTasks] = useState<Tasks[]>(defaultTasks);

  const [activeBoard, setActiveBoard] = useState<Board | null>(null);
  const [activeTask, setActiveTask] = useState<Tasks | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
  return (
    <div
      className="
    m-auto
    flex
    min-h-screen
    w-full
    items-center
    oveflow-x-auto
    overflow-y-hidden
    px-[40px]">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}>
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={boardsId}>
              {boards.map((board) => (
                <BoardContainer
                  key={board.id}
                  board={board}
                  deleteBoard={deleteBoard}
                  updateBoard={updateBoard}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === board.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => createNewBoard()}
            className="
     items-center
    flex
    gap-5
      h-[70px]
      w-[70px]
      cursor-pointer
      justify-center
      rounded-full
      bg-primary
      border-2
      border-secondary
      p-2
      hover:ring-2
      ring-ActionColor">
            <PlusIcon className="w-11 h-11 border-2 rounded-full items-center " />
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeBoard && (
              <BoardContainer
                board={activeBoard}
                deleteBoard={deleteBoard}
                updateBoard={updateBoard}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter((task) => task.columnId === activeBoard.id)}
              />
            )}
            {activeTask && (
              <ContentCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
  function createTask(columnId: Id) {
    const newTask: Tasks = {
      id: genereteId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  }
  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });
    setTasks(newTasks); // Memperbarui variabel tasks dengan nilai baru
  }

  function deleteTask(id: Id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks); // Memperbarui variabel tasks dengan nilai baru
  }

  function createNewBoard() {
    const boardToAdd: Board = {
      id: genereteId(),
      title: `Board ${boards.length + 1}`,
    };
    setBoards([...boards, boardToAdd]);
  }
  function deleteBoard(id: Id) {
    const filteredBoards = boards.filter((board) => board.id !== id);
    setBoards(filteredBoards);

    const newTasks = tasks.filter((task) => task.columnId !== id);
    setTasks(newTasks);
  }

  function updateBoard(id: Id, title: string) {
    const newBoards = boards.map((board) => {
      if (board.id !== id) return board;
      return { ...board, title };
    });
    setBoards(newBoards);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Board") {
      setActiveBoard(event.active.data.current.board);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }
  function onDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const activeBoardId = active.id;
    const overBoardId = over.id;
    if (activeBoardId === overBoardId) return;
    setBoards((boards) => {
      const activeBoardIndex = boards.findIndex(
        (board) => board.id === activeBoardId
      );
      const overBoardIndex = boards.findIndex(
        (board) => board.id === overBoardId
      );
      return arrayMove(boards, activeBoardIndex, overBoardIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeBoardId = active.id;
    const overBoardId = over.id;

    if (activeBoardId === overBoardId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    if (!isActiveTask) return;
    // dropping task on board
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === active.id);
        const overIndex = tasks.findIndex((t) => t.id === overBoardId);
        tasks[activeIndex].columnId = tasks[overIndex].columnId;
        return arrayMove(tasks, activeIndex, overIndex - 1);
      });
    }

    const isOverColumn = over.data.current?.type === "Board";
    // dropping board on board
    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeBoardId);
        tasks[activeIndex].columnId = overBoardId;
        console.log("Droppig Over Column", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  function genereteId() {
    return Math.floor(Math.random() * 10001);
  }
}
export default KanbanBoard;
