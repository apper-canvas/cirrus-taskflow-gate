import TasksPage from '@/components/pages/TasksPage';

export const routes = {
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: TasksPage
  }
};

export const routeArray = Object.values(routes);
export default routes;