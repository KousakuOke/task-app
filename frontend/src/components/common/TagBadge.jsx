import { useState, useEffect, useRef, captureOwnerStack } from "react";
import { getTags } from "../../api/tagApi";
import { updateTask } from "../../api/taskApi";
import useTaskStore from "../../store/taskStore";

const TagBadge = ({tagName, tagColor, taskId, task, onUpdate}) => {
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

    const getStyle = (color) => {
        if(!color) return {
            backgroundColor: '#f3f4f6',
            color: '#6b7280'
        }
        return {
            backgroundColor: color + '33',
            color: color,
            border: `1px solid ${color}44`,
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
            <span className="text-xs px-2 py-1 rounded-full"
                style={getStyle(tagColor)}
            >
                {tagName}
            </span>
        )
    }

    return(
        <div className="relative" ref={ref}>
            <span onClick={() => setIsOpen(!isOpen)}
                className="text-xs px-2 py-1 rounded-full cursor-pointer"
                style={tagName ? getStyle(tagColor) : {
                    backgroundColor: '#f3f4f6',
                    color: '#9ca3af'
                }}
            >
                {tagName || 'タグなし'}
            </span>

            {isOpen && (
                <div className="absolute right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-40">
                    <div onClick={() => handleTagChange({ id: null})} 
                        className="px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer"
                    >
                        タグなし
                    </div>
                    {tags.map((tag) => (
                        <div key={tag.id} onClick={() => handleTagChange(tag)} 
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 flex items-center gap-2"
                        >
                            <span  className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{backgroundColor: tag.color || '#8b5cf6'}}
                            />
                            <span style={{color: tag.color || '#8b5cf6'}}>
                                {tag.name}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>        
    )
}

export default TagBadge;