import mongoose from 'mongoose';
import {Transaction} from '../models/transaction.model.js';



// Add a new transaction
export const addTransaction = async (req, res) => {
  try {
    const { amount, title, date } = req.body;

    // Input validation
    if (!amount || !title || !date) {
      return res.status(400).json({ message: 'Amount, title, and date are required.' });
    }

    const transaction = new Transaction({ amount, title, date });
    await transaction.save();

    res.status(201).json({ message: 'Transaction added successfully.', transaction });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Edit an existing transaction
export const editTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, title, date } = req.body;


    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { amount, title, date },
      { new: true, runValidators: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }

    res.status(200).json({ message: 'Transaction updated successfully.', updatedTransaction });
  } catch (error) {
    console.error('Error editing transaction:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Delete a transaction
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }

    res.status(200).json({ message: 'Transaction deleted successfully.' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Get all transactions
export const getAllTransaction = async (req, res) => {
  try {
    const transactions = await Transaction.find({}).sort({ date: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Get transaction by ID
export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;


    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


