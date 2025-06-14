import categoryData from '../mockData/categories.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CategoryService {
  constructor() {
    this.categories = [...categoryData];
  }

  async getAll() {
    await delay(200);
    return [...this.categories];
  }

  async getById(id) {
    await delay(150);
    const category = this.categories.find(c => c.id === id);
    return category ? { ...category } : null;
  }

  async create(categoryData) {
    await delay(250);
    const newCategory = {
      id: Date.now().toString(),
      name: categoryData.name,
      color: categoryData.color,
      taskCount: 0
    };
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async update(id, updates) {
    await delay(200);
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    const updatedCategory = { ...this.categories[index], ...updates };
    this.categories[index] = updatedCategory;
    return { ...updatedCategory };
  }

  async delete(id) {
    await delay(200);
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    const deletedCategory = this.categories.splice(index, 1)[0];
    return { ...deletedCategory };
  }

  async updateTaskCount(categoryId, count) {
    await delay(100);
    const index = this.categories.findIndex(c => c.id === categoryId);
    if (index !== -1) {
      this.categories[index].taskCount = count;
      return { ...this.categories[index] };
    }
    return null;
  }
}

export default new CategoryService();