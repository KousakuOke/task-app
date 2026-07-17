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

const TasksPage = () => {
    const {tasks, setTasks, projects, setProjects, selectedTask, selectedProject, setTasksAndSync, setProjectsAndSync} = useTaskStore();
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [tab, setTab] = useState('tasks');
    const [sortKey, setSortKey] = useState('createdAt');
    const [projectSortKey, setProjectSortKey] = useState('createdAt');

    const fetchAll = async (sort = sortKey) => {
        try{
            const [taskRes, projectRes] = await Promise.all([
                getTasks(sort),
                getProjects(),
            ])
            setTasksAndSync(taskRes.data);
            setProjectsAndSync(projectRes.data);
        }catch(err){
            console.error(err);
        }
    }

    const handleSortChange = (e) => {
        const newSort = e.target.value;
        setSortKey(newSort);
        fetchAll(newSort);
    }

    const sortProjects = (items) => {
        return [...items].sort((a, b) => {
            switch (projectSortKey){
                case 'deadline':
                    if(!a.deadline) return 1;
                    if(!b.deadline) return -1;
                    return new Date(a.deadline) - new Date(b.deadline);
                case 'progress':
                    return b.progress - a.progress;
                case 'createdAt':
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        })
    }

    useEffect(() => {
        fetchAll()
    },[])

    return (
        <div className="flex gap-6 h-full overflow-hidden">

            <div className="w-80 flex-shrink-0 flex flex-col h-full">

                <div className="flex-shrink-0 pb-4">
                    <div className="flex bg-gray-200 rounded-lg p-1 mb-3">
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

                    {tab === 'tasks' && (
                        <select value={sortKey} onChange={handleSortChange}
                            className="w-full border rounded-lg px-3 py-2 text-sm mb-3 
                                focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="createdAt">作成日順</option>
                            <option value="deadline">期日順</option>
                            <option value="tagName">タグ順</option>
                        </select>
                    )}

                    {tab === 'projects' && (
                        <select value={projectSortKey} onChange={(e) => setProjectSortKey(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm mb-3 
                                focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="createdAt">作成日順</option>
                            <option value="deadline">期日順</option>
                            <option value="progress">進行度順</option>
                        </select>
                    )}

                    <button onClick={() => tab === 'tasks' ? setShowTaskForm(true) : setShowProjectForm(true)}
                        className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        + {tab === 'tasks' ? 'タスクを追加' : 'プロジェクトを追加'}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                    {tab === 'tasks' ? tasks.map((task) => (
                    <TaskCard key={task.id} task={task} onUpdate={fetchAll} /> 
                    ))
                    : sortProjects(projects).map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))
                }
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
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

export default TasksPage;