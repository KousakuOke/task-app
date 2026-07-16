import { useEffect, useState } from "react";
import { getTasks } from "../api/taskApi";
import { getProjects } from "../api/projectApi";
import useTaskStore from "../store/taskStore";
import TaskCard from "../components/task/TaskCard";
import TaskDetail from "../components/task/TaskDetail";
import TaskForm from "../components/task/TaskForm";
import ProjectCard from "../components/project/ProjectCard";
import ProjectDetail from "../components/project/ProjectDetail";
import ProjectForm from "../components/project/ProjectForm";

const TaskPage = () => {
    const {tasks, setTasks, projects, setProjects, selectedTask, selectedProject, setTasksAndSync, setProjectsAndSync} = useTaskStore();
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [tab, setTab] = useState('tasks');

    const fetchAll = async () => {
        try{
            const [taskRes, projectRes] = await Promise.all([
                getTasks(),
                getProjects(),
            ])
            setTasksAndSync(taskRes.data);
            setProjectsAndSync(projectRes.data);
        }catch(err){
            console.error(err);
        }
    }

    useEffect(() => {
        fetchAll()
    },[])

    return (
        <div className="flex gap-6 h-full">
            <div className="w-80 flex-shrink-0 space-y-4">
                <div className="flex bg-gray-200 rounded-lg p-1">
                    <button onClick={() => setTab('tasks')}
                        className={`flex-1 py-1 rounded-md text-sm
                            font-medium transition-colors ${tab === 'tasks'
                            ? 'bg-white text-gray-800' : 'text-gray-500'}`}
                    >
                        タスク
                    </button>
                    <button onClick={() => setTab('projects')}
                        className={`flex-1 py-1 rounded-md text-sm font-medium 
                            transition-colors ${tab === 'projects' ? 'bg-white text-gray-800'
                            : 'text-gray-500'}`}
                    >
                        プロジェクト
                    </button>
                </div>

                <button onClick={() => tab === 'tasks' ? setShowTaskForm(true) : setShowProjectForm(true)}
                    className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    + {tab === 'tasks' ? 'タスクを追加' : 'プロジェクトを追加'}
                </button>

                <div className="space-y-2">
                    {tab === 'tasks' ? tasks.map((task) => (
                    <TaskCard key={task.id} task={task} onUpdate={fetchAll} /> 
                    ))
                    : projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))
                }
                </div>
            </div>

            <div className="flex-1">
                {showTaskForm && (
                    <TaskForm 
                        onClose={() => setShowTaskForm(false)}
                        onSave={() => {setShowTaskForm(false); fetchAll()}}
                    />
                )}
                {showProjectForm && (
                    <ProjectForm
                        onClose={() => setShowProjectForm(false)}
                        onSave={() => {setShowProjectForm(false); fetchAll()}}
                    />
                )}
                {!showTaskForm && !showProjectForm && tab === 'tasks' && (
                    <TaskDetail onUpdate={fetchAll} />
                )}
                {!showTaskForm && !showProjectForm && tab === 'projects' && (
                    <ProjectDetail onUpdate={fetchAll} />
                )}
            </div>
        </div>
    )
}

export default TaskPage;