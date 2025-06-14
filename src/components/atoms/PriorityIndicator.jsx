import { motion } from 'framer-motion';

const PriorityIndicator = ({ priority, className = '' }) => {
  const priorityConfig = {
    low: { color: 'bg-blue-500', label: 'Low' },
    medium: { color: 'bg-warning', label: 'Medium' },
    high: { color: 'bg-error', label: 'High' }
  };

  const config = priorityConfig[priority] || priorityConfig.medium;

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={`w-2 h-2 rounded-full ${config.color} animate-pulse-glow ${className}`}
      title={`${config.label} Priority`}
    />
  );
};

export default PriorityIndicator;