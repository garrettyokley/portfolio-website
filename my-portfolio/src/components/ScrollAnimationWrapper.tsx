'use client';

import { motion, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import React from 'react';

interface ScrollAnimationWrapperProps {
  children: React.ReactNode;
  className?: string;
  animationVariants: Variants;
  initial?: string;
  animate?: string;
  transition?: object;
}

const ScrollAnimationWrapper: React.FC<ScrollAnimationWrapperProps> = ({
  children,
  className,
  animationVariants,
  initial = 'hidden',
  animate = 'visible',
  transition = { duration: 0.5 },
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={inView ? animate : initial}
      variants={animationVariants}
      transition={transition}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimationWrapper; 