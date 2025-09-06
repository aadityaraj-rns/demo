const { Schema, model } = require("mongoose");

const historyFieldSchema = new Schema(
  {
    data: Number,
    date: Date,
  },
  { _id: false }
);

const pumpIotLiveDataSchema = new Schema(
  {
    device_id: { type: String, required: true, unique: true },
    device_data: {
      type: Object,
      required: true,
    },
    history: {
      type: Map,
      of: [historyFieldSchema],
      default: {},
    },
  },
  { timestamps: true }
);

// Pre-save hook to update history
pumpIotLiveDataSchema.pre("save", function (next) {
  const deviceData = this.device_data;
  const now = new Date();

  // Only keys you care about — extend as needed
  const keys = [
    "AS1",
    "AS2",
    "AS3",
    "BAT1",
    "BAT2",
    "BCH",
    "DLS",
    "OPR",
    "PLS",
    "PRS",
    "PS1",
    "PS2",
    "PS3",
    "PWR",
    "TS1",
    "TS2",
    "WLS",
    "WTP",
  ];

  keys.forEach((key) => {
    const newValue = deviceData[key];

    if (newValue !== undefined) {
      // Get existing history array or empty
      const historyArray = this.history.get(key) || [];

      const lastEntry = historyArray[historyArray.length - 1];

      if (!lastEntry || lastEntry.data !== newValue) {
        historyArray.push({
          data: newValue,
          date: now,
        });
        if (historyArray.length > 100) {
          historyArray.shift(); // removes the first (oldest) entry
        }
        this.history.set(key, historyArray); // Update map
      }
    }
  });

  next();
});

module.exports = model("PumpIOTLiveData", pumpIotLiveDataSchema);
