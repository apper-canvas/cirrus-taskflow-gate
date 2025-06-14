import { motion } from 'framer-motion';

const SkeletonLoader = ({ type = 'default', count = 1 }) => {
  const baseClasses = 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded';

  const renderSkeleton = (index) => {
    switch (type) {
      case 'tasks':
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 shadow-card mb-3"
          >
            <div className="flex items-start space-x-3">
              <div className={`w-5 h-5 ${baseClasses}`} />
              <div className="flex-1 space-y-2">
                <div className={`h-4 ${baseClasses} w-3/4`} />
                <div className={`h-3 ${baseClasses} w-1/2`} />
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${baseClasses}`} />
                  <div className={`h-3 ${baseClasses} w-16`} />
                  <div className={`h-3 ${baseClasses} w-20`} />
                </div>
              </div>
            </div>
          </motion.div>
        );
      
      case 'sidebar':
        return (
          <div key={index} className="space-y-4">
            <div className={`h-6 ${baseClasses} w-3/4`} />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${baseClasses}`} />
                <div className={`h-4 ${baseClasses} w-2/3`} />
              </div>
            ))}
          </div>
        );
      
      case 'search':
        return (
          <div key={index} className={`h-10 ${baseClasses} w-full`} />
        );
      
      default:
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`h-20 ${baseClasses} mb-4`}
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => renderSkeleton(index))}
    </div>
  );
};

export default SkeletonLoader;