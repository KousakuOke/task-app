import { useState, useEffect, useRef } from "react";
import { getTags } from "../../api/tagApi";
import { updateTask } from "../../api/taskApi";
import useTaskStore from "../../store/taskStore";

const TagBadge = ({tagName, taskId, task, onUpdate}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tags, setTags] = useState([]);
    const ref = useRef(null);
    
    useEffect(() => {
        const handleClickOutside = (e) => {
            if(ref.current && !ref.current.contains(e.target)){
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        if(isOpen){
            getTags().then((res) => setTags(res.data));
        }
    }, [isOpen])

    const getColor = (name) => {
        switch (name) {
            case '未着手': return 'bg-gray-200 text-gray-700';
            case '作業中': return 'bg-blue-100 text-blue-700';
            case '完了': return 'bg-green-100 text-green-700';
            default: return 'bg-purple-100 text-purple-700';
        }
    }

    const handleTagChange = async (tag) => {
        try{
            await updateTask(taskId, {
                name: task.name,
                deadline: task.deadline,
                memo: task.memo,
                tagId: tag.id,
                projectId: task.projectId,
            })
            setIsOpen(false)
            if(onUpdate) onUpdate()
        }catch(err){
            console.error(err)
        }
    }

    if(!taskId){
        if(!tagName) return null
        return (
            <span className={`text-xs px-2 py-1 rounded-full ${getColor(tagName)}`}>
                {tagName}
            </span>
        )
    }

    return(
        <div className="relative" ref={ref}>
            <span onClick={() => setIsOpen(!isOpen)}
                className={`text-xs px-2 py-1 rounded-full cursor-pointer 
                    ${getColor(tagName)} ${tagName ? '' : 'bg-gray-100 text-gray-400'}`}
            >
                {tagName || 'タグなし'}
            </span>

            {isOpen && (
                <div className="absolute right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-32">
                    <div onClick={() => handleTagChange({ id: null})} 
                        className="px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer"
                    >
                        タグなし
                    </div>
                    {tags.map((tag) => (
                        <div key={tag.id} onClick={() => handleTagChange(tag)} 
                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${getColor(tag.name)}`}
                        >
                            {tag.name}
                        </div>
                    ))}
                </div>
            )}
        </div>        
    )
}

export default TagBadge;