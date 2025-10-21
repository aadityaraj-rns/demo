// Create admin user
const bcrypt = require('bcryptjs');
const { sequelize } = require('./database/index');
const { User, Role } = require('./models/index');

async function createAdmin() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    // Find Admin role
    const adminRole = await Role.findOne({ where: { name: 'Admin' } });
    if (!adminRole) {
      console.error('Admin role not found');
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin', 10);

    // Create admin user
    const admin = await User.create({
      userType: 'admin',
      name: 'Admin User',
      email: 'admin@firedesk.com',
      password: hashedPassword,
      roleId: adminRole.id,
      isActive: true,
      isVerified: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@firedesk.com');
    console.log('Password: admin');
    console.log('User ID:', admin.id);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
}

createAdmin();
