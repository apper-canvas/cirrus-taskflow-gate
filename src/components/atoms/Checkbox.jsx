import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
const Checkbox = ({ checked, onChange, disabled = false, className = '' }) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative w-5 h-5 rounded border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary/50 ${
        checked
          ? 'bg-accent border-accent'
          : 'bg-white border-gray-300 hover:border-gray-400'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      disabled={disabled}
    >
      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ 
              type: 'spring',
              stiffness: 300,
              damping: 20
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <ApperIcon name="Check" size={12} className="text-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default Checkbox;