import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import MarkdownEditor from "@/components/molecules/MarkdownEditor";
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
    dueDate: '',
    recurrence: null
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRecurrence, setShowRecurrence] = useState(false);

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
          : '',
        recurrence: editingTask.recurrence || null
      });
      setShowRecurrence(!!editingTask.recurrence);
    } else {
      setFormData({
        title: '',
        description: '',
        notes: '',
        priority: 'medium',
        categoryId: categories.length > 0 ? categories[0].id : '',
        dueDate: '',
        recurrence: null
      });
      setShowRecurrence(false);
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

  const recurrencePatternOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const toggleRecurrence = () => {
    setShowRecurrence(!showRecurrence);
    if (!showRecurrence) {
      setFormData(prev => ({
        ...prev,
        recurrence: {
          pattern: 'daily',
          interval: 1,
          endDate: ''
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        recurrence: null
      }));
    }
  };

  const handleRecurrenceChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      recurrence: {
        ...prev.recurrence,
        [field]: value
      }
    }));
  };
  if (!isOpen) return null;

  return (
    <AnimatePresence>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
            initial={{
                opacity: 0
            }}
            animate={{
                opacity: 1
            }}
            exit={{
                opacity: 0
            }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50" />
        {/* Modal */}
        <motion.div
            initial={{
                opacity: 0,
                scale: 0.95,
                y: 20
            }}
            animate={{
                opacity: 1,
                scale: 1,
                y: 0
            }}
            exit={{
                opacity: 0,
                scale: 0.95,
                y: 20
            }}
            className="relative w-full max-w-md bg-white rounded-lg shadow-card p-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-gray-900">
                    {editingTask ? "Edit Task" : "Create New Task"}
                </h2>
                <motion.button
                    whileHover={{
                        scale: 1.1
                    }}
                    whileTap={{
                        scale: 0.9
                    }}
                    onClick={onClose}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded">
                    <ApperIcon name="X" size={20} />
                </motion.button>
            </div>
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                    label="Task Title"
                    value={formData.title}
                    onChange={value => handleChange("title", value)}
                    error={errors.title}
                    placeholder="Enter task title..."
                    required />
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Description
                                      </label>
                    <MarkdownEditor
                        value={formData.description}
                        onChange={value => handleChange("description", value)}
                        placeholder="Add a description..."
                        height={150} />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Notes
                                      </label>
                    <MarkdownEditor
                        value={formData.notes}
                        onChange={value => handleChange("notes", value)}
                        placeholder="Add detailed notes, instructions, or reminders using Markdown formatting..."
                        rows={6} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        label="Priority"
                        value={formData.priority}
                        onChange={value => handleChange("priority", value)}
                        options={priorityOptions}
                        as="select"
                        required />
                    <FormField
                        label="Category"
                        value={formData.categoryId}
                        onChange={value => handleChange("categoryId", value)}
                        error={errors.categoryId}
                        options={categoryOptions}
                        as="select"
                        required />
                </div>
                <FormField
                    label="Due Date"
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={value => handleChange("dueDate", value)} />
                {/* Recurring Options */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">Recurring Task
                                            </label>
                        <motion.button
                            type="button"
                            whileTap={{
                                scale: 0.95
                            }}
                            onClick={toggleRecurrence}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${showRecurrence ? "bg-primary" : "bg-gray-200"}`}>
                            <span className="sr-only">Enable recurring</span>
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showRecurrence ? "translate-x-6" : "translate-x-1"}`} />
                        </motion.button>
                    </div>
                    <AnimatePresence>
                        {showRecurrence && <motion.div
                            initial={{
                                opacity: 0,
                                height: 0
                            }}
                            animate={{
                                opacity: 1,
                                height: "auto"
                            }}
                            exit={{
                                opacity: 0,
                                height: 0
                            }}
                            className="space-y-4 border-l-2 border-primary/20 pl-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    label="Repeat Pattern"
                                    value={formData.recurrence?.pattern || "daily"}
                                    onChange={value => handleRecurrenceChange("pattern", value)}
                                    options={recurrencePatternOptions}
                                    as="select"
                                    required={showRecurrence} />
                                <FormField
                                    label="Every"
                                    type="number"
                                    value={formData.recurrence?.interval || 1}
                                    onChange={value => handleRecurrenceChange("interval", parseInt(value))}
                                    min="1"
                                    max="30"
                                    required={showRecurrence}
                                    placeholder="1" />
                            </div>
                            <FormField
                                label="End Date (Optional)"
                                type="date"
                                value={formData.recurrence?.endDate || ""}
                                onChange={value => handleRecurrenceChange("endDate", value)}
                                min={formData.dueDate ? format(new Date(formData.dueDate), "yyyy-MM-dd") : undefined} />
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-start">
                                    <ApperIcon name="Info" size={16} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                                    <div className="text-sm text-blue-800">
                                        <p className="font-medium mb-1">Recurring Task Preview</p>
                                        <p>
                                            {formData.recurrence?.pattern && formData.recurrence?.interval ? `This task will repeat every ${formData.recurrence.interval} ${formData.recurrence.pattern === "daily" ? "day(s)" : formData.recurrence.pattern === "weekly" ? "week(s)" : "month(s)"}${formData.recurrence.endDate ? ` until ${format(new Date(formData.recurrence.endDate), "MMM dd, yyyy")}` : ""}.` : "Configure the pattern and interval above."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>}
                    </AnimatePresence>
                </div>
                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel
                                      </Button>
                    <Button type="submit" variant="primary" loading={isSubmitting} className="flex-1">
                        {editingTask ? "Update Task" : "Create Task"}
                    </Button>
                </div>
            </form>
        </motion.div>
    </div>
</AnimatePresence>
  );
};

export default TaskModal;