import { useEffect, useState } from "react";
import { getTodayTasks, getUpcomingTasks, getTasks } from "../api/taskApi";
import TaskCard from '../components/task/TaskCard';
import TaskDetail from '../components/task/TaskDetail';
import useTaskStore from "../store/taskStore";

const HomePage = () => {
    const [todayTasks, setTodayTasks] = useState([]);
    const [upcomingTasks, setUpcomingTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const {selectedTask, setTasksAndSync} = useTaskStore();

    const fetchTasks = async () => {
        try{
            const [today, upcoming, all] = await Promise.all([
                getTodayTasks(),
                getUpcomingTasks(),
                getTasks(),
            ]);
            setTodayTasks(today.data);
            setUpcomingTasks(upcoming.data);
            console.log('全タスク', all.data)
            console.log('selectedTask', selectedTask)
            setTasksAndSync(all.data);
            console.log('setTasksAndSync後')
        }catch(err){
            console.error(err);
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTasks();
    }, [])
    
    if(loading) return <p className="text-gray-500">読み込み中...</p>

    return (
        <div className="flex gap-6 h-full">
            
            <div className="flex-1 space-y-8">
                <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        今日期日のタスク
                    </h2>
                    {todayTasks.length === 0 ? (
                        <p className="text-gray-400">今日期日のタスクはありません</p>
                    ) : (
                        <div className="space-y-2">
                            {todayTasks.map((task) => (
                                <TaskCard key={task.id} task={task} onUpdate={fetchTasks} />
                            ))}
                        </div>
                        )}
                </section>

                <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        直近のタスク
                    </h2>
                    {upcomingTasks.length === 0 ? (
                        <p className="text-gray-400">直近のタスクはありません</p>
                    ):(
                        <div className="space-y-2">
                            {upcomingTasks.map((task) => (
                                <TaskCard key={task.id} task={task} onUpdate={fetchTasks} />
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <div className="w-80 flex-shrink-0">
                <TaskDetail onUpdate={fetchTasks} />
            </div>
        </div>
    )
}

export default HomePage;