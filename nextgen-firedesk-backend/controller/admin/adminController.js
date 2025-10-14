const Joi = require("joi");
const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const RefreshToken = require("../../models/token");
const UserDTO = require("../../dto/user");
const JWTService = require("../../services/JWTService");
const uploadOnCloudinary = require("../../utils/cloudinary");
const activityLogger = require("../../services/activityLogger");

// Add these imports for the dashboard counts
const Industry = require("../../models/admin/masterData/Industry");
const Plant = require("../../models/organization/plant/Plant");
const Manager = require("../../models/organization/manager/Manager");
const Technician = require("../../models/organization/technician/Technician");

const adminController = {
  // Create first admin
  async adminCreate(req, res, next) {
    try {
      const { name, phone, email, password } = req.body;
      if (!name || !email || !password)
        return next({ status: 400, message: "name, email and password required" });

      const existing = await User.findOne({ where: { email } });
      if (existing) return next({ status: 400, message: "User with this email already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        userType: "admin",
        name,
        phone,
        email,
        password: hashedPassword,
        displayName: name,
      });

      return res.json({ admin: new UserDTO(newUser) });
    } catch (error) {
      return next(error);
    }
  },

  // Login
  async login(req, res, next) {
    try {
      const schema = Joi.object({ email: Joi.string().email().required(), password: Joi.string().required() });
      const { error } = schema.validate(req.body);
      if (error) return next(error);

      const { email, password } = req.body;
      const admin = await User.findOne({ where: { email } });
      if (!admin) return next({ status: 400, message: "Invalid email" });

      const match = await bcrypt.compare(password, admin.password);
      if (!match) return next({ status: 400, message: "Invalid password" });

      const accessToken = JWTService.signAccessToken({ _id: admin.id }, "1d");
      const refreshToken = JWTService.signRefreshToken({ _id: admin.id }, "2d");

      await RefreshToken.upsert({ userId: admin.id, token: refreshToken });

      const isProd = process.env.NODE_ENV === "production";
      res.cookie("accessToken", accessToken, { maxAge: 86400000, httpOnly: true, sameSite: isProd ? "None" : "Lax", secure: isProd });
      res.cookie("refreshToken", refreshToken, { maxAge: 172800000, httpOnly: true, sameSite: isProd ? "None" : "Lax", secure: isProd });

      // Log login activity ONLY for admin users
      if (admin.userType === 'admin' || admin.roleType === 'admin') {
        await activityLogger.log({
          action: 'login',
          entityType: 'user',
          entityId: admin.id,
          entityName: admin.name,
          user: admin,
          description: `${admin.name} logged into the system`,
          ipAddress: req.ip,
        });
      }

      return res.json({ admin: new UserDTO(admin), auth: true, accessToken, refreshToken });
    } catch (err) {
      return next(err);
    }
  },

  // Logout
  async logout(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (refreshToken) await RefreshToken.destroy({ where: { token: refreshToken } });
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.status(200).json({ admin: null, auth: false });
    } catch (err) {
      return next(err);
    }
  },

  // Get admin profile
  async getAdminProfile(req, res, next) {
    try {
      const admin = await User.findOne({ where: { userType: "admin" } });
      return res.json({ admin: new UserDTO(admin) });
    } catch (error) {
      return next(error);
    }
  },

  // Edit admin - FIXED VERSION
  async editAdmin(req, res, next) {
    try {
      console.log('📥 Edit Admin Request:', req.body);
      
      const { userType, name, displayName, phone, email, currentPassword, newPassword } = req.body;
      const files = req.files || {};
      const profilePath = files.profile ? files.profile[0].path : undefined;

      let profileUrl;
      if (profilePath) {
        profileUrl = (await uploadOnCloudinary(profilePath))?.secure_url;
      }

      // FIX: Find admin by email only, not by userType + email
      const admin = await User.findOne({ where: { email } });
      if (!admin) {
        console.log('❌ Admin not found with email:', email);
        return next({ status: 400, message: "Admin not found" });
      }

      console.log('✅ Admin found:', admin.id, 'UserType:', admin.userType);

      // FIX: Check if user is actually an admin
      if (admin.userType !== 'admin') {
        console.log('❌ User is not an admin:', admin.userType);
        return next({ status: 403, message: "Access denied" });
      }

      if (currentPassword && newPassword) {
        console.log('🔐 Password change requested');
        console.log('Current password provided:', !!currentPassword);
        console.log('New password provided:', !!newPassword);
        
        const match = await bcrypt.compare(currentPassword, admin.password);
        console.log('🔑 Password match:', match);
        
        if (!match) {
          console.log('❌ Current password does not match');
          return next({ status: 400, message: "Invalid current password" });
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.update(
          { 
            name, 
            phone, 
            displayName, 
            profile: profileUrl || admin.profile, 
            password: hashedPassword 
          }, 
          { where: { id: admin.id } }
        );
        console.log('✅ Password updated successfully');
      } else {
        console.log('📝 Updating profile without password change');
        await User.update(
          { 
            name, 
            displayName, 
            profile: profileUrl || admin.profile, 
            phone 
          }, 
          { where: { id: admin.id } }
        );
      }

      const updated = await User.findByPk(admin.id);
      console.log('✅ Profile update completed');
      return res.json({ admin: new UserDTO(updated), auth: true });
    } catch (err) {
      console.error('❌ Error in editAdmin:', err);
      return next(err);
    }
  },

  // Refresh tokens
  async refresh(req, res, next) {
    try {
      const originalRefreshToken = req.cookies?.refreshToken;
      if (!originalRefreshToken) return next({ status: 400, message: "Unauthorized" });

      const id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
      const match = await RefreshToken.findOne({ where: { userId: id, token: originalRefreshToken } });
      if (!match) return next({ status: 400, message: "Unauthorized" });

      const accessToken = JWTService.signAccessToken({ _id: id }, "10d");
      const refreshToken = JWTService.signRefreshToken({ _id: id }, "20d");

      await RefreshToken.update({ token: refreshToken }, { where: { userId: id } });

      const isProd = process.env.NODE_ENV === "production";
      res.cookie("accessToken", accessToken, { maxAge: 864000000, httpOnly: true, sameSite: isProd ? "None" : "Lax", secure: isProd });
      res.cookie("refreshToken", refreshToken, { maxAge: 1728000000, httpOnly: true, sameSite: isProd ? "None" : "Lax", secure: isProd });

      const user = await User.findByPk(id);
      return res.status(200).json({ admin: new UserDTO(user), auth: true, accessToken, refreshToken });
    } catch (err) {
      return next(err);
    }
  },

  // Dashboard - UPDATED VERSION
  async dashboard(req, res, next) {
    try {
      const orgUserId = req.user.id;

      console.log('📊 Loading dashboard for orgUserId:', orgUserId);

      // Get counts using Sequelize
      const totalIndustries = await Industry.count({
        where: { status: 'Active' }
      });

      const totalPlants = await Plant.count({
        where: { 
          orgUserId: orgUserId,
          status: 'Active'
        }
      });

      const totalManagers = await Manager.count({
        where: { orgUserId: orgUserId }
      });

      const totalTechnicians = await Technician.count({
        where: { orgUserId: orgUserId }
      });

      console.log('📈 Dashboard counts:', {
        totalIndustries,
        totalPlants,
        totalManagers,
        totalTechnicians
      });

      // Get recent activities (placeholder - you can customize this based on your needs)
      const recentActivities = [
        {
          id: '1',
          action: 'System Initialized',
          description: 'FireDesk system is running successfully',
          timestamp: new Date().toISOString(),
          type: 'System'
        },
        {
          id: '2',
          action: 'Dashboard Accessed',
          description: 'Admin accessed the dashboard overview',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          type: 'Access'
        },
        {
          id: '3',
          action: 'Data Loaded',
          description: 'Dashboard statistics loaded successfully',
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          type: 'Info'
        }
      ];

      return res.json({
        totalIndustries,
        totalPlants,
        totalManagers,
        totalTechnicians,
        recentActivities,
        success: true
      });
    } catch (error) {
      console.error('❌ Dashboard error:', error);
      return next(error);
    }
  },
};

module.exports = adminController;