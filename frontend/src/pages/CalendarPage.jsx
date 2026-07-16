import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getTasks } from "../api/taskApi";
import useTaskStore from "../store/taskStore";;
import TaskDetail from "../components/task/TaskDetail";

const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    const {tasks, setTasksAndSync, setSelectedTask} = useTaskStore();

    const updateCalendar = (taskData) => {
        const calendarEvents = taskData.filter((task) => task.deadline)
            .map((task) => ({
                id: String(task.id),
                title: task.name,
                date: task.deadline,
                backgroundColor: getEventColor(task.tagName),
                borderColor: getEventColor(task.tagName),
            }))
        setEvents(calendarEvents);
    }

    const fetchAndUpdate = () => {
        getTasks().then((res) => {
            setTasksAndSync(res.data);
            updateCalendar(res.data);
        })
    }

    useEffect(() => {
        fetchAndUpdate();
    }, [])

    const getEventColor = (tagName) => {
        switch (tagName){
            case '未着手': return '#9ca3af';
            case '作業中': return '#3b82f6';
            case '完了' : return '#22c55e';
            default: return '#8b5cf6';
        }
    }

    const handleEventClick = (info) => {
        const task = tasks.find((t) => String(t.id) === info.event.id);
        if (task) setSelectedTask(task);
    }

    return (
        <div className="flex gap-6 h-full">
            <div className="flex-1">
                <FullCalendar plugins={[dayGridPlugin, interactionPlugin]} 
                    initialView="dayGridMonth" events={events} 
                    eventClick={handleEventClick} locale="ja" height ="auto"
                />
            </div>

            <div className="w-80 flex-shrink-0">
                <TaskDetail onUpdate={fetchAndUpdate} />
            </div>
        </div>
    )
}

export default CalendarPage;