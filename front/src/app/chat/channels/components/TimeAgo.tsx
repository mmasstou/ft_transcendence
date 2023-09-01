import { formatDistanceToNow } from 'date-fns';
import React from 'react';

function TimeAgo({ timestamp }: { timestamp: string }) {

  const [formattedTimeAgo, setformattedTimeAgo] = React.useState<string | null>(null)

  React.useEffect(() => {
    const timeAgo = formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
    });
    setformattedTimeAgo(timeAgo)
  }, [])
  setInterval(() => {
    const timeAgo = formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
    });
    setformattedTimeAgo(timeAgo)
  }, 1000);
  if (!formattedTimeAgo) return;
  return <span className='text-[#929190]'>{formattedTimeAgo}</span>;
}

export default TimeAgo;