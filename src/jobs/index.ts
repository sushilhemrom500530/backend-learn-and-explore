import cron from "node-cron";

const startServiceExpiryCron = () => {
  // Cron job to expire services every 1 hour
  cron.schedule("*/10 * * * *", async () => {
    // try {
    //   const now = new Date();

    //   const result = await Jobs.updateMany(
    //     {
    //       expiredAt: { $lt: now },
    //       status: "active",
    //     },
    //     {
    //       $set: { status: "expired" },
    //     },
    //   );

    //   if (result.modifiedCount > 0) {
    //     console.log(
    //       `Cron Job: Expired ${result.modifiedCount} services at ${now.toISOString()}`,
    //     );
    //   }
    // } catch (err) {
    //   console.error("Error running service expiry cron job:", err);
    // }
  });

  console.log("Service expiry cron job started.");
};

export const startJob = () => {
  startServiceExpiryCron();
};
