const {Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            validate: 
            match: [`/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/`]
        },
        thoughts: [{
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }],
        friends: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    {
        toJSON: {virtuals: true },
        toObject: { virtuals: true }
}
);

//Virtual for friend Count
userSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

const User = model ('user', userSchema);

module.exports = User;