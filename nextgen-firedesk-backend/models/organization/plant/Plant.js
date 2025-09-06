const { Schema, default: mongoose } = require("mongoose");

const plantSchema = new Schema(
  {
    plantId: String,
    orgUserId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    pumpIotDeviceId: { type: String, reqired: false },
    plantName: { type: String, required: true },
    address: { type: String, required: true },
    cityId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "City",
      required: true,
    },
    managerId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Manager",
      required: false,
    },
    plantImage: { type: String, required: false },
    headerPressure: String,
    mainWaterStorage: String,
    primeWaterTankStorage: String,
    dieselStorage: String,
    pressureUnit: String,
    layouts: [
      {
        layoutName: { type: String, required: false },
        layoutImage: { type: String, required: false },
        markers: {
          type: [
            {
              assetId: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "Asset",
                required: true,
              },
              x: { type: String, required: true },
              y: { type: String, required: true },
            },
          ],
          required: false,
        },
      },
    ],
    status: { type: String, enum: ["Active", "Deactive"], default: "Active" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Plant", plantSchema, "plants");
