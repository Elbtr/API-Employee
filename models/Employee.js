const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a valid name"],
    },
    status: {
      type: String,
      enum: ["contract", "permanent"],
      default: "contract",
    },
    divisi: {
      type: [String],
      required: [true, "Please provide a valid divisi"],
    },
    deuDate: {
      startDate: {
        type: String,
        default: Date.now(),
      },
      endDate: {
        type: String,
        default: Date.now(),
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", EmployeeSchema);
