'use strict';

/**
 * Dependencies
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const debug = require('util').debuglog('ecommerce');

/**
 * MongoDB Connection Module for E-Commerce Application
 *
 * This module handles all database connection logic, user authentication,
 * and provides query helper methods for the e-commerce platform.
 *
 * #### Example:
 *
 *   const db = require('./dbConnection');
 *   await db.connect();
 *   const user = await db.findUserByEmail('admin@admin.com');
 *
 * @module dbConnection
 * @requires mongoose
 * @requires bcryptjs
 * @requires jsonwebtoken
 * @api public
 */

// ============================================================
// CONFIGURATION
// ============================================================

/**
 * Database configuration options
 *
 * #### Options:
 *
 * - `MONGO_URI` - MongoDB connection string (local or Atlas)
 * - `JWT_SECRET` - Secret key for signing JSON Web Tokens
 * - `JWT_EXPIRES_IN` - Token expiration duration
 * - `BCRYPT_SALT_ROUNDS` - Number of salt rounds for password hashing
 *
 * @type {Object}
 * @api private
 */
const config = {
    MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce',
    JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_key_change_in_production',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
    BCRYPT_SALT_ROUNDS: 10
};

// ============================================================
// SCHEMA DEFINITIONS
// ============================================================

/**
 * User Schema Definition
 *
 * Defines the structure of User documents stored in MongoDB.
 * Passwords are stored as bcrypt hashes, never in plain text.
 *
 * #### Schema Fields:
 *
 * - `name`     {String}  - Full name of the user (required, trimmed)
 * - `email`    {String}  - Email address (required, unique, lowercase)
 * - `password` {String}  - Bcrypt hashed password (required)
 * - `role`     {String}  - User role: 'user' or 'admin' (default: 'user')
 *
 * #### Example:
 *
 *   const user = new User({
 *     name: 'John Doe',
 *     email: 'john@example.com',
 *     password: '$2a$10$hashedPasswordHere',
 *     role: 'user'
 *   });
 *
 * @see mongoose.Schema
 * @api public
 */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'admin'],
            message: 'Role must be either user or admin'
        },
        default: 'user'
    }
}, {
    timestamps: true,
    collection: 'users'
});

/**
 * User Model
 *
 * Mongoose model compiled from the userSchema.
 * Provides methods for CRUD operations on the users collection.
 *
 * #### Example:
 *
 *   // Find all users
 *   const users = await User.find({});
 *
 *   // Find user by email
 *   const user = await User.findOne({ email: 'admin@admin.com' });
 *
 *   // Count total users
 *   const count = await User.countDocuments({});
 *
 * @type {mongoose.Model}
 * @api public
 */
const User = mongoose.model('User', userSchema);

// ============================================================
// DATABASE CONNECTION
// ============================================================

/**
 * Establishes a connection to the MongoDB database.
 *
 * Uses the connection URI from `config.MONGO_URI` which defaults
 * to a local MongoDB instance at `mongodb://127.0.0.1:27017/ecommerce`.
 *
 * #### Connection Events:
 *
 * - `connected`    - Successfully connected to MongoDB
 * - `error`        - Connection error occurred
 * - `disconnected` - Connection was lost
 *
 * #### Example:
 *
 *   const db = require('./dbConnection');
 *
 *   // Basic connection
 *   await db.connect();
 *
 *   // Connection with error handling
 *   try {
 *     await db.connect();
 *     console.log('Database ready');
 *   } catch (err) {
 *     console.error('Connection failed:', err.message);
 *     process.exit(1);
 *   }
 *
 * @returns {Promise<mongoose.Connection>} The mongoose connection instance
 * @throws {Error} If connection to MongoDB fails
 * @api public
 */
