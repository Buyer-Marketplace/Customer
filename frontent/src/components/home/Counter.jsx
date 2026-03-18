import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const Counter = ({ end, label, duration = 4, suffix = "+" }) => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-green-400">
        {inView ? (
          <CountUp 
            end={end} 
            duration={duration} 
            separator=","
            suffix={suffix}
            start={0}
            useEasing={true}
          />
        ) : (
          `0${suffix}`
        )}
      </div>
      <div className="text-sm font-medium text-green-200 mt-2 tracking-wider">{label}</div>
    </div>
  );
};

export default Counter;