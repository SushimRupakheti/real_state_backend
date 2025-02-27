const Property = require('../model/Property')
const cloudinary = require('cloudinary').v2;

const sellProperty = async (req, res) => {

    const requiredFields = { ...req.body };
    const propertyImage = req.file;

    // Check if all required fields are present
    const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

    if (missingFields.length > 0) {
        return res.status(400).json({
            error: 'Missing required fields',
            fields: missingFields
        });
    }

    // Check if the property image is present
    if (!propertyImage) {
        return res.status(400).json({
            error: 'Property image is required'
        });
    }

    try {
        // Upload the image to Cloudinary
        const uploadPromise = new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'real_state_property_images',
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            stream.end(propertyImage.buffer);
        });

        const uploadedImage = await uploadPromise;

        // Add the property image URL to the required fields
        requiredFields.propertyImage = uploadedImage.secure_url;

        // Create the property
        await Property.create(requiredFields);

        // Send the property object and the message
        res.status(201).json({
            success: true,
            message: 'Property listed successfully'
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to list property' });
    }
}

const buyProperty = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the property by id
        const property = await Property.findOne({
            where: { id }
        });
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Update the property status
        property.status = 'sold';
        await property.save();

        // Send the property object and the message
        res.status(200).json({
            success: true,
            message: 'Property bought successfully'
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to buy property' });
    }
}

const getAllOnSaleProperties = async (req, res) => {
    try {
        // Find all properties which aren't sold
        const properties = await Property.findAll({
            where: { status: 'onSale' }
        });

        // Send the properties array
        res.status(200).json(properties);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get properties' });
    }
}

const getPropertyBySeller = async (req, res) => {
    const { sellerId } = req.params;

    try {
        // Find the property by id
        const property = await Property.findAll({
            where: { sellerId }
        });
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Send the property object
        res.status(200).json({
            success: true,
            property
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get property' });
    }
}


const deleteProperty = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the property by id
        const property = await Property.findOne({
            where: { id }
        });

        if (!property) {
            return res.status(404).json({
                success: false,
                error: 'Property not found'
            });
        }

        // Get the image URL and extract public ID correctly
        const imageUrl = property.propertyImage;
        // Extract the path after '/upload/'
        const match = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/);
        const publicId = match ? match[1] : null;

        if (publicId) {
            // Delete the image from Cloudinary
            await cloudinary.uploader.destroy(publicId);
        }

        // Delete the property from database
        await property.destroy();

        res.status(200).json({
            success: true,
            message: 'Property deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete property error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete property'
        });
    }
};


const updateProperty = async (req, res) => {
    const { id } = req.params;
    const propertyImage = req.file;
    
    try {
        // Find the property by id
        const property = await Property.findOne({
            where: { id }
        });

        if (!property) {
            return res.status(404).json({
                success: false,
                error: 'Property not found'
            });
        }

        // If there's a new image, upload it
        if (propertyImage) {
            const uploadPromise = new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'real_state_property_images',
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(propertyImage.buffer);
            });

            const uploadedImage = await uploadPromise;
            req.body.propertyImage = uploadedImage.secure_url;
        }

        Object.assign(property, req.body);
        await property.save();

        res.status(200).json({
            success: true,
            message: 'Property updated successfully',
            property
        });
    }
    catch (error) {
        console.error('Update property error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update property'
        });
    }
};


module.exports = {
    sellProperty,buyProperty,getAllOnSaleProperties,getPropertyBySeller,deleteProperty,updateProperty
};