async function connect() {
    try {
        await mongoose.connect(config.MONGO_URI);

        const connection = mongoose.connection;

        connection.on('connected', () => {
            debug('MongoDB connected successfully to:', config.MONGO_URI);
        });

        connection.on('error', (err) => {
            debug('MongoDB connection error:', err);
        });

        connection.on('disconnected', () => {
            debug('MongoDB disconnected');
        });

        console.log('Successfully connected to MongoDB.');
        console.log('Database:', connection.db.databaseName);
        console.log('Host:', connection.host);
        console.log('Port:', connection.port);

        return connection;
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message);
        throw err;
    }
}

/**
 * Closes the MongoDB connection gracefully.
 *
 * Should be called when the application is shutting down
 * to ensure all pending operations are completed.
 *
 * #### Example:
 *
 *   // Graceful shutdown
 *   process.on('SIGINT', async () => {
 *     await db.disconnect();
 *     process.exit(0);
 *   });
 *
 * @returns {Promise<void>}
 * @api public
 */
async function disconnect() {
    try {
        await mongoose.disconnect();
        console.log('MongoDB connection closed.');
    } catch (err) {
        console.error('Error closing MongoDB connection:', err.message);
        throw err;
    }
}

/**
 * Returns the current connection status.
 *
 * #### Connection States:
 *
 * - `0` - disconnected
 * - `1` - connected
 * - `2` - connecting
 * - `3` - disconnecting
 *
 * #### Example:
 *
 *   const status = db.getConnectionStatus();
 *   console.log(status);
 *   // { state: 1, stateName: 'connected', host: 'localhost', db: 'ecommerce' }
 *
 * @returns {Object} Connection status object
 * @api public
 */
function getConnectionStatus() {
    const stateNames = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };
    const state = mongoose.connection.readyState;
    return {
        state: state,
        stateName: stateNames[state] || 'unknown',
        host: mongoose.connection.host || 'N/A',
        db: mongoose.connection.name || 'N/A'
    };
}

// ============================================================
// PASSWORD UTILITIES
// ============================================================

/**
 * Hashes a plain text password using bcrypt.
 *
 * Uses the configured number of salt rounds (default: 10)
 * to generate a secure, one-way hash of the password.
 *
 * #### Example:
 *
 *   const hashedPassword = await hashPassword('mySecurePassword123');
 *   console.log(hashedPassword);
 *   // '$2a$10$N9qo8uLOickgx2ZMRZoMye...'
 *
 * @param {String} plainPassword - The plain text password to hash
 * @returns {Promise<String>} The bcrypt hashed password
 * @throws {Error} If hashing fails
 * @api public
 */
async function hashPassword(plainPassword) {
    const salt = await bcrypt.genSalt(config.BCRYPT_SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    debug('Password hashed successfully');
    return hashedPassword;
}

/**
 * Compares a plain text password with a bcrypt hash.
 *
 * #### Example:
 *
 *   const isValid = await comparePassword('myPassword', user.password);
 *   if (isValid) {
 *     console.log('Password is correct');
 *   }
 *
 * @param {String} plainPassword - The plain text password to verify
 * @param {String} hashedPassword - The bcrypt hash to compare against
 * @returns {Promise<Boolean>} True if the password matches, false otherwise
 * @api public
 */
async function comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
}

// ============================================================
// TOKEN UTILITIES
// ============================================================

/**
 * Generates a JSON Web Token (JWT) for authenticated users.
 *
 * The token contains the user's ID as the payload and is signed
 * with the configured JWT secret. It expires after the configured duration.
 *
 * #### Token Payload:
 *
 *   { id: '64abc123def456gh789ij012' }
 *
 * #### Example:
 *
 *   const token = generateToken(user._id);
 *   // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *
 *   // Send token in response
 *   res.json({ token, user: { id: user._id, name: user.name } });
 *
 * @param {String|ObjectId} userId - The MongoDB ObjectId of the user
 * @returns {String} The signed JWT token
 * @api public
 */
function generateToken(userId) {
    return jwt.sign(
        { id: userId },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
    );
}

/**
 * Verifies and decodes a JSON Web Token (JWT).
 *
 * #### Example:
 *
 *   try {
 *     const decoded = verifyToken(token);
 *     console.log(decoded.id); // '64abc123def456gh789ij012'
 *   } catch (err) {
 *     console.log('Invalid or expired token');
 *   }
 *
 * @param {String} token - The JWT token to verify
 * @returns {Object} The decoded token payload containing user ID
 * @throws {JsonWebTokenError} If the token is invalid
 * @throws {TokenExpiredError} If the token has expired
 * @api public
 */
function verifyToken(token) {
    return jwt.verify(token, config.JWT_SECRET);
}

// ============================================================
// USER CRUD OPERATIONS
// ============================================================

/**
 * Creates a new user in the database.
 *
 * The password is automatically hashed before storage.
 * The role defaults to 'user' unless explicitly set to 'admin'.
 *
 * #### Example:
 *
 *   // Create a regular user
 *   const user = await createUser({
 *     name: 'Jane Doe',
 *     email: 'jane@example.com',
 *     password: 'securePass123'
 *   });
 *
 *   // Create an admin user
 *   const admin = await createUser({
 *     name: 'Admin',
 *     email: 'admin@admin.com',
 *     password: 'admin123',
 *     role: 'admin'
 *   });
 *
 * @param {Object} userData - The user data object
 * @param {String} userData.name - Full name of the user
 * @param {String} userData.email - Email address (must be unique)
 * @param {String} userData.password - Plain text password (will be hashed)
 * @param {String} [userData.role='user'] - User role ('user' or 'admin')
 * @returns {Promise<Object>} The created user document (without password)
 * @throws {Error} If user with email already exists
 * @throws {ValidationError} If required fields are missing
 * @api public
 */
async function createUser(userData) {
    const { name, email, password, role } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create and save user
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: role || 'user'
    });

    const savedUser = await newUser.save();
    debug('User created:', savedUser.email);

    return {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        createdAt: savedUser.createdAt
    };
}

/**
 * Finds a user by their email address.
 *
 * #### Example:
 *
 *   const user = await findUserByEmail('admin@admin.com');
 *   if (user) {
 *     console.log('Found:', user.name);
 *   } else {
 *     console.log('User not found');
 *   }
 *
 * @param {String} email - The email address to search for
 * @returns {Promise<Object|null>} The user document or null if not found
 * @api public
 */
async function findUserByEmail(email) {
    return User.findOne({ email: email.toLowerCase().trim() });
}

/**
 * Finds a user by their MongoDB ObjectId.
 *
 * #### Example:
 *
 *   const user = await findUserById('64abc123def456gh789ij012');
 *   console.log(user.name); // 'Admin'
 *
 * @param {String|ObjectId} id - The MongoDB ObjectId
 * @returns {Promise<Object|null>} The user document or null if not found
 * @api public
 */
async function findUserById(id) {
    return User.findById(id).select('-password');
}

/**
 * Retrieves all users from the database.
 *
 * Returns user documents without password fields for security.
 * Supports optional filtering, sorting, and pagination.
 *
 * #### Example:
 *
 *   // Get all users
 *   const users = await getAllUsers();
 *
 *   // Get users with filters
 *   const admins = await getAllUsers({ role: 'admin' });
 *
 *   // Get users with pagination
 *   const page1 = await getAllUsers({}, { skip: 0, limit: 10 });
 *
 * @param {Object} [filter={}] - MongoDB query filter
 * @param {Object} [options={}] - Query options (skip, limit, sort)
 * @returns {Promise<Array>} Array of user documents
 * @api public
 */
async function getAllUsers(filter = {}, options = {}) {
    const query = User.find(filter).select('-password');

    if (options.sort) query.sort(options.sort);
    if (options.skip) query.skip(options.skip);
    if (options.limit) query.limit(options.limit);

    return query.exec();
}

/**
 * Updates a user document by their ID.
 *
 * If a new password is provided, it will be hashed before storage.
 *
 * #### Example:
 *
 *   // Update user name
 *   const updated = await updateUser('64abc123...', { name: 'New Name' });
 *
 *   // Promote user to admin
 *   const promoted = await updateUser('64abc123...', { role: 'admin' });
 *
 * @param {String|ObjectId} id - The user's MongoDB ObjectId
 * @param {Object} updateData - Fields to update
 * @returns {Promise<Object>} The updated user document
 * @throws {Error} If user is not found
 * @api public
 */
async function updateUser(id, updateData) {
    // Hash password if it's being updated
    if (updateData.password) {
        updateData.password = await hashPassword(updateData.password);
    }

    const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
        throw new Error('User not found');
    }

    debug('User updated:', updatedUser.email);
    return updatedUser;
}

/**
 * Deletes a user document by their ID.
 *
 * #### Example:
 *
 *   const deleted = await deleteUser('64abc123def456gh789ij012');
 *   console.log('Deleted user:', deleted.email);
 *
 * @param {String|ObjectId} id - The user's MongoDB ObjectId
 * @returns {Promise<Object>} The deleted user document
 * @throws {Error} If user is not found
 * @api public
 */
async function deleteUser(id) {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
        throw new Error('User not found');
    }
    debug('User deleted:', deletedUser.email);
    return deletedUser;
}

/**
 * Returns the total count of users in the database.
 *
 * #### Example:
 *
 *   const total = await getUserCount();
 *   console.log('Total users:', total); // Total users: 38
 *
 *   const adminCount = await getUserCount({ role: 'admin' });
 *   console.log('Admin users:', adminCount); // Admin users: 1
 *
 * @param {Object} [filter={}] - MongoDB query filter
 * @returns {Promise<Number>} The count of matching users
 * @api public
 */
async function getUserCount(filter = {}) {
    return User.countDocuments(filter);
}

// ============================================================
// AUTHENTICATION OPERATIONS
// ============================================================

/**
 * Authenticates a user with email and password.
 *
 * Verifies the provided credentials against the database.
 * On success, returns a JWT token and user information.
 * On failure, throws an error with a descriptive message.
 *
 * #### Example:
 *
 *   try {
 *     const result = await authenticateUser('admin@admin.com', 'admin123');
 *     console.log(result);
 *     // {
 *     //   token: 'eyJhbGciOi...',
 *     //   user: {
 *     //     id: '64abc123...',
 *     //     name: 'Admin',
 *     //     email: 'admin@admin.com',
 *     //     role: 'admin'
 *     //   }
 *     // }
 *   } catch (err) {
 *     console.error('Login failed:', err.message);
 *   }
 *
 * @param {String} email - The user's email address
 * @param {String} password - The user's plain text password
 * @returns {Promise<Object>} Object containing JWT token and user info
 * @throws {Error} If email or password is missing
 * @throws {Error} If user is not found (Invalid credentials)
 * @throws {Error} If password does not match (Invalid credentials)
 * @api public
 */
async function authenticateUser(email, password) {
    // Validation
    if (!email || !password) {
        throw new Error('Please enter all fields.');
    }

    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error('Invalid credentials.');
    }

    // Compare passwords
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials.');
    }

    // Generate JWT token
    const token = generateToken(user._id);

    debug('User authenticated:', user.email);

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
}

/**
 * Registers a new user in the system.
 *
 * Validates input, checks for duplicate emails, hashes the password,
 * saves the user to MongoDB, and returns a JWT token.
 *
 * #### Example:
 *
 *   try {
 *     const result = await registerUser({
 *       name: 'Jane Doe',
 *       email: 'jane@example.com',
 *       password: 'securePass123'
 *     });
 *     console.log('Registered:', result.user.name);
 *     console.log('Token:', result.token);
 *   } catch (err) {
 *     console.error('Registration failed:', err.message);
 *   }
 *
 * @param {Object} userData - The registration data
 * @param {String} userData.name - Full name
 * @param {String} userData.email - Email address
 * @param {String} userData.password - Plain text password
 * @returns {Promise<Object>} Object containing JWT token and user info
 * @throws {Error} If required fields are missing
 * @throws {Error} If user with email already exists
 * @api public
 */
async function registerUser(userData) {
    const { name, email, password } = userData;

    // Validation
    if (!name || !email || !password) {
        throw new Error('Please enter all fields.');
    }

    // Create user (handles duplicate check and password hashing)
    const savedUser = await createUser({ name, email, password });

    // Generate JWT token
    const token = generateToken(savedUser.id);

    debug('User registered:', savedUser.email);

    return {
        token,
        user: savedUser
    };
}

// ============================================================
// MIDDLEWARE
// ============================================================

/**
 * Express middleware to verify JWT token from request headers.
 *
 * Extracts the token from the `Authorization` header (Bearer scheme),
 * verifies it, and attaches the decoded user data to `req.user`.
 *
 * #### Usage:
 *
 *   const { authMiddleware } = require('./dbConnection');
 *
 *   // Protect a single route
 *   app.get('/api/profile', authMiddleware, (req, res) => {
 *     res.json({ user: req.user });
 *   });
 *
 *   // Protect all routes in a router
 *   router.use(authMiddleware);
 *
 * #### Headers Required:
 *
 *   Authorization: Bearer <jwt_token>
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 * @api public
 */
function authMiddleware(req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied.' });
    }

    // Support "Bearer <token>" format
    const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader;

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token is not valid.' });
    }
}

/**
 * Express middleware to restrict access to admin users only.
 *
 * Must be used AFTER `authMiddleware` to ensure `req.user` exists.
 *
 * #### Usage:
 *
 *   // Only admins can access this route
 *   app.delete('/api/users/:id', authMiddleware, adminMiddleware, deleteHandler);
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 * @api public
 */
async function adminMiddleware(req, res, next) {
    try {
        const user = await findUserById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: 'Server error.' });
    }
}

// ============================================================
// MODULE EXPORTS
// ============================================================

/**
 * Exported functions and utilities
 *
 * #### Connection:
 * - `connect()`            - Connect to MongoDB
 * - `disconnect()`         - Close the connection
 * - `getConnectionStatus()`- Check connection state
 *
 * #### Authentication:
 * - `authenticateUser()`   - Login with email/password
 * - `registerUser()`       - Register a new user
 * - `hashPassword()`       - Hash a plain text password
 * - `comparePassword()`    - Verify a password against hash
 * - `generateToken()`      - Create a JWT token
 * - `verifyToken()`        - Decode and verify JWT token
 *
 * #### User CRUD:
 * - `createUser()`         - Create a new user
 * - `findUserByEmail()`    - Find user by email
 * - `findUserById()`       - Find user by MongoDB ID
 * - `getAllUsers()`         - Get all users (with filters)
 * - `updateUser()`         - Update a user
 * - `deleteUser()`         - Delete a user
 * - `getUserCount()`       - Count users
 *
 * #### Middleware:
 * - `authMiddleware`       - JWT token verification
 * - `adminMiddleware`      - Admin-only access control
 *
 * #### Models:
 * - `User`                 - Mongoose User model
 *
 * @api public
 */
module.exports = {
    // Connection
    connect,
    disconnect,
    getConnectionStatus,

    // Authentication
    authenticateUser,
    registerUser,
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken,

    // User CRUD
    createUser,
    findUserByEmail,
    findUserById,
    getAllUsers,
    updateUser,
    deleteUser,
    getUserCount,

    // Middleware
    authMiddleware,
    adminMiddleware,

    // Models
    User,

    // Config (read-only)
    config
};
