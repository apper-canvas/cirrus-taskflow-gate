import taskData from '../mockData/tasks.json';
import { addDays, addWeeks, addMonths, isBefore } from 'date-fns';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...taskData];
  }

  async getAll() {
    await delay(300);
    return [...this.tasks];
  }

  async getById(id) {
    await delay(200);
    const task = this.tasks.find(t => t.id === id);
    return task ? { ...task } : null;
  }

  async getByCategory(categoryId) {
    await delay(300);
    return this.tasks.filter(t => t.categoryId === categoryId);
}

  async create(taskData) {
    await delay(300);
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description || '',
      notes: taskData.notes || '',
      completed: false,
      priority: taskData.priority || 'medium',
      categoryId: taskData.categoryId,
      dueDate: taskData.dueDate || null,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    this.tasks.unshift(newTask);
    return { ...newTask };
  }

  async update(id, updates) {
    await delay(250);
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    const updatedTask = {
      ...this.tasks[index],
      ...updates,
      completedAt: updates.completed ? new Date().toISOString() : null
    };
    
    this.tasks[index] = updatedTask;
    return { ...updatedTask };
  }

  async delete(id) {
    await delay(200);
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    const deletedTask = this.tasks.splice(index, 1)[0];
    return { ...deletedTask };
  }

  async search(query) {
    await delay(200);
    const searchTerm = query.toLowerCase();
    return this.tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm) ||
      task.description.toLowerCase().includes(searchTerm)
    );
  }

  async reorder(taskId, newIndex) {
    await delay(200);
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) throw new Error('Task not found');
    
    const [task] = this.tasks.splice(taskIndex, 1);
this.tasks.splice(newIndex, 0, task);
    
    return [...this.tasks];
  }
  generateRecurringInstances(task, maxInstances = 10) {
    if (!task.recurrence || !task.dueDate) return [];

    const instances = [];
    const { pattern, interval = 1, endDate } = task.recurrence;
    const startDate = new Date(task.dueDate);
    const endLimit = endDate ? new Date(endDate) : addMonths(startDate, 12);

    let currentDate = new Date(startDate);
    let instanceCount = 0;

    while (instanceCount < maxInstances && isBefore(currentDate, endLimit)) {
      // Skip the first instance as it's the original task
      if (instanceCount > 0) {
        const instanceId = `${task.id}_${instanceCount}`;
        const instance = {
          ...task,
          id: instanceId,
          parentId: task.id,
          dueDate: currentDate.toISOString(),
          createdAt: new Date().toISOString(),
          completed: false,
          completedAt: null
        };
        instances.push(instance);
      }

      // Calculate next occurrence
      switch (pattern) {
        case 'daily':
          currentDate = addDays(currentDate, interval);
          break;
        case 'weekly':
          currentDate = addWeeks(currentDate, interval);
          break;
        case 'monthly':
          currentDate = addMonths(currentDate, interval);
          break;
        default:
          // Exit for unsupported patterns
          return instances;
      }

      instanceCount++;
    }

    return instances;
  }

  async createRecurring(taskData) {
    await delay(300);
    
    // Create the main recurring task
    const mainTask = await this.create(taskData);
    
    // Generate recurring instances
    const instances = this.generateRecurringInstances(mainTask);
    
    // Add instances to tasks array
    instances.forEach(instance => {
      this.tasks.unshift(instance);
    });
    
    return {
      mainTask: { ...mainTask },
      instances: instances.map(instance => ({ ...instance })),
      totalCreated: instances.length + 1
    };
  }

  async getRecurringTasks() {
    await delay(200);
    return this.tasks.filter(task => task.isRecurring && !task.parentId);
  }

  async getTaskInstances(parentId) {
    await delay(200);
    return this.tasks.filter(task => task.parentId === parentId);
  }
}

export default new TaskService();