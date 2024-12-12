const { json } = require("express");
const dbConnection = require("../db/dbConfig");
const {StatusCodes} = require("http-status-codes")

// Get All Answers for a Question
const getAllAnswers = async (req, res) => {
  const { question_id } = req.params;

  try {
    const query = `
      SELECT a.answerid, a.answer, u.username 
      FROM answers a 
      JOIN users u ON a.userid = u.userid 
      WHERE a.questionid = ?
    `;

    // Using `await` to handle the database query
    const [results] = await dbConnection.query(query, [question_id]);

  //  this blocks the front end when there is no answer and to post first answer
    // if (results.length === 0) {
    //   return res
    //     .status(StatusCodes.NOT_FOUND)
    //     .json({ message: "No answers found for this question" });
    // }

    res.status(StatusCodes.OK).json(results);
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

// Post an Answer
// const postAnswer = async (req, res) => {
//   console.log("Debug: postAnswer function was called");
//   const { userid, questionid, answer } = req.body;
//   console.log("Request body received:", req.body);
//   console.log("userid:", userid, "questionid:", questionid, "answer:", answer);
//   // Input validation
//   if (!userid || !questionid || !answer?.trim()) {
//     return res.status(StatusCodes.BAD_REQUEST).json({ error: "All fields are required" });
//   }

//   try {
//     const query = `
//       INSERT INTO answers (userid, questionid, answer) 
//       VALUES (?, ?, ?)
//     `;

//     // Using `await` to handle the insert query
//     const [result] = await dbConnection.query(query, [ userid,questionid, answer,]);

//     res.status(StatusCodes.CREATED).json({ message: "Answer posted successfully", insertId: result.insertId });
//   } catch (err) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
//   }
// };
const postAnswer = async (req, res) => {
  console.log("Request body received for validation:", req.body);

  const { userid, questionid, answer } = req.body;

  // Log individual fields
  console.log("userid:", userid, "questionid:", questionid, "answer:", answer);

  // Input validation: Check for missing fields or empty strings
  if (!answer?.trim() || !userid || !questionid ) {
    console.error("Validation failed. Missing or empty fields.");
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "All fields are required" });
    
  }

  try {
    const query = `
      INSERT INTO answers (userid, questionid, answer) 
      VALUES (?, ?, ?)
    `;
    const [result] = await dbConnection.query(query, [userid, questionid, answer]);

    res.status(StatusCodes.CREATED).json({
      message: "Answer posted successfully",
      insertId: result.insertId,
    });
  } catch (err) {
    console.error("Error inserting answer:", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};
module.exports = { getAllAnswers, postAnswer };