const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const RentalProperty = sequelize.define('RentalProperties', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    sellerId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    ownerName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    propertyLocation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    propertyType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    propertyTitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
        }
    },
    price: {
        type: DataTypes.DECIMAL(12, 2), // Changed from 10,2 to 12,2 to store up to 1 billion (999,999,999,999.99)
        allowNull: false,
        validate: {
            isDecimal: true,
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    propertyImage: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    propertyFeatures: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM,
        values: ['onRent','rented'],
        defaultValue: 'onRent',
        allowNull: false
    }
});

module.exports = RentalProperty;