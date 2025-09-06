const Joi = require("joi");
const User = require("../../models/user");
const RefreshToken = require("../../models/token");
const bcrypt = require("bcryptjs");
const UserDTO = require("../../dto/user");
const JWTService = require("../../services/JWTService");

const authController = {
  async authenticate(req, res, next) {
    // Define validation schema using Joi
    const authenticateSchema = Joi.object({
      loginID: Joi.string().required(),
      password: Joi.string().required(),
    });

    // Validate request body against the schema
    const { error } = authenticateSchema.validate(req.body);
    if (error) {
      return next({
        status: 400,
        message: "Validation Error: " + error.details[0].message,
      });
    }

    const { loginID, password } = req.body;

    try {
      // Check if the user exists in the database
      const partner = await User.findOne({ loginID, userType: "partner" });
      if (!partner) {
        return next({
          status: 400,
          message: "Invalid loginID, try again!",
        });
      }

      // Compare provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, partner.password);
      if (!isPasswordValid) {
        return next({
          status: 400,
          message: "Invalid Password",
        });
      }

      // Generate access token and refresh token
      const accessToken = JWTService.signAccessToken(
        { _id: partner._id },
        "1d"
      );
      const refreshToken = JWTService.signRefreshToken(
        { _id: partner._id },
        "2d"
      );

      // Update refresh token in the database
      await RefreshToken.updateOne(
        { _id: partner._id },
        { token: refreshToken },
        { upsert: true } // Create a new token if it doesn't exist
      );

      // Set tokens as HTTP-only cookies
      res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        sameSite: "None",
        secure: true, // Use secure cookies if using HTTPS
      });
      res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 48, // 2 days
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });

      // Prepare response data using a DTO
      const partnerDTO = new UserDTO(partner);

      // Send response
      return res.json({ partner: partnerDTO, auth: true });
    } catch (err) {
      // Catch any unexpected errors
      return next({
        status: 500,
        message: "An error occurred during authentication. Please try again.",
      });
    }
  },
};

module.exports = authController;
