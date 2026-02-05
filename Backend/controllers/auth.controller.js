import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";


export const signup = async (req, res) => {
  try {
    
    const { fullname, email, phone, address, password } = req.body;

    if(!fullname || !email || !phone || !address || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }

    const existingUser = await User.findOne({ email });
    if(existingUser) {
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
        address,
        password: hashedPassword
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
        
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields required"
            })
        }

        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d"}
        )

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role
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