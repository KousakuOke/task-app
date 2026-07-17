import { NavLink } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    const navItems = [
        { to: '/', label: 'ホーム'},
        { to: '/tasks', label: 'タスク・プロジェクト'},
        { to: '/calendar', label: 'カレンダー'},
        { to: '/tags', label: 'タグ管理'},
        { to: '/account', label: 'アカウント'},
    ]

    return (
        <div className="flex flex-col h-hull p-4">
            <h1 className="text-xl font-bold mb-8 text-gray-800">タスク管理</h1>

            <nav className="flex-1 apace-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/'}
                        className={({isActive}) => 
                            `block px-4 py-2 rounded-lg transition-colors ${isActive
                                ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                            }`
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <button onClick={handleLogout} 
                    className="mt-auto px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        ログアウト
            </button>
        </div>
    )
}

export default Sidebar;