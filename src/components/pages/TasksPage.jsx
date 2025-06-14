import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { taskService, categoryService } from '@/services';
import CategorySidebar from '@/components/organisms/CategorySidebar';
import TaskList from '@/components/organisms/TaskList';
import SearchBar from '@/components/molecules/SearchBar';
import FloatingAddButton from '@/components/atoms/FloatingAddButton';
import TaskModal from '@/components/organisms/TaskModal';
import EmptyState from '@/components/molecules/EmptyState';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [newTask, ...prev]);
      setShowTaskModal(false);
      toast.success('Task created successfully!');
      
      // Update category task count
      const categoryTasks = tasks.filter(t => t.categoryId === taskData.categoryId);
      await categoryService.updateTaskCount(taskData.categoryId, categoryTasks.length + 1);
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, updates);
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      setShowTaskModal(false);
      setEditingTask(null);
      toast.success('Task updated successfully!');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Task deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleToggleComplete = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const updatedTask = await taskService.update(taskId, { 
        completed: !task.completed 
      });
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      
      if (updatedTask.completed) {
        toast.success('Task completed! 🎉');
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      const allTasks = await taskService.getAll();
      setTasks(allTasks);
      return;
    }

    try {
      const searchResults = await taskService.search(query);
      setTasks(searchResults);
    } catch (err) {
      toast.error('Search failed');
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchQuery(''); // Clear search when switching categories
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const getFilteredTasks = () => {
    let filtered = tasks;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(task => task.categoryId === selectedCategory);
    }
    
    return filtered;
  };

  const filteredTasks = getFilteredTasks();
  const completedCount = tasks.filter(t => t.completed).length;

  if (loading) {
    return (
      <div className="h-screen flex overflow-hidden bg-background">
        <div className="w-80 bg-surface border-r border-gray-200 p-6">
          <SkeletonLoader type="sidebar" />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <SkeletonLoader type="search" />
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <SkeletonLoader type="tasks" count={5} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-error text-lg font-medium mb-2">Something went wrong</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button
            onClick={loadInitialData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Category Sidebar */}
      <CategorySidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        tasks={tasks}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with Search */}
        <div className="flex-shrink-0 p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-display font-bold text-gray-900">
                {selectedCategory === 'all' ? 'All Tasks' : 
                 categories.find(c => c.id === selectedCategory)?.name || 'Tasks'}
              </h1>
              <p className="text-gray-600 mt-1">
                {completedCount} of {tasks.length} tasks completed
              </p>
            </div>
          </div>
          
          <SearchBar
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search tasks..."
          />
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {filteredTasks.length === 0 ? (
            <EmptyState
              title={searchQuery ? "No tasks found" : "No tasks yet"}
              description={
                searchQuery 
                  ? "Try adjusting your search terms"
                  : "Create your first task to get started with TaskFlow"
              }
              actionLabel={searchQuery ? "Clear Search" : "Create Task"}
              onAction={() => {
                if (searchQuery) {
                  handleSearch('');
                } else {
                  setShowTaskModal(true);
                }
              }}
            />
          ) : (
            <TaskList
              tasks={filteredTasks}
              onToggleComplete={handleToggleComplete}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              categories={categories}
            />
          )}
        </div>
      </div>

      {/* Floating Add Button */}
      <FloatingAddButton onClick={() => setShowTaskModal(true)} />

      {/* Task Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <TaskModal
            isOpen={showTaskModal}
            onClose={() => {
              setShowTaskModal(false);
              setEditingTask(null);
            }}
            onSubmit={editingTask ? 
              (data) => handleUpdateTask(editingTask.id, data) : 
              handleCreateTask
            }
            categories={categories}
            editingTask={editingTask}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TasksPage;