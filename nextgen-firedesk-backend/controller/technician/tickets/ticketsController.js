const Joi = require("joi");
const Ticket = require("../../../models/organization/ticket/Ticket");
const FormResponse = require("../../../models/technician/FormResponse/FormResponse");
const TicketResponse = require("../../../models/organization/ticket/TicketResponse");
const uploadOnCloudinary = require("../../../utils/cloudinary");
const Asset = require("../../../models/organization/asset/Asset");
const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const technicianTicketsController = {
  // async getAllTickets(req, res, next) {
  //   try {
  //     const technicianUserId = req.user._id;
  //     const tickets = await Ticket.find().populate({
  //       path: "assetsId",
  //       match: { technicianUserId },
  //       select: "technicianUserId",
  //     });
  //     const filteredTickets = tickets.filter(
  //       (ticket) => ticket.assetsId.length > 0
  //     );

  //     return res.json({ tickets: filteredTickets });
  //   } catch (error) {
  //     return next(error);
  //   }
  // },

  async incompletedTicketService(req, res, next) {
    const incompletedTicketServiceSchema = Joi.object({
      technicianUserId: Joi.string().pattern(mongodbIdPattern).required(),
      plantId: Joi.string().pattern(mongodbIdPattern).required(),
    });

    const { error } = incompletedTicketServiceSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { technicianUserId, plantId } = req.body;

    try {
      const today = new Date();

      const tickets = await Ticket.find({
        plantId,
        completedStatus: "Pending",
        targetDate: { $lt: today },
      }).populate({
        path: "assetsId",
        match: { technicianUserId },
        select: "technicianUserId",
        populate: [
          {
            path: "technicianUserId",
            select: "name", // Assuming "name" is the field that contains the technician's name
          },
          {
            path: "productId",
            select: "productName",
          },
        ],
      });
      const incompletedTickets = tickets.filter(
        (ticket) => ticket.assetsId.length > 0
      );
      return res.json({ incompletedTickets });
    } catch (error) {
      return next(error);
    }
  },

  async upcomingTicketService(req, res, next) {
    const upcomingTicketServiceSchema = Joi.object({
      technicianUserId: Joi.string().pattern(mongodbIdPattern).required(),
      plantId: Joi.string().pattern(mongodbIdPattern).required(),
    });

    const { error } = upcomingTicketServiceSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { technicianUserId, plantId } = req.body;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // const upcomingTickets = await Ticket.find({
      //   technicianUserId,
      //   plantId,
      //   completedStatus: "Pending",
      //   targetDate: { $gte: today },
      // }).populate({
      //   path: "assetsId",
      //   populate: {
      //     path: "productId",
      //   },
      //   select: "_id productId",
      // });
      const tickets = await Ticket.find({
        plantId,
        completedStatus: "Pending",
        targetDate: { $gte: today },
      }).populate({
        path: "assetsId",
        match: { technicianUserId },
        select: "technicianUserId",
        populate: [
          {
            path: "technicianUserId",
            select: "name", // Assuming "name" is the field that contains the technician's name
          },
          {
            path: "productId",
            select: "productName",
          },
        ],
      });
      const upcomingTickets = tickets.filter(
        (ticket) => ticket.assetsId.length > 0
      );
      return res.json({ upcomingTickets });
    } catch (error) {
      return next(error);
    }
  },

  async getTicketDetailsById(req, res, next) {
    const getTicketsSchema = Joi.object({
      ticketId: Joi.string().pattern(mongodbIdPattern).required(),
    });

    const { error } = getTicketsSchema.validate(req.params);

    if (error) {
      return next(error);
    }

    const ticketId = req.params.ticketId;

    try {
      // Find the ticket by ID and ensure it has a matching technicianUserId in its assets
      const ticket = await Ticket.findOne({ _id: ticketId }).populate([
        {
          path: "assetsId",
          select: "assetId",
        },
        {
          path: "plantId",
          select: "plantName",
        },
      ]);

      // If no matching assets are found, ticket.assetsId will be an empty array, so handle that case
      if (!ticket || ticket.assetsId.length === 0) {
        return res.status(404).json({ message: "Ticket not found." });
      }

      return res.json({ ticket });
    } catch (error) {
      return next(error);
    }
  },

  async getTicketsByStatus(req, res, next) {
    const getTicketsSchema = Joi.object({
      status: Joi.string()
        .valid(
          "Open", // New combined status
          "Rejected",
          "Waiting for approval",
          "Completed"
        )
        .required(),
      plantId: Joi.string().pattern(mongodbIdPattern).required(),
    });

    const { error } = getTicketsSchema.validate(req.params);

    if (error) {
      return next(error);
    }

    const { status, plantId } = req.params;
    const technicianUserId = req.user._id;

    // Set today's date to 00:00:00 to compare only the date part
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset the time to 00:00:00

    try {
      // Step 1: Fetch tickets based on plantId and targetDate
      let ticketQuery = { plantId };

      if (status === "Open") {
        ticketQuery.targetDate = { $exists: true }; // Include all tickets with any targetDate
      }

      // Fetching tickets
      const tickets = await Ticket.find(ticketQuery)
        .populate({
          path: "assetsId",
          match: { technicianUserId },
          select:
            "model slNo moc fuelCapacity healthStatus tag lastServiceDate nextServiceDate assetId",
        })
        .then((result) => {
          return result.filter(
            (ticket) => ticket.assetsId && ticket.assetsId.length > 0
          );
        });

      // Step 2: Fetch TicketResponse records based on the status
      let ticketResponseQuery = { plantId, technicianId: technicianUserId };

      if (status === "Waiting for approval") {
        ticketResponseQuery.status = "Waiting for approval";
      } else if (status === "Rejected") {
        ticketResponseQuery.status = "Rejected";
      } else if (status === "Completed") {
        ticketResponseQuery.status = "Completed";
      }

      // Fetch TicketResponses
      const ticketResponses = await TicketResponse.find(ticketResponseQuery)
        .populate("technicianId", "name")
        .populate("assetsId", "model slNo")
        .lean();

      // Step 3: Create a map for responses by ticketId and assetId
      const responseMap = new Map();
      ticketResponses.forEach((response) => {
        const assetId = response.assetsId?._id.toString();
        const ticketId = response.ticketId.toString();
        const key = `${ticketId}_${assetId}`; // Map by both ticketId and assetId
        responseMap.set(key, response);
      });

      // Step 4: Flatten the tickets and include relevant ticketResponse if available
      const flattenedTickets = tickets.flatMap((ticket) =>
        ticket.assetsId.map((asset) => {
          const assetId = asset._id.toString();
          const ticketId = ticket._id.toString();
          const key = `${ticketId}_${assetId}`;
          const ticketResponse = responseMap.get(key); // Find the response by ticketId and assetId

          // Logic to filter tickets based on the current status
          if (
            status == "Open" &&
            ticketResponse &&
            ["Rejected", "Completed", "Waiting for approval"].includes(
              ticketResponse.status
            )
          ) {
            // Skip assets that already have a completed or rejected response
            return null;
          }

          if (
            (status === "Waiting for approval" ||
              status === "Rejected" ||
              status === "Completed") &&
            (!ticketResponse || ticketResponse.status !== status)
          ) {
            // Skip assets that don't have the matching TicketResponse for the specific status
            return null;
          }
          return {
            _id: ticket._id,
            orgUserId: ticket.orgUserId,
            ticketId: ticket.ticketId,
            plantId: ticket.plantId,
            assetId: asset.assetId,
            assetsId: asset._id,
            assetDetails: {
              model: asset.model,
              slNo: asset.slNo,
              moc: asset.moc,
              fuelCapacity: asset.fuelCapacity,
              healthStatus: asset.healthStatus,
              tag: asset.tag,
              lat: asset.lat ? asset.lat : null,
              long: asset.long ? asset.long : null,
              lastServiceDate: asset.lastServiceDate,
              nextServiceDate: asset.nextServiceDate,
            },
            technician: ticketResponse ? ticketResponse.technicianId : null,
            ticketResponse: ticketResponse
              ? {
                  _id: ticketResponse._id,
                  status: ticketResponse.status,
                  technicianRemark: ticketResponse.technicianRemark,
                  questions: ticketResponse.questions,
                  images: ticketResponse.images,
                  managerRemark: ticketResponse.managerRemark,
                }
              : null,
            taskNames: ticket.taskNames,
            taskDescription: ticket.taskDescription,
            targetDate: ticket.targetDate,
            ticketType: ticket.ticketType,
            completedStatus: ticket.completedStatus,
          };
        })
      );

      // Filter out any null values (where tickets were skipped)
      const filteredTickets = flattenedTickets.filter(
        (ticket) => ticket !== null
      );

      return res.json({ tickets: filteredTickets });
    } catch (error) {
      console.error("Error fetching tickets: ", error);
      return next(error);
    }
  },
  async StoreTicketResponse(req, res, next) {
    // Validate the request body
    const ticketCreateSchema = Joi.object({
      ticketId: Joi.string().pattern(mongodbIdPattern).required(),
      plantId: Joi.string().pattern(mongodbIdPattern).required(),
      assetsId: Joi.string().pattern(mongodbIdPattern).required(),
      technicianId: Joi.string().pattern(mongodbIdPattern).required(),
      status: Joi.string().required(),
      remark: Joi.string().allow("").optional(),
      questions: Joi.array()
        .items(
          Joi.object({
            question: Joi.string().required(),
            answer: Joi.string().allow("").optional(),
            note: Joi.string().allow("").optional(),
          })
        )
        .optional(),
      geoCheck: Joi.string().required(),
    });

    // Parse the questions field if it exists
    const questions = req.body.questions ? JSON.parse(req.body.questions) : [];

    // Update req.body with parsed questions
    req.body.questions = questions;

    // Validate the data
    const { error } = ticketCreateSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    // Extract files and process them
    let ticketimage1,
      ticketimage2,
      ticketimage3 = "";

    if (req.files?.ticketimage1) {
      const ticketimage1Path = req.files.ticketimage1[0].path;
      try {
        const uploadResult = await uploadOnCloudinary(ticketimage1Path);
        ticketimage1 = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Error uploading ticketimage1:", uploadError);
      }
    }

    if (req.files?.ticketimage2) {
      const ticketimage2Path = req.files.ticketimage2[0].path;
      try {
        const uploadResult = await uploadOnCloudinary(ticketimage2Path);
        ticketimage2 = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Error uploading ticketimage2:", uploadError);
      }
    }

    if (req.files?.ticketimage3) {
      const ticketimage3Path = req.files.ticketimage3[0].path;
      try {
        const uploadResult = await uploadOnCloudinary(ticketimage3Path);
        ticketimage3 = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Error uploading ticketimage2:", uploadError);
      }
    }

    try {
      const asset = await Asset.findById(req.body.assetsId).select("lat long");

      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }

      // if (!asset.lat || !asset.long) {
      //   if (!req.body.lat || !req.body.long) {
      //     return res.status(403).json({ message: "lat and long are required" });
      //   }

      //   asset.lat = req.body.lat;
      //   asset.long = req.body.long;
      //   await asset.save();
      // }

      // Create new ticket response
      const newTicketResponse = {
        ticketId: req.body.ticketId,
        plantId: req.body.plantId,
        assetsId: req.body.assetsId,
        technicianId: req.body.technicianId,
        status: req.body.status,
        geoCheck: req.body.geoCheck,
        technicianRemark: req.body.remark,
        questions: req.body.questions,
        images: {
          ticketimage1: ticketimage1,
          ticketimage2: ticketimage2,
          ticketimage3: ticketimage3,
        },
      };

      const ticketResponse = new TicketResponse(newTicketResponse);
      await ticketResponse.save();
      return res.status(201).json({
        message: "Ticket response saved successfully",
        ticketResponse,
      });
    } catch (error) {
      return next(error);
    }
  },
  async getTicketResponseById(req, res, next) {
    const responseId = req.params.responseId;
    try {
      const ticket = await TicketResponse.findOne({ _id: responseId })
        .populate({
          path: "plantId",
          select: "_id plantName address",
        })
        .populate({
          path: "assetsId",
          select: "_id model assetId",
          populate: [
            {
              path: "productId",
              select: "_id description",
            },
          ],
        })
        .populate({
          path: "technicianId",
          select: "_id name",
        });

      // Check if ticket is found
      if (!ticket) {
        return res.status(404).json({ message: "Ticket Response not found." });
      }
      return res.json({ ticketResponse: ticket });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = technicianTicketsController;
