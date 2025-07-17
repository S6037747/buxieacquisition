import cron from "node-cron";
import transporter from "../config/nodemailer.js";
import companyModel from "../models/companyModel.js";
import userModel from "../models/userModel.js";
import { EMAIL_REMINDER_TEMPLATE } from "../config/emailTemplates.js";

console.log("Cronjob started, looking out for overdue reminders!");

cron.schedule("01 20 * * *", async () => {
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

  for (const reminder of allReminders) {
    const user = await userModel.findById(reminder.userId);
    if (!user) {
      return console.log(
        "User does not exist anymore (" + reminder.userId + ")"
      );
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
      console.log("email sent");
    }
  }
  console.log("Email sequence ran! See you in 24 hours!");
});
