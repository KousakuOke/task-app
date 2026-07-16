import { create } from "zustand";

const useTaskStore = create((set) => ({
    tasks: [],
    projects: [],
    selectedTask: null,
    selectedProject: null,

    setTasks: (tasks) => set({tasks}),
    setProjects: (projects) => set({projects}),
    setSelectedTask: (task) => set({selectedTask: task}),
    setSelectedProject: (project) => set({selectedProject: project}),

    updateSelectedTask: (updatedTask) => set({selectedTask: updatedTask}),

    setTasksAndSync: (tasks) => set((state) => ({
        tasks,
        selectedTask: state.selectedTask 
            ? tasks.find((t) => t.id === state.selectedTask.id) || null : null,
    })),

    setProjectsAndSync: (projects) => set((state) => ({
        projects,
        selectedProject: state.selectedProject 
            ? projects.find((p) => p.id === state.selectedProject.id) || null : null,
    })),
}))

export default useTaskStore;