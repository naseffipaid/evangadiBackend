const { json } = require("express");
const dbConnection = require("../db/dbConfig");
const {StatusCodes} = require("http-status-codes")

// Get All Questions - Ordered by descending creation date
const getAllQuestions = async (req, res) => {
    try {
      const query = `
        SELECT q.id, q.questionid, q.title, q.description, q.tag, u.username 
        FROM questions q 
        JOIN users u ON q.userid = u.userid
        ORDER BY q.id DESC;
      `;
      
      const [results] = await dbConnection.query(query);
  
      if (results.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "No questions found" });
      }
  
      res.status(StatusCodes.OK).json(results);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
  };
  
  // Get Single Question by question_id 
  const getSingleQuestion = async (req, res) => {
    const { question_id} = req.params;
  
    try {
      const query = `
        SELECT q.id, q.questionid, q.title, q.description, q.tag, u.username 
        FROM questions q 
        JOIN users u ON q.userid = u.userid
        WHERE q.questionid = ?;
      `;
      
      const [result] = await dbConnection.query(query, [question_id]);
  
      if (result.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "Question not found" });
      }
  
      res.status(StatusCodes.OK).json(result[0]);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
  };
  
  // Post a Question
  const postQuestion = async (req, res) => {
    const { userid, title, description, tag } = req.body;
  
    // Validate input
    if (!userid || !title || !description || !tag) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "All fields are required" });
    }
  
    const questionid = `${userid}-${Date.now()}`;
  
    try {
      const query = `
        INSERT INTO questions (questionid, userid, title, description, tag) 
        VALUES (?, ?, ?, ?, ?);
      `;
      
      await dbConnection.query(query, [questionid, userid, title, description, tag]);
  
      res.status(StatusCodes.CREATED).json({ message: "Question posted successfully" });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
  };
  
  module.exports = { getAllQuestions, getSingleQuestion, postQuestion };