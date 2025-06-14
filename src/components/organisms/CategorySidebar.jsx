import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const CategorySidebar = ({ 
  categories, 
  selectedCategory, 
  onCategorySelect, 
  tasks 
}) => {
  const getTaskCount = (categoryId) => {
    if (categoryId === 'all') {
      return tasks.length;
    }
    return tasks.filter(task => task.categoryId === categoryId).length;
  };

  const getCompletedCount = (categoryId) => {
    if (categoryId === 'all') {
      return tasks.filter(task => task.completed).length;
    }
    return tasks.filter(task => task.categoryId === categoryId && task.completed).length;
  };

  const categoryItems = [
    { id: 'all', name: 'All Tasks', color: '#6B7280', icon: 'List' },
    ...categories
  ];

  return (
    <div className="w-80 bg-surface border-r border-gray-200 overflow-y-auto scrollbar-thin">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-xl font-display font-bold text-gray-900 mb-2">
            TaskFlow
          </h2>
          <p className="text-sm text-gray-600">
            Effortless task management
          </p>
        </div>

        <div className="space-y-2">
          {categoryItems.map((category) => {
            const taskCount = getTaskCount(category.id);
            const completedCount = getCompletedCount(category.id);
            const isSelected = selectedCategory === category.id;

            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCategorySelect(category.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 text-left ${
                  isSelected
                    ? 'bg-primary text-white shadow-card'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {category.icon ? (
                    <ApperIcon 
                      name={category.icon} 
                      size={18} 
                      className={isSelected ? 'text-white' : 'text-gray-500'} 
                    />
                  ) : (
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                  )}
                  <span className="font-medium">{category.name}</span>
                </div>

                <div className="flex items-center space-x-2">
                  {completedCount > 0 && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isSelected 
                        ? 'bg-white/20 text-white' 
                        : 'bg-success/10 text-success'
                    }`}>
                      {completedCount}
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isSelected 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {taskCount}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow-card">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Today's Progress
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Completed</span>
              <span className="font-medium text-success">
                {tasks.filter(t => t.completed).length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Remaining</span>
              <span className="font-medium text-gray-900">
                {tasks.filter(t => !t.completed).length}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>
                  {tasks.length > 0 
                    ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
                    : 0
                  }%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: tasks.length > 0 
                      ? `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%`
                      : '0%'
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="bg-success h-2 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;