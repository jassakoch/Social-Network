const { Schema, model, Types } = require('mongoose');



//ReactionSchema, embedded document in Thought
const ReactionSchema = new Schema (
    {
        reactionId: {
            type: Types.ObjectId,
            default:  new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: timestamp => timestamp.toLocaleString()//replace with timestamp library?
        }
    },
    {
        toJSON: { getters: true },
        toObject: { getters: true }
    }
);

//Thought Schema
const ThoughtSchema = new Schema (
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: timestamp => timestamp.toLocaleString()//replace with time library?

        },
        username: {
            type: String,
            required: true,
            ref:"user"
        },

        reactions: [ReactionSchema]
    },
    {
        toJSON: { virtuals: true, getters: true },
        id: false,
    }
);

//Virtual to count reaction
ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
})


const Thought = model('thought', ThoughtSchema);

module.exports = Thought;
