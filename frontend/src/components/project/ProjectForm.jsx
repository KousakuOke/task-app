import { useState } from "react";
import { createProject, updateProject } from "../../api/projectApi";

const ProjectForm = ({project, onClose, onSave}) => {
    const [form, setForm] = useState({
        name: project?.name || '',
        deadline: project?.deadline || '',
        memo: project?.memo || '',
    })
    const [error, setError] = useState('');

    const handleSave = async () => {
        setError('');
        try{
            if(project){
                await updateProject(project.id, form);
            }else{
                await createProject(form);
            }
            onSave();
        }catch(err){
            const errors = err.response?.data;
            if(errors?.name){
                setError(errors.name);
            }else{
                setError('エラーが発生しました');
            }
        }
    }

    return  (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
                {project ? 'プロジェクトを編集' : '新しいプロジェクト'}
            </h2>

            <div>
                <label className="text-sm text-gray-500">プロジェクト名 *</label>
                <input type="text"
                    className="w-full border rounded-lg px-4 py-2 mt-1
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <div>
                <label className="text-sm text-gray-500">期日</label>
                <input type="date" 
                    className="w-full border rounded-lg px-4 py-2 mt-1
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.deadline}
                    onChange={(e) => setForm({...form, deadline: e.target.value})}
                />
            </div>

            <div>
                <label className="text-sm text-gray-500">メモ</label>
                <textarea className="w-full border rounded-lg px-4 py-2 mt-1
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    value={form.memo}
                    onChange={(e) => setForm({...form, memo: e.target.value})}
                />
            </div>

            <div className="flex gap-2">
                <button onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 text-white 
                        rounded-lg hover:bg-blue-600 transition-colors"
                >
                    保存
                </button>
                <button onClick={onClose}
                    className="px-4 py-2 bg-gray-200 text-gray-700 
                        rounded-lg hover:bg-gray-300 transition-colors"
                >
                    キャンセル
                </button>
            </div>
        </div>
    )
}

export default ProjectForm;