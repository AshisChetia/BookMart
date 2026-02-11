import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";


export const signup = async (req, res) => {
    try {

        const { fullname, email, phone, address, password, role } = req.body;

        if (!fullname || !email || !phone || !address || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullname,
            email,
            phone,
            address, // Maintain legacy address for now
            password: hashedPassword,
            role: role || "user",
            addresses: [{
                label: 'Home',
                fullName: fullname,
                phone: phone,
                addressLine: address,
                isDefault: true
            }]
        })

        return res.status(200).json({
            success: true,
            message: "user registered successfully"
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Server error during registration"
        })
    }
}

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields required"
            })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                addresses: user.addresses,
                createdAt: user.createdAt,
                bio: user.bio,
                gender: user.gender,
                dateOfBirth: user.dateOfBirth,
                profileImage: user.profileImage
            }
        })
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({
            success: false,
            message: "Server error during login"
        })
    }
}

export const getMe = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            user: {
                id: req.user._id,
                fullname: req.user.fullname,
                email: req.user.email,
                phone: req.user.phone,
                address: req.user.address,
                role: req.user.role,
                addresses: req.user.addresses,
                createdAt: req.user.createdAt,
                bio: req.user.bio,
                gender: req.user.gender,
                dateOfBirth: req.user.dateOfBirth,
                profileImage: req.user.profileImage
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname, phone, address, city, state, pincode, bio, gender, dateOfBirth, profileImage } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Update basic fields
        if (fullname) user.fullname = fullname;
        if (phone) user.phone = phone;
        if (bio !== undefined) user.bio = bio;
        if (gender !== undefined) user.gender = gender;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;
        if (profileImage !== undefined) user.profileImage = profileImage;

        // Handle Address Update
        let fullAddress = user.address;
        if (address || city || state || pincode) {
            // Find default address or create new
            let defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];

            if (!defaultAddr) {
                defaultAddr = { isDefault: true, label: 'Home' };
                user.addresses.push(defaultAddr);
            }

            // Update specific fields if provided
            if (address) defaultAddr.addressLine = address;
            if (city) defaultAddr.city = city;
            if (state) defaultAddr.state = state;
            if (pincode) defaultAddr.pincode = pincode;
            if (fullname) defaultAddr.fullName = fullname;
            if (phone) defaultAddr.phone = phone;

            // Reconstruct full address string for legacy support
            const addrParts = [
                defaultAddr.addressLine,
                defaultAddr.city,
                defaultAddr.state,
                defaultAddr.pincode
            ].filter(Boolean);

            fullAddress = addrParts.join(', ');
            user.address = fullAddress;
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                addresses: user.addresses,
                createdAt: user.createdAt,
                bio: user.bio,
                gender: user.gender,
                dateOfBirth: user.dateOfBirth,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error during profile update"
        });
    }
}

export const addAddress = async (req, res) => {
    try {
        const { label, fullName, phone, state, city, pincode, addressLine, isDefault } = req.body;
        const user = await User.findById(req.user._id);

        if (isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        user.addresses.push({ label, fullName, phone, state, city, pincode, addressLine, isDefault });
        await user.save();

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const updateData = req.body;
        const user = await User.findById(req.user._id);

        const address = user.addresses.id(addressId);
        if (!address) return res.status(404).json({ success: false, message: "Address not found" });

        if (updateData.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        Object.assign(address, updateData);
        await user.save();

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const user = await User.findById(req.user._id);

        user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
        await user.save();

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const setDefaultAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const user = await User.findById(req.user._id);

        user.addresses.forEach(addr => {
            addr.isDefault = addr._id.toString() === addressId;
        });

        await user.save();
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};