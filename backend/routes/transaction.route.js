import express from 'express';
import { getAllTransaction,getTransactionById,editTransaction,addTransaction,deleteTransaction } from '../controllers/transaction.controller.js';

const transactionRouter = express.Router();

transactionRouter.get('/getalltransaction',getAllTransaction)
transactionRouter.get('/gettransactionbyid/:id',getTransactionById)
transactionRouter.post('/addtransaction',addTransaction)
transactionRouter.put('/edittransaction/:id',editTransaction)
transactionRouter.delete('/deletetransaction/:id',deleteTransaction)


export {transactionRouter}