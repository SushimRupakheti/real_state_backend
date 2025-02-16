require('dotenv').config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('OriginHomes', 'postgres', 'admin123',{

    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false,
});

async function testConnection() {
    try{
        await sequelize.authenticate();
        console.log('DB connection successful............................');
        
        await sequelize.sync({ alter: true }); 
        console.log('✅ Database synced');
    }
    catch(error){
        console.error('Unable to connect to the database...............', error)

}    
}
testConnection()

module.exports = sequelize;

