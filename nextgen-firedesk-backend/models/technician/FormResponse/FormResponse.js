const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    note: String,
  },
  { _id: false }
);

const pumpDetailsSchema = new mongoose.Schema({
  pumpType: {
    type: String,
    enum: [
      "ELECTRICAL DRIVEN",
      "DIESEL ENGINE",
      "JOCKEY",
      "BOOSTER",
      "BOOSTER PUMP",
      "TERRACE PUMP",
      "OTHER",
    ],
  },
  pumpStatus: {
    type: String,
    enum: ["AUTO", "MANUAL", "OFF CONDITION"],
  },
  pumpSequentialOperationTest: {
    type: String,
    enum: ["START", "CUTOFF", ""],
    default: "",
  },
  suctionPressure: {
    type: Number,
  },
  pressureSwitchCondition: {
    type: String,
    enum: ["OPEN", "CLOSE"],
  },
  dischargePressureGaugeReading: {
    type: Number,
  },
  dieselLevel: {
    type: String,
    enum: ["FULL", "HALF", "NEED RE-FUEL"],
  },
  waterStorageLevel: {
    type: String,
    enum: ["FULL", "HALF", "NEED RE-FUEL"],
  },
  batteryStatusReading: {
    type: Number,
  },
  installationDate: {
    type: Date,
    default: Date.now,
  },
});

const rejectedLogSchema = new mongoose.Schema(
  {
    geoCheck: String,
    reportNo: String,
    // orgUserId: {
    //   type: mongoose.SchemaTypes.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    // technicianUserId: {
    //   type: mongoose.SchemaTypes.ObjectId,
    //   ref: "User",
    //   required: false,
    // },
    // plantId: {
    //   type: mongoose.SchemaTypes.ObjectId,
    //   ref: "Plant",
    //   required: true,
    // },
    pumpDetails: pumpDetailsSchema,
    managerRemark: {
      type: String,
      required: false,
    },
    technicianRemark: {
      type: String,
      required: false,
    },
    // assetId: {
    //   type: mongoose.SchemaTypes.ObjectId,
    //   ref: "Asset",
    //   required: true,
    // },
    statusUpdatedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: false,
    },
    images: [String],
    status: {
      type: String,
      enum: ["Waiting for approval", "Completed", "Rejected"],
    },
    // serviceName: String,
    sectionName: String,
    // serviceType: {
    //   type: String,
    //   enum: ["inspection", "maintenance", "testing"],
    // },
    questions: [questionSchema],
  },
  {
    timestamps: true,
  }
);

const serviceFormSchema = new mongoose.Schema(
  {
    serviceTicketId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "ServiceTickets",
      required: false,
    },
    geoCheck: String,
    reportNo: String,
    sectionName: String,
    questions: [questionSchema],
    pumpDetails: pumpDetailsSchema,
    images: [String],
    status: {
      type: String,
      enum: ["Waiting for approval", "Completed", "Rejected", "Lapsed"],
      default: "Waiting for approval",
    },
    statusUpdatedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: false,
    },
    statusUpdatedAt: {
      type: Date,
      required: false,
    },
    managerRemark: {
      type: String,
      required: false,
    },
    technicianRemark: {
      type: String,
      required: false,
    },
    rejectedLogs: [rejectedLogSchema],
  },
  { timestamps: true }
);

serviceFormSchema.pre("save", async function (next) {
  if (this.isModified("status") && this.status == "Rejected") {
    this.rejectedLogs.push({
      geoCheck: this.geoCheck,
      // orgUserId: this.orgUserId,
      reportNo: this.reportNo,
      // plantId: this.plantId,
      // serviceName: this.serviceName,
      sectionName: this.sectionName,
      pumpDetails: this.pumpDetails,
      managerRemark: this.managerRemark,
      technicianRemark: this.technicianRemark,
      statusUpdatedBy: this.statusUpdatedBy,
      images: this.images,
      status: this.status,
      // serviceType: this.serviceType,
      // assetId: this.assetId,
      // technicianUserId: this.technicianUserId,
      questions: this.questions,
      statusUpdatedAt: new Date(),
    });
  }
  next();
});

serviceFormSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  const status = update.status;

  if (status === "Rejected") {
    const docToUpdate = await this.model.findOne(this.getQuery());

    if (docToUpdate) {
      const rejectedLog = {
        geoCheck: docToUpdate.geoCheck,
        // orgUserId: docToUpdate.orgUserId,
        reportNo: docToUpdate.reportNo,
        // plantId: docToUpdate.plantId,
        // serviceName: docToUpdate.serviceName,
        sectionName: docToUpdate.sectionName,
        pumpDetails: docToUpdate.pumpDetails,
        managerRemark: update.managerRemark || docToUpdate.managerRemark,
        technicianRemark:
          update.technicianRemark || docToUpdate.technicianRemark,
        statusUpdatedBy: update.statusUpdatedBy || docToUpdate.statusUpdatedBy,
        images: update.images || docToUpdate.images,
        status: "Rejected",
        // assetId: docToUpdate.assetId,
        // technicianUserId: docToUpdate.technicianUserId,
        // serviceType: docToUpdate.serviceType,
        questions: docToUpdate.questions,
        statusUpdatedAt: new Date(),
      };

      update.$push = update.$push || {};
      update.$push.rejectedLogs = rejectedLog;
    }
  }
  next();
});

const FormResponse = mongoose.model("FormResponse", serviceFormSchema);

module.exports = FormResponse;
