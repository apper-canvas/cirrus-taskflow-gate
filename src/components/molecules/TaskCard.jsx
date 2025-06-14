import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Checkbox from '@/components/atoms/Checkbox';
import PriorityIndicator from '@/components/atoms/PriorityIndicator';

const TaskCard = ({ 
  task, 
  category, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  className = '' 
}) => {
  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    
    return format(date, 'MMM d');
  };

  const getDueDateColor = (dateString) => {
    if (!dateString) return 'text-gray-500';
    
    const date = new Date(dateString);
    
    if (isPast(date) && !task.completed) return 'text-error';
    if (isToday(date)) return 'text-warning';
    
    return 'text-gray-500';
  };

  const dueDateText = formatDueDate(task.dueDate);
  const dueDateColor = getDueDateColor(task.dueDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileHover={{ y: -2, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)' }}
      className={`bg-white rounded-lg p-4 shadow-card hover:shadow-card-hover transition-all duration-200 group ${className}`}
    >
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <div className="flex-shrink-0 mt-0.5">
          <Checkbox
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium break-words transition-all duration-200 ${
                task.completed 
                  ? 'text-gray-500 line-through' 
                  : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={`text-sm mt-1 break-words transition-all duration-200 ${
                  task.completed 
                    ? 'text-gray-400 line-through' 
                    : 'text-gray-600'
                }`}>
                  {task.description}
                </p>
              )}
            </div>

            {/* Actions - visible on hover */}
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onEdit(task)}
                className="p-1.5 text-gray-400 hover:text-primary rounded transition-colors duration-200"
              >
                <ApperIcon name="Edit2" size={16} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(task.id)}
                className="p-1.5 text-gray-400 hover:text-error rounded transition-colors duration-200"
              >
                <ApperIcon name="Trash2" size={16} />
              </motion.button>
            </div>
          </div>

          {/* Meta information */}
          <div className="flex items-center space-x-3 mt-3">
            {/* Priority */}
            <div className="flex items-center space-x-2">
              <PriorityIndicator priority={task.priority} />
              <span className="text-xs text-gray-500 capitalize">
                {task.priority}
              </span>
            </div>

            {/* Category */}
            {category && (
              <div className="flex items-center space-x-1">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-xs text-gray-500">
                  {category.name}
                </span>
              </div>
            )}

            {/* Due Date */}
            {dueDateText && (
              <div className="flex items-center space-x-1">
                <ApperIcon name="Calendar" size={12} className={dueDateColor} />
                <span className={`text-xs ${dueDateColor}`}>
                  {dueDateText}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;