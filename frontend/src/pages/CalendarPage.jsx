import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getTasks } from "../api/taskApi";
import useTaskStore from "../store/taskStore";;
import TaskDetail from "../components/task/TaskDetail";
import TaskCard from "../components/task/TaskCard";
import { info } from "autoprefixer";

const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDateTasks, setSelectedDateTasks] = useState([]);
    const {tasks, setTasksAndSync, setSelectedTask} = useTaskStore();

    const updateCalendar = (taskData) => {
        const calendarEvents = taskData.filter((task) => task.deadline)
            .map((task) => ({
                id: String(task.id),
                title: task.name,
                date: task.deadline,
                backgroundColor: task.tagColor || '#8b5cf6',
                borderColor: task.tagColor || '#8b5cf6',
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

    const handleDateClick = (info) => {
        const clickedDate = info.dateStr;
        setSelectedDate(clickedDate);
        setSelectedTask(null);

        const dateTasks = tasks.filter((t) => t.deadline === clickedDate);
        setSelectedDateTasks(dateTasks);
    }

    const handleEventClick = (info) => {
        const task = tasks.find((t) => String(t.id) === info.event.id);
        if(task) {
            setSelectedTask(task);
            setSelectedDate(task.deadline);
            const dateTasks = tasks.filter((t) => t.deadline === task.deadline);
            setSelectedDateTasks(dateTasks);
        }
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    }

    return (
        <div className="flex gap-6 h-full overflow-hidden">

            <div className="flex-1 overflow-y-auto">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    eventClick={handleEventClick}
                    dateClick={handleDateClick}
                    locale="ja"
                    height="auto"

                    dayCellClassNames={(arg) => {
                        if (selectedDate && arg.dateStr === selectedDate) {
                            return ['bg-blue-50']
                        }
                        return []
                    }}
                />
            </div>

            <div className="w-80 flex-shrink-0 flex flex-col gap-4 overflow-y-auto">

                {selectedDate && (
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <h3 className="text-sm font-bold text-gray-700 mb-3">
                            {formatDate(selectedDate)}のタスク
                        </h3>
                        {selectedDateTasks.length === 0 ? (
                            <p className="text-sm text-gray-400">
                                この日のタスクはありません
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {selectedDateTasks.map((task) => (
                                    <TaskCard key={task.id} task={task} onUpdate={fetchAndUpdate} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
                <TaskDetail onUpdate={fetchAndUpdate} />
            </div>
        </div>
    )
}

export default CalendarPage;