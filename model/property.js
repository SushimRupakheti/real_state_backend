const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Property = sequelize.define('Properties', {
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
        type: DataTypes.DECIMAL(10, 2),
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
        values: ['onSale', 'sold', 'rented'],
        defaultValue: 'onSale',
        allowNull: false
    }
});

module.exports = Property;