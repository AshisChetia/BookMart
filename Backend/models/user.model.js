import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    fullname: {
        type: String,
        required: [true, "Fullname is required"],
        trim: true,
        minlength: [3, "Fullname must be at least 3 characters long"],
        maxlength: [100, "Fullname must be at most 100 characters long"]
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)
            },
            message: "Please enter a valid email address"
        }
    },

    phone: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true,
        trim: true
    },

    address: {
        type: String,
        required: [true, "Address is required"],
        trim: true
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        minlength: [6, "Password must be at least 6 characters long"],
    },

    role: {
        type: String,
        enum: ["user", "seller"],
        default: "user"
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;