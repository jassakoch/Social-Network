const { Thought, User } = require('../models');

module.exports = {
    //Getting all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);

        }
    },

    //Getting one thought
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId });

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //Create a a thought
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);

            //Passing userId in the request body
            const userId = req.body.userId;

            //find user by Id and update their thoughts array
            const user = await User.findOneAndUpdate(
                { _id: userId },
                { $push: { thoughts: thought._id } },
                { new: true }
            );

            res.json(thought);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

    //Update a thought
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!thought) {
                res.status(404).json({ message: 'No thought with this ID' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //Delete a thought
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({
                _id: req.params.thoughtId,
            });

            if (!thought) {
                res.status(404).json({ message: 'No thought with that ID' });
            }

            await User.deleteMany({ _id: { $in: thought.users } });
            res.json({ message: 'Thought and users deleted.' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //Add a reaction to a thought
    async addReaction(req, res) {
        console.log('You are adding a reaction');
        console.log(req.body);
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                {
                    $addToSet: {
                        reactions: {
                            username: req.body.username,
                            reactionBody: req.body.reactionBody,
                        },
                    },
                },
                { runValidators: true, new: true }
            ).select('-v');

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that ID' })
            }

            res.json([
                { message: 'The reaction was added' },
                thought,
            ]);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //Delete reaction from thought
    //Delete reaction from thought
async removeReaction(req, res) {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true }
        );

        if (!thought) {
            return res
                .status(404)
                .json({ message: 'No thought found with that ID ' });
        }

        // Send the updated thought as the response
        res.json(thought);
    } catch (err) {
        // Ensure to send a response in case of an error
        res.status(500).json(err);
    }
},

};

