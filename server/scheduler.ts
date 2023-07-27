import * as cronJob from "node-cron";

export const initScheduledJobs = () => {
  const scheduledJobFunction = cronJob.schedule("*/1 * * * *", () => {
    console.log("Starting check hackerNes => Discord");
    // - intaract with HN API
    // - send nofitication to Discord
    
  });

  scheduledJobFunction.start();
}
