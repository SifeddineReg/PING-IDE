import React, { useState } from 'react';
import './Backlog.css';
import { Navbar } from './navbar/navbar';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

type TaskState = {
    todo: string[];
    doing: string[];
    done: string[];
};

export const Backlog: React.FC = () => {
    const [tasks, setTasks] = useState<TaskState>({
        todo: ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'],
        doing: [],
        done: []
    });

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
                                                <Draggable key={task} draggableId={task} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            className="task"
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            {task}
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
