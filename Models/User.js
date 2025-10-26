const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    expenses: [
        { // ✅ The opening brace for the expense object
            text: {
                type: String,
                required: true
            },
            amount: {
                type: Number,
                required: true
            },
            category: {
                type: String,
                required: false
            },
            // Use 'date' as we implemented previously for custom dates
            date: {
                type: Date,
                // default: Date.now
                required: true
            },
            paymentMethod: {
                type: String,
                required: false 
            }
        } 
    ],
     budgets: [
        {
            category: { type: String, required: true },
            limit: { type: Number, required: true }
        }
    ]
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;