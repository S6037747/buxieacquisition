import logModel from "../backend/models/logModel";

const log = new logModel({
  type: "Automated",
  description:
    "Succesfully created a backup and deleted any backups older then 12 weeks.",
});
