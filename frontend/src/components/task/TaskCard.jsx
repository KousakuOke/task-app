import TagBadge from "../common/TagBadge";
import useTaskStore from "../../store/taskStore";

const TaskCard = ({task, onUpdate}) => {
    const setSelectedTask = useTaskStore((state) => state.setSelectedTask);
    const selectedTask = useTaskStore((state) => state.selectedTask);

    const isSelected = selectedTask?.taskId === task.id;

    return (
        <div onClick={() => setSelectedTask(task)}
            className={`p-4 bg-white rounded-lg shadow-sm cursor-pointer 
                border-2 transition-colors ${isSelected ? 'border-blue-500' 
                : 'border-transparent hover:border-gray-200'}`}
        >
            <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">{task.name}</span>
                <TagBadge tagName={task.tagName} 
                    tagColor={task.tagColor}
                    taskId={task.id}
                    task={task}
                    onUpdate={onUpdate}
                />
            </div>

            {task.projectId && task.projectName && (
                <p className="text-xs text-blue-500 mt-1">
                    {task.projectName}
                </p>
            )}

            {task.deadline && (
                <p className="text-sm text-gray-400 mt-1">期日: {task.deadline}</p>
            )}
        </div>
    )
}

export default TaskCard;