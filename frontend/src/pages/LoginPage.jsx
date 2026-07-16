import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login,register } from "../api/authApi";
import useAuthStore from "../store/authStore";

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({username:'', email:'', password:''});
    const [error, setError] = useState('');
    const loginStore = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setError('');
        try{
            const res = isLogin ? await login({email: form.email, password: form.password})
                                : await register(form);
                                
            console.log('ログイン成功',res.data)
            loginStore(res.data.token, res.data.userId, res.data.username);
            console.log('navigate実行')
            navigate('/');
        }catch(err){
            const errors = err.response?.data
            console.log('エラー',err)

            if(errors?.email){
                setError(errors.email)
            }else if(errors?.password){
                setError(errors.password)
            }else if(errors?.username){
                setError(errors.username)
            }else if(errors?.message){
                setError(errors.message)
            }else{
                setError('エラーが発生しました')
            }
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    {isLogin ? 'ログイン': '新規登録'}
                </h2>
                
                {!isLogin && (
                    <input type="text" 
                        placeholder="ユーザー名"
                        className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={form.username}
                        onChange={(e) => setForm({...form, username: e.target.value})}
                    />
                )}

                <input type="email" 
                    placeholder="メールアドレス"
                    className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                />

                <input type="password" 
                    placeholder="パスワード"
                    className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.password}
                    onChange={(e) => setForm({...form, password: e.target.value})}
                />

                {error && (
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                )}

                <button onClick={handleSubmit}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    {isLogin ? 'ログイン' : '登録'}
                </button>

                <p className="text-center mt-4 text-sm text-gray-600">
                    {isLogin ? 'アカウントをお持ちでない方は' : 'すでにアカウントをお持ちの方は'}
                    <button onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-500 hover:underline ml-1">
                            {isLogin ? '新規登録' : 'ログイン'}
                    </button>
                </p>
            </div>
        </div>
    )
}

export default LoginPage;