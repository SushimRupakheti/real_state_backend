const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const RentalProperty = sequelize.define('RentalProperties', {
    Rid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    RsellerId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    RownerName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    RpropertyLocation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    RpropertyType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    RpropertyTitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    RphoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
        }
    },
    Rprice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: true,
        }
    },
    Rdescription: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    RpropertyImage: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    RpropertyFeatures: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    Rstatus: {
        type: DataTypes.ENUM,
        values: ['onSale', 'sold', 'rented'],
        defaultValue: 'onSale',
        allowNull: false
    }
});

module.exports = RentalProperty;