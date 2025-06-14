import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';

const TaskModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  categories, 
  editingTask = null 
}) => {
const [formData, setFormData] = useState({
    title: '',
    description: '',
    notes: '',
    priority: 'medium',
    categoryId: '',
    dueDate: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        notes: editingTask.notes || '',
        priority: editingTask.priority || 'medium',
        categoryId: editingTask.categoryId || '',
        dueDate: editingTask.dueDate 
          ? format(new Date(editingTask.dueDate), 'yyyy-MM-dd\'T\'HH:mm')
          : ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        notes: '',
        priority: 'medium',
        categoryId: categories.length > 0 ? categories[0].id : '',
        dueDate: ''
      });
    }
    setErrors({});
  }, [editingTask, categories, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      };
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Failed to submit task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }));

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-lg shadow-card p-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-gray-900">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
            >
              <ApperIcon name="X" size={20} />
            </motion.button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Task Title"
              value={formData.title}
              onChange={(value) => handleChange('title', value)}
              error={errors.title}
              placeholder="Enter task title..."
              required
            />

            <FormField
              label="Description"
              value={formData.description}
              onChange={(value) => handleChange('description', value)}
              placeholder="Add a description..."
as="textarea"
            />

            <FormField
              label="Notes (Markdown supported)"
              value={formData.notes}
              onChange={(value) => handleChange('notes', value)}
              placeholder="Add detailed notes, instructions, or reminders using Markdown formatting..."
              as="textarea"
              rows={6}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Priority"
                value={formData.priority}
                onChange={(value) => handleChange('priority', value)}
                options={priorityOptions}
                as="select"
                required
              />

              <FormField
                label="Category"
                value={formData.categoryId}
                onChange={(value) => handleChange('categoryId', value)}
                error={errors.categoryId}
                options={categoryOptions}
                as="select"
                required
              />
            </div>

            <FormField
              label="Due Date"
              type="datetime-local"
              value={formData.dueDate}
              onChange={(value) => handleChange('dueDate', value)}
            />

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                className="flex-1"
              >
                {editingTask ? 'Update Task' : 'Create Task'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskModal;