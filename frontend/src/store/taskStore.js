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

    setTasksAndSync: (tasks) => set((state) => {
    const found = state.selectedTask
        ? tasks.find((t) => Number(t.id) === Number(state.selectedTask.id)) : null;
    console.log('setTasksAndSync called', 'selectedTask:', state.selectedTask?.id, 'found:', found?.id)
    return {
        tasks,
        selectedTask: found || null,
    }
}),

    setProjectsAndSync: (projects) => set((state) => ({
        projects,
        selectedProject: state.selectedProject 
            ? projects.find((p) => Number(p.id) === Number(state.selectedProject.id)) || null : null,
    })),
}))

export default useTaskStore;