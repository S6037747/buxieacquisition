// User model of needed data integrated with mongoose.

import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  industry: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  address: {
    street: String,
    city: String,
    zip: String,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  tags: {
    type: [String],
    default: [],
  },
  contactPerson: {
    name: String,
    phone: String,
    email: String,
  },
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      date: { type: String, required: true },
      comment: { type: String, required: true },
      replies: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          date: { type: String, required: true },
          reply: { type: String, required: true },
        },
      ],
    },
  ],
  interactions: [
    {
      method: { type: String, enum: ["phone", "email", "location"] },
      description: { type: String, required: true },
      date: { type: String, required: true },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  ],
  reminders: [
    {
      priority: { type: String, enum: ["low", "normal", "high", "urgent"] },
      description: { type: String, required: true },
      completed: { type: Boolean, required: true, default: false },
      dueDate: { type: Date, required: true },
      created: { type: Date, default: Date.now },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  ],
});

const companyModel =
  mongoose.models.company || mongoose.model("company", companySchema);

export default companyModel;
