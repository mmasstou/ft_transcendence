import { formatDistanceToNow } from 'date-fns';

function TimeAgo({ timestamp } : {timestamp : string}) {
  const formattedTimeAgo = formatDistanceToNow(new Date(timestamp), {
    addSuffix: true,
  });

  return <span className='text-[#929190]'>{formattedTimeAgo}</span>;
}

export default TimeAgo;