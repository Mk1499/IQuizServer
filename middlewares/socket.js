import Challenge from "../models/challenge.js";
import Question from "../models/question.js";

const getRondomQuestions = async () => {
    try {
        const randomQuestions = await Question.aggregate([
            { $sample: { size: 10 } }, // Get a random sample of 10 questions
            { $project: { _id: 1 } }   // Project only the _id field
        ]);

        const questionIds = randomQuestions.map(question => question._id);

        return questionIds;
    } catch (error) {
        console.error('Error fetching random questions:', error);
        throw error;
    }
}


export const onConnection = (socket) => {
    console.log("user connected : ", socket.id);
    socket.on('startChallenge', async (userId) => {
        console.log("user id : ", userId);
        const questions = await getRondomQuestions();
        console.log("Qs : ", questions);

        const challenge = new Challenge({
            participants: [{
                user: userId,
                socketId: socket.id,
            }],
            questions,
            endTime: new Date('2023-12-23'),

            status: 'pending',


        });

        challenge.save();
    })
}