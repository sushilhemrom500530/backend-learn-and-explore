import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

dayjs.extend(relativeTime);
dayjs.extend(utc);

export const formatJobEnhancement = (job: any) => {
  const now = dayjs.utc();
  const target = dayjs.utc(job.date_line);
  const createdAt = dayjs.utc(job.created_at);

  const diffMs = target.diff(now) > 0 ? target.diff(now) : 0;
  const totalSeconds = Math.floor(diffMs / 1000);

  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const countdown = `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
  const postedAgo = `Posted ${createdAt.fromNow()}`;

  return {
    ...job.toObject(),
    count_down: countdown,
    posted_ago: postedAgo,
  };
};

export const formatJobEnhancementForSingle = (job: any) => {
  const now = dayjs.utc();
  const target = dayjs.utc(job.date_line);
  const createdAt = dayjs.utc(job.created_at);

  const diffMs = Math.max(target.diff(now), 0);
  const totalSeconds = Math.floor(diffMs / 1000);

  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    ...job,
    count_down: `${days}d : ${hours}h : ${minutes}m : ${seconds}s`,
    posted_ago: `Posted ${createdAt.fromNow()}`,
  };
};
