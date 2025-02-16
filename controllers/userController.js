const User = require('../model/User')

const bcrypt = require('bcrypt');

// Register a new user
const registerUser = async (req, res) => {
    const { name, email, password, phone } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the user
        const newUser = await User.create({ name, email, password: hashedPassword, phone });

        // Remove the password before sending the user object
        delete newUser.dataValues.password;

        // Send the user object and the message
        res.status(201).json({
            success: true,
            user: newUser.dataValues,
            message: 'User registered successfully'
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};


// Login an existing user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({
            error: 'Email and password are required'
        });
    }

    try {
        // Find the user by email
        const user = await User.findOne({
            where: { email }
        });
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        // Verify the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        // // Generate a JWT token
        // const token = jwt.sign(
        //     { id: user.id, username: user.username },
        //     process.env.JWT_SECRET || 'JKHSDKJBKJSDJSDJKBKSD345345345345',
        //     { expiresIn: '24h' }
        // );

        // Remove password before sending to frontend
        delete user.dataValues.password;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            // token,
            user: user.dataValues
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to login user' });
    }
};




const getUser = async(req, res)=>{

    try{
        const tests = await User.findAll();
        res.status(200).json(tests);

    }
    catch(error){
        res.status(500).json({error: "Failed to Load"})
    }
}



// const createUser = async(req, res)=>{

//     try{

// const {username, password} = req.body;

// //Hash the password
// const newtest = await User.create({username, password})

// res.status(200).json(newtest);
//     }
//     catch(error){
//         res.status(500).json({error: "Failed to Load"})
//         console.log(error)
//     }

// }

// const updateUser = async(req, res)=>{
//     try {
//         const user = await User.findByPk(req.params.id);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         await user.update(req.body);
//         res.json(user);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// }

// const deleteUser = async(req, res)=>{
//     try {
//         const user = await User.findByPk(req.params.id);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         await user.destroy();
//         res.json({ message: 'User deleted' });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// }

// module.exports = {createUser, getUser, deleteUser, updateUser}

module.exports = { loginUser, registerUser,getUser }