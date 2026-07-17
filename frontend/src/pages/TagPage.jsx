import { useEffect, useState } from "react";
import { getTags, createTag, deleteTag } from "../api/tagApi";
import axiosInstance from "../api/axiosInstance";

const TagPage = () => {
    const [tags, setTags] = useState([]);
    const [form, setForm] = useState({ name: '', color: '#8b5cf6'});
    const [error, setError] = useState('');
    const [editingTag, setEditingTag] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', color: ''});
    const [editError, setEditError] = useState('');

    const fetchTags = async () => {
        const res = await getTags();
        setTags(res.data);
    }

    useEffect(() => {
        fetchTags();
    }, [])

    const handleCreate = async () => {
        setError('');
        try{
            await createTag(form);
            setForm({ name: '', color: '#8b5cf6' });
            fetchTags();
        }catch(err){
            const errors = err.response?.data;
            if(errors?.name){
                setError(errors.name);
            }else{
                setError('エラーが発生しました');
            }
        }
    }

    const handleDelete = async (id) => {
        if(!window.confirm('削除しますか？')) return
        try {
            await deleteTag(id);
            fetchTags();
        } catch(err) {
            console.error(err);
        }
    }

    const handleEditStart = (tag) => {
        setEditingTag(tag.id);
        setEditForm({ name: tag.name, color: tag.color || '#8b5cf6' });
        setEditError('');
    }

    const handleEditCancel = () => {
        setEditingTag(null);
        setEditForm({ name: '', color: ''});
        setEditError('');
    }

    const handleEditSave = async (id) => {
        setEditError('');
        try {
            await axiosInstance.put(`/api/tags/${id}`, editForm);
            setEditingTag(null);
            fetchTags();
        } catch(err) {
            const errors = err.response?.data;
            if (errors?.name) {
                setEditError(errors.name);
            } else {
                setEditError('エラーが発生しました');
            }
        }
    }

    const getStyle = (color) => {
        if (!color) return { backgroundColor: '#f3f4f6', color: '#6b7280'}
        return {
            backgroundColor: color + '33',
            color: color,
            border: `1px solid ${color}44`,
        }
    }

    return (
        <div className="flex gap-6 h-full overflow-hidden">

            <div className="w-80 flex-shrink-0">
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">新しいタグを作成</h2>

                    <div>
                        <label className="text-sm text-gray-500">タグ名 *</label>
                        <input type="text" className="w-full border rounded-lg px-4 py-2 mt-1
                                focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value})}
                            placeholder="タグ名を入力"
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>

                    <div>
                        <label className="text-sm text-gray-500">カラー</label>
                        <div className="flex items-center gap-3 mt-1">
                            <input type="color" 
                                className="w-12 h-10 rounded cursor-pointer border"
                                value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
                            />
                            <span className="text-sm text-gray-500">{form.color}</span>
                            <span className="text-xs px-2 py-1 rounded-full"
                                style={getStyle(form.color)}
                            >
                                {form.name || 'プレビュー'}
                            </span>
                        </div>
                    </div>

                    <button onClick={handleCreate} disabled={!form.name}
                        className={`w-full py-2 text-white rounded-lg transition-colors 
                            ${!form.name ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'}`}
                    >
                        作成
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">タグ一覧</h2>

                    {tags.length === 0 ? (
                        <p className="text-gray-400">タグがありません</p>
                    ) : (
                        <div className="space-y-3">
                            {tags.map((tag) => (
                                <div key={tag.id}
                                    className="flex items-center justify-between py-3 border-b last:border-b-0"
                                >
                                    {editingTag === tag.id ? (
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <input type="text" className="flex-1 border rounded-lg px-3 py-1 
                                                        text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={editForm.name} 
                                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                                />
                                                <input type="color" className="w-10 h-8 rounded cursor-pointer border"
                                                    value={editForm.color} onChange={(e) => setEditForm({...editForm, color: e.target.value})}
                                                />

                                                <span className="text-xs px-2 py-1 rounded-full"
                                                    style={getStyle(editForm.color)}
                                                >
                                                    {editForm.name || 'プレビュー'}
                                                </span>
                                            </div>
                                            {editError && (
                                                <p className="text-red-500 text-xs">{editError}</p>
                                            )}
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEditSave(tag.id)}
                                                    className="text-xs px-3 py-1 bg-blue-500 text-white 
                                                        rounded hover:bg-blue-600 transition-colors"
                                                >
                                                    保存
                                                </button>
                                                <button onClick={handleEditCancel}
                                                    className="text-xs px-3 py-1 bg-gray-200 text-gray-700 
                                                        rounded hover:bg-gray-300 transition-colors"
                                                >
                                                    キャンセル
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between w-full gap-4">
                                            <span className="text-xs px-2 py-1 rounded-full"
                                                style={getStyle(tag.color)}
                                            >
                                                {tag.name}
                                            </span>
                                            <div className="flex gap-2 flex-shrink-0">
                                                <button onClick={() => handleEditStart(tag)}
                                                    className="text-xs px-3 py-1 bg-blue-100 text-blue-600
                                                        rounded hover:bg-blue-200 transition-colors"
                                                >
                                                    編集
                                                </button>
                                                <button onClick={() => handleDelete(tag.id)}
                                                    className="text-xs px-3 py-1 bg-red-100 text-red-500 
                                                        rounded hover:bg-red-200 transition-colors"
                                                >
                                                    削除
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TagPage;