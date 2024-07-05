import React, { useState, useEffect } from 'react';
import './Backlog.css';
import { Navbar } from './navbar/navbar';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import data from '../assets/data.json';

type Task = {
    name: string;
    assignee: string;
    assignor: string;
    state: string;
};

type TaskState = {
    todo: Task[];
    doing: Task[];
    done: Task[];
};

export const Backlog: React.FC = () => {
    const [tasks, setTasks] = useState<TaskState>({
        todo: [],
        doing: [],
        done: []
    });

    // Fetch data from data.json on component mount
    useEffect(() => {
        // Assuming data.json has an object with todo, doing, done arrays
        setTasks({
            todo: data.tasks,
            doing: [],
            done: []
        });
    }, []);

    function map_id_to_name(id: number) {
        return data.users.find((user: any) => user.id === id)?.name;
    }

    const totalTasks = tasks.todo.length + tasks.doing.length + tasks.done.length;
    const progress = totalTasks > 0 ? (tasks.done.length / totalTasks) * 100 : 0;

    const onDragEnd = (result: any) => {
        const { source, destination } = result;

        if (!destination) return;

        const sourceColumn = Array.from(tasks[source.droppableId as keyof TaskState]);
        const destColumn = Array.from(tasks[destination.droppableId as keyof TaskState]);
        const [removed] = sourceColumn.splice(source.index, 1);
        destColumn.splice(destination.index, 0, removed);

        setTasks((prevTasks) => ({
            ...prevTasks,
            [source.droppableId]: sourceColumn,
            [destination.droppableId]: destColumn
        }));
    };

    function empty() { }

    return (
        <>
            <Navbar open_file={empty} open_folder={empty} />
            <div className="backlog-container">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="columns">
                        {['todo', 'doing', 'done'].map((columnId) => (
                            <Droppable droppableId={columnId} key={columnId}>
                                {(provided) => (
                                    <div
                                        className={`column ${columnId}`}
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        <h2>{columnId.charAt(0).toUpperCase() + columnId.slice(1)}</h2>
                                        <div className='tasks'>
                                            {tasks[columnId as keyof TaskState].map((task, index) => (
                                                <Draggable key={task.name} draggableId={task.name} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            className="task"
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <p>Name: {task.name}</p>
                                                            <p>Assignee: {map_id_to_name(parseInt(task.assignee))}</p>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="progress-text">
                    {Math.round(progress)}% completed
                </div>
            </div>
        </>
    );
};