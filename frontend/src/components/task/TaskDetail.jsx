import { useState } from "react";
import { deleteTask,updateTask } from "../../api/taskApi";
import useTaskStore from "../../store/taskStore";
import TagBadge from "../common/TagBadge";
import TaskForm from './TaskForm';

const TaskDetail = ({onUpdate}) => {
    const selectedTask = useTaskStore((state) => state.selectedTask);
    const setSelectedTask = useTaskStore((state) => state.setSelectedTask);
    const [isEditing, setIsEditing] = useState(false);

    if(!selectedTask){
        return (
            <div className="flex items-center justify-center h-full text-gray-400">
                タスクを選択してください
            </div>
        )
    }

    const handleDelete = async () => {
        if(!window.confirm('削除しますか？')) return
        try{
            await deleteTask(selectedTask.id);
            setSelectedTask(null);
            onUpdate();
        }catch(err){
            console.error(err);
        }
    }

    if(isEditing){
        return (
            <TaskForm task={selectedTask}
                onClose={() => setIsEditing(false)}
                onSave={() => {
                    console.log('TaskForm onSave')
                    setIsEditing(false);
                    onUpdate();
                }}
            />
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">{selectedTask.name}</h2>
                <TagBadge tagName={selectedTask.tagName} 
                    taskId={selectedTask.id}
                    task={selectedTask}
                    onUpdate={onUpdate}
                />
            </div>

            {selectedTask.deadline && (
                <div>
                    <p className="text-sm text-gray-500">期日</p>
                    <p className="text-gray-800">{selectedTask.deadline}</p>
                </div>
            )}

            {selectedTask.memo && (
                <div>
                    <p className="text-sm text-gray-500">メモ</p>
                    <p className="text-gray-800 whitespace-pre-wrap">{selectedTask.memo}</p>
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

export default TaskDetail;