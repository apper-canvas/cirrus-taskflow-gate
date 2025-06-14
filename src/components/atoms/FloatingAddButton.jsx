import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const FloatingAddButton = ({ onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-accent hover:bg-emerald-600 text-white rounded-full shadow-card hover:shadow-card-hover z-40 flex items-center justify-center transition-all duration-200"
    >
      <ApperIcon name="Plus" size={24} />
    </motion.button>
  );
};

export default FloatingAddButton;