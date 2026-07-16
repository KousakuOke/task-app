import useTaskStore from "../../store/taskStore";

const ProjectCard = ({project}) => {
    const setSelectedProject = useTaskStore((state) => state.setSelectedProject);
    const selectedProject = useTaskStore((state) => state.selectedProject);
    const isSelected = selectedProject?.id === project.id;

    return (
        <div onClick={() => setSelectedProject(project)}
            className={`p-4 bg-white rounded-lg shadow-sm cursor-pointer 
                border-2 transition-colors ${isSelected ? 'border-blue-500' 
                : 'border-transparent hover:border-gray-200'}`}
        >
            <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">{project.name}</span>
                <span className="text-sm text-blue-500">{project.progress}%</span>
            </div>
            {project.deadline && (
                <p className="text-sm text-gray-400 mt-1">期日: {project.deadline}</p>
            )}
            <div className="mt-2 bg-gray-200 rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full transition-all"
                    style={{width: `${project.progress}%`}}
                >
                </div>
            </div>
        </div>
    )
}

export default ProjectCard;