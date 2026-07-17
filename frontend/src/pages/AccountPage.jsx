import { useState } from "react";
import useAuthStore from '../store/authStore';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from "react-router-dom";

const AccountPage = () => {
    const {token, userId, username, logout, login} = useAuthStore();
    const navigate = useNavigate();
    const [form, setForm] = useState({username: '', email: '', password: ''});
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const handleUpdate = async () => {
        setMessage('');
        setErrors({});
        
        try{
            const requestData = {
                username: form.username || null,
                email: form.email || null,
                password: form.password || null,
            }
            await axiosInstance.put('/api/account', requestData);

            if(form.username){
                login(token, userId, form.username);
            }

            setMessage('更新しました');
            setForm({username: '', email:'', password: ''});
        }catch(err){
            const data = err.response?.data;
            if (data){
                setErrors({
                    username: data?.username,
                    email: data?.email,
                    password: data?.password,
                    message: data?.message,
                });
            }else{
                setErrors({ message: 'エラーが発生しました'});
            }
        }
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    const isFormEmpty = !form.username && !form.email && !form.password;

    return (
        <div className="max-w-md space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">アカウント</h2>

            <div className="bg-white rounded-xl shadow=sm p-6 space-y-4">
                <div>
                    <p className="text-sm text-gray-500">ユーザー名</p>
                    <p className="text-gray-800 font-medium">{username}</p>
                </div>

                <div>
                    <label className="text-sm text-gray-500">新しいユーザー名</label>
                    <input type="text" className="w-full border rounded-lg px-4 py-2 mt-1 
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={form.username} onChange={(e) => setForm({...form, username: e.target.value})}
                    />
                    {errors.username && (
                        <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                    )}
                </div>

                <div>
                    <label className="text-sm text-gray-500">新しいメールアドレス</label>
                    <input type="email" 
                        className="w-full border rounded-lg px-4 py-2 mt-1 
                            focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        value={form.email} 
                        onChange={(e) => setForm({...form, email: e.target.value})}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                <div>
                    <label className="text-sm text-gray-500">新しいパスワード</label>
                    <input type="password" 
                        className="w-full border rounded-lg px-4 py-2 mt-1
                            focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={form.password}
                        onChange={(e) => setForm({...form, password: e.target.value})}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                </div>

                {message && <p className="text-green-500 text-sm">{message}</p>}
                {errors.message && (
                    <p className="text-red-500 text-sm">{errors.message}</p>
                )}

                <button onClick={handleUpdate} disabled={isFormEmpty} 
                    className={`w-full py-2 text-white rounded-lg transition-colors 
                        ${isFormEmpty
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                >
                    更新
                </button>
            </div>

            <button onClick={handleLogout} 
                className="w-full py-2 bg-red-500 text-white rounded-lg 
                    hover:bg-red-600 transition-colors"
            >
                ログアウト
            </button>
        </div>
    )
}

export default AccountPage;