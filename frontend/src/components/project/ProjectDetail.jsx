import { useState, useEffect, memo } from "react";
import { deleteProject } from "../../api/projectApi";
import useTaskStore from "../../store/taskStore";
import TaskCard from "../task/TaskCard";
import ProjectForm from './ProjectForm';
import TagBadge from "../common/TagBadge";
import TaskDetail from "../task/TaskDetail";
import TaskForm from "../task/TaskForm";
import { updateTask } from "../../api/taskApi";

const ProjectDetail = ({onUpdate}) => {
    const selectedProject = useTaskStore((state) => state.selectedProject);
    const setSelectedProject = useTaskStore((state) => state.setSelectedProject);
    const selectedTask = useTaskStore((state) => state.selectedTask);
    const setSelectedTask = useTaskStore((state) => state.setSelectedTask);
    const { tasks, setTasksAndSync } = useTaskStore();
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingTask, setIsEditingTask] = useState(false);
    const [isCreatingTask, setIsCreatingTask] = useState(false);
    const [showAddTask, setShowAddTask] = useState(false);

    useEffect(() => {
        setSelectedTask(null);
    }, [selectedProject?.id])

    if(!selectedProject){
        return (
            <div className="flex items-center justify-center h-full text-gray-400">
                プロジェクトを選択してください
            </div>
        )
    }

    const handleDelete = async () => {
        if(!window.confirm('削除しますか？')) return
        try{
            await deleteProject(selectedProject.id);
            setSelectedProject(null)
            onUpdate();
        }catch(err){
            console.error(err);
        }
    }

    const handleDetachTask = async (task) => {
        if(!window.confirm(`「${task.name}」をプロジェクトから切り離しますか？\nタスク自体は削除されません`)) return
        try{
            await updateTask(task.id, {
                name: task.name,
                deadline: task.deadline,
                memo: task.memo,
                tagId: task.tagId,
                projectId: null,
            })
            onUpdate();
        }catch(err){
            console.error(err);
        }
    }

    const handleAddTask = async (task) => {
        try{
            await updateTask(task.id, {
                name: task.name,
                deadline: task.deadline,
                memo: task.memo,
                tagId: task.tagId,
                projectId: selectedProject.id,
            })
            setShowAddTask(false);
            onUpdate();
        }catch(err){
            console.error(err);
        }
    }

    const unassignedTasks = tasks.filter(
        (t) => !t.projectId && !selectedProject.tasks?.some((pt) => pt.id === t.id)
    )

    if(isEditing){
        return (
            <ProjectForm project={selectedProject}
                onClose={() => setIsEditing(false)}
                onSave={() => {setIsEditing(false); onUpdate()}}
            />
        )
    }

    if(isEditingTask && selectedTask){
        return (
            <TaskForm
                task={selectedTask} onClose={() => setIsEditingTask(false)} 
                onSave={() => {setIsEditingTask(false); onUpdate()}}
            />
        )
    }

    if(isCreatingTask){
        return (
            <TaskForm initialProjectId={selectedProject.id}
                onClose={() => setIsCreatingTask(false)}
                onSave={() => {setIsCreatingTask(false); onUpdate()}}
            />
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 overflow-auto">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">{selectedProject.name}</h2>
                <span className="text-blue-500 font-medium">{selectedProject.progress}%</span>
            </div>

            <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{width: `${selectedProject.progress}%`}}
                />
            </div>

            {selectedProject.deadline && (
                <div>
                    <p className="text-sm text-gray-500">期日</p>
                    <p className="text-gray-800">{selectedProject.deadline}</p>
                </div>
            )}

            {selectedProject.memo && (
                <div>
                    <p className="text-sm text-gray-500">メモ</p>
                    <p className="text-gray-800 whitespace-pre-wrap">{selectedProject.memo}</p>
                </div>
            )}

            <div>
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-500">タスク一覧</p>
                    <div className="flex gap-2">
                        <button onClick={() => setShowAddTask(!showAddTask)} 
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-600
                            rounded hover:bg-gray-200 transition-colors"
                        >
                            + 既存タスクを追加
                        </button>

                        <button onClick={() => setIsCreatingTask(true)}
                            className="text-xs px-2 py-1 bg-blue-500 text-white 
                            rounded hover:bg-blue-600 transition-colors"
                        >
                            + 新規タスク作成
                        </button>
                    </div>
                </div>

                {showAddTask && (
                    <div className="mb-2 border rounded-lg p-2 bg-gray-50">
                        <p className="text-xs text-gray-500 mb-2">
                            追加するタスクを選択
                        </p>
                        {unassignedTasks.length === 0 ? (
                            <p className="text-xs text-gray-400">
                                追加できるタスクがありません
                            </p>
                        ) : (
                            <div className="space-y-1 max-h-40 overflow-auto">
                                {unassignedTasks.map((task) => (
                                    <div key={task.id}
                                        onClick={() => handleAddTask(task)}
                                        className="px-3 py-2 text-sm bg-white border 
                                            rounded cursor-pointer hover:bg-blue-50
                                            hover:border-blue-300 transition-colors"
                                    >
                                        {task.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {selectedProject.tasks?.length === 0 || !selectedProject.tasks ? (
                    <p className="text-gray-400 text-sm">タスクがありません</p>
                ) : (
                    <div className="space-y-2">
                        {selectedProject.tasks.map((task) => (
                            <div key={task.id} className="flex items-center gap-2">
                                <div className="flex-1">
                                    <TaskCard task={task} onUpdate={onUpdate} />
                                </div>

                                <button onClick={() => handleDetachTask(task)}
                                    className="text-xs px-2 py-1 bg-red-100 text-red-500 
                                        rounded hover:bg-red-200 transition-colors flex-shrink-0"
                                >
                                    切り離す
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedTask && !isEditingTask && (
                <div className="border-t pt-4">
                    <TaskDetail onUpdate={onUpdate} onEdit={() => setIsEditingTask(true)} />
                </div>
            )}

            <div className="flex gap-2 pt-4">
                <button onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    編集
                </button>
                <button onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                    削除
                </button>
            </div>
        </div>
    )
}

export default ProjectDetail;