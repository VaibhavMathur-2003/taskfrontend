import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Select, MenuItem, FormControl } from "@mui/material";

function trimText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

const baseurl = process.env.REACT_APP_BASE_URL

function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDifficulty, setNewTaskDifficulty] = useState("Low");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    axios
      .get(`${baseurl}/api/tasks`)
      .then((res) => setTasks(res.data))
      .catch((err) => console.error(err));
  }, []);

  const addTask = () => {
    axios
      .post(`${baseurl}/api/tasks`, {
        task: newTask,
        description: newTaskDescription,
        completed: false,
        difficulty: newTaskDifficulty,
      })
      .then((res) => {
        setTasks([...tasks, res.data]);
        setNewTask("");
        setNewTaskDescription("");
      })
      .catch((err) => console.error(err));
  };

  const editTask = (id, updatedTask, updatedDescription, updatedDifficulty) => {
    axios
      .put(`${baseurl}/api/tasks/${id}`, {
        task: updatedTask,
        description: updatedDescription,
        completed: tasks.find((task) => task._id === id).completed,
        difficulty: updatedDifficulty,
      })
      .then((res) => {
        const updatedTasks = tasks.map((task) =>
          task._id === id ? res.data : task
        );
        setTasks(updatedTasks);
      })
      .catch((err) => console.error(err));
  };

  const toggleTaskStatus = (id) => {
    axios
      .put(`${baseurl}/api/tasks/${id}/status`, {
        completed: !tasks.find((task) => task._id === id).completed,
      })
      .then((res) => {
        const updatedTasks = tasks.map((task) =>
          task._id === id ? res.data : task
        );
        setTasks(updatedTasks);
      })
      .catch((err) => console.error(err));
  };

  const deleteTask = (id) => {
    axios
      .delete(`${baseurl}/api/tasks/${id}`)
      .then(() => {
        const updatedTasks = tasks.filter((task) => task._id !== id);
        setTasks(updatedTasks);
      })
      .catch((err) => console.error(err));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const updatedTasks = Array.from(tasks);
    const [removed] = updatedTasks.splice(result.source.index, 1);
    updatedTasks.splice(result.destination.index, 0, removed);

    setTasks(updatedTasks);
  };

  const filteredTasks =
    filter === "all"
      ? tasks
      : tasks.filter((task) => task.difficulty === filter);

  return (
    <div className="container mx-8 my-8 max-w-screen-md text-black md:mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-white">Task Manager</h1>
      <div className="flex mb-4">
        <FormControl className="mr-2">
          <Select
            labelId="filter-label"
            id="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white text-black"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </Select>
        </FormControl>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2 overflow-scroll max-h-[440px] page"
            >
              {filteredTasks.map((task, index) => (
                <Draggable key={task._id} draggableId={task._id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center py-6 px-4 rounded-lg bg-[#FBEAEB] shadow-md flex-col md:flex-row"
                    >
                      <div
                        type="text"
                        className={`border p-2 ${
                          task.completed
                            ? "line-through text-green-500 max-w-32 min-w-24 text-center"
                            : " min-w-24 max-w-32 text-center"
                        }`}
                      >
                        {task.completed ? (
                          <del>{trimText(task.task, 10)}</del>
                        ) : (
                          <div
                            contentEditable
                            onBlur={(e) =>
                              editTask(
                                task._id,
                                trimText(e.target.innerText, 10),
                                task.description,
                                task.difficulty
                              )
                            }
                            suppressContentEditableWarning={true}
                          >
                            <h3>{trimText(task.task, 10)}</h3>
                            
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-grow text-center md:max-w-96 max-w-64 my-4">
                        {task.description && (
                          <div
                            contentEditable
                            onBlur={(e) =>
                              editTask(
                                task._id,
                                task.task,
                                trimText(e.target.innerText, 50),
                                task.difficulty
                              )
                            }
                            suppressContentEditableWarning={true}
                          >
                            {trimText(task.description, 50)}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center">
                        <div>
                          <p className="text-gray-700">{task.difficulty}</p>
                        </div>
                        <div>
                          <Button
                            onClick={() => toggleTaskStatus(task._id)}
                            className="bg-green-500 text-white p-2 ml-4"
                          >
                            Done
                          </Button>
                        </div>
                        <div>
                          <Button
                            onClick={() => deleteTask(task._id)}
                            className="bg-red-500 text-white p-2 ml-4"
                            variant="outlined"
                            color="error"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <div className="flex mt-4 flex-col md:flex-row">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="border p-2 flex-grow mr-2 rounded-lg text-black my-2"
          placeholder="Task"
        />
        <input
          type="text"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          className="border p-2 flex-grow mr-2 rounded-lg text-black my-2"
          placeholder="Description"
        />
        <FormControl className="mr-2">
          <Select
            labelId="new-difficulty-label"
            id="new-difficulty-select"
            value={newTaskDifficulty}
            onChange={(e) => setNewTaskDifficulty(e.target.value)}
            className="bg-white text-black"
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </Select>
        </FormControl>
        <Button
          onClick={addTask}
          className="bg-blue-500 text-white p-2"
          variant="contained"
        >
          Add Task
        </Button>
      </div>
    </div>
  );
}

export default Home;
