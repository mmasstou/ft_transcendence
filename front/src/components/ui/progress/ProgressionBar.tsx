import React, { FC, useEffect } from 'react';
import * as Progress from '@radix-ui/react-progress';

type ProgressProps = {
  initValue: number;
  currentValue: number;
  className?: string;
};

const ProgressionBar: FC<ProgressProps> = ({ initValue, currentValue }) => {
  const [progress, setProgress] = React.useState(initValue);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(currentValue), 500);
    return () => clearTimeout(timer);
  }, [currentValue]);

  return (
    <Progress.Root
      className="relative overflow-hidden border border-secondary rounded-full w-32 sm:w-52 md:w-96 h-4 lg:h-5"
      style={{
        transform: 'translateZ(0)',
      }}
      value={progress}
    >
      <Progress.Indicator
        className="bg-secondary w-full h-full transition-transform duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)]"
        style={{ transform: `translateX(-${100 - progress}%)` }}
      />
    </Progress.Root>
  );
};

export default ProgressionBar;
