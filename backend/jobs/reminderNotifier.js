import cron from "node-cron";
import transporter from "../config/nodemailer.js";
import companyModel from "../models/companyModel.js";
import userModel from "../models/userModel.js";
import { EMAIL_REMINDER_TEMPLATE } from "../config/emailTemplates.js";
import logModel from "../models/logModel.js";

const log = new logModel({
  type: "Automated",
  description: `Cronjob started, will send reminders regarding overdue reminders.`,
});

log.save();

cron.schedule("* * * * *", async () => {
  const companies = await companyModel.find();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  const allReminders = companies.flatMap((company) =>
    company.reminders
      .filter(
        (reminder) =>
          reminder.completed === false &&
          new Date(reminder.dueDate) >= todayStart &&
          new Date(reminder.dueDate) < todayEnd
      )
      .map((reminder) => ({
        description: reminder.description,
        dueDate: reminder.dueDate,
        userId: reminder.userId,
        companyName: company.name,
        companyId: company._id,
      }))
  );
  console.log(`Found ${allReminders.length} reminders due today.`);

  const summary = {
    sentCount: 0,
    recipients: [],
  };

  for (const reminder of allReminders) {
    const user = await userModel.findById(reminder.userId);
    if (!user) {
      await new logModel({
        type: "Automated",
        method: "Post",
        description:
          "Reminder cannot be send. User does not exist anymore (" +
          reminder.userId +
          ")",
      }).save();
    } else {
      const formattedDate = new Date(reminder.dueDate).toLocaleDateString(
        "en-GB"
      );
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Overdue reminder",
        html: EMAIL_REMINDER_TEMPLATE.replace("{{name}}", user.name)
          .replace("{{companyName}}", reminder.companyName)
          .replace("{{dueDate}}", formattedDate)
          .replace("{{description}}", reminder.description),
      };

      await transporter.sendMail(mailOptions);
      summary.sentCount += 1;
      summary.recipients.push(user.email);
    }
  }
  await new logModel({
    type: "Automated",
    method: "Post",
    description: `Summary: ${
      summary.sentCount
    } reminder mail(s) sent. Recipients: ${summary.recipients.join(", ")}`,
  }).save;
});
