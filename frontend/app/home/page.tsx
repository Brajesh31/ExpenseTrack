"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, Plus } from "lucide-react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO, isFuture, isValid } from "date-fns";
import { motion } from "framer-motion";

interface ChartDataPoint {
  month: string;
  totalAmount: number;
}

interface Transaction {
  _id: number;
  title: string;
  amount: number;
  date: string;
}

const HomePage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);
  const [newTransaction, setNewTransaction] = useState({
    title: "",
    amount: "",
    date: "",
  });
  const [formErrors, setFormErrors] = useState({
    title: "",
    amount: "",
    date: "",
  });
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/getalltransaction`
        );
        setTransactions(response.data);

        // Aggregate transactions by month
        const monthlyData: { [key: string]: number } = {};
        response.data.forEach((transaction: Transaction) => {
          const month = format(parseISO(transaction.date), "MMMM yyyy");
          monthlyData[month] = (monthlyData[month] || 0) + Number(transaction.amount);
        });

        const formattedData = Object.entries(monthlyData).map(
          ([month, totalAmount]) => ({ month, totalAmount })
        );
        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  const validateForm = () => {
    const errors = { title: "", amount: "", date: "" };
    let isValidForm = true;

    if (!newTransaction.title.trim()) {
      errors.title = "Title is required.";
      isValidForm = false;
    }
    if (!newTransaction.amount || Number(newTransaction.amount) <= 0) {
      errors.amount = "Enter a valid positive amount.";
      isValidForm = false;
    }
    const date = parseISO(newTransaction.date);
    if (!isValid(date) || isFuture(date)) {
      errors.date = "Enter a valid past or current date.";
      isValidForm = false;
    }

    setFormErrors(errors);
    return isValidForm;
  };

  const handleAdd = () => {
    setIsEditMode(false);
    setNewTransaction({ title: "", amount: "", date: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (id: number) => {
    const transactionToEdit = transactions.find((t) => t._id === id);
    if (transactionToEdit) {
      setIsEditMode(true);
      setCurrentEditId(id);
      setNewTransaction({
        title: transactionToEdit.title,
        amount: String(transactionToEdit.amount),
        date: transactionToEdit.date,
      });
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/deletetransaction/${id}`);
      setTransactions((prev) => prev.filter((transaction) => transaction._id !== id));
      console.log(`Transaction with id ${id} deleted successfully.`);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTransaction({ ...newTransaction, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (isEditMode && currentEditId !== null) {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/edittransaction/${currentEditId}`,
          newTransaction
        );
        const updatedTransaction = response.data.updatedTransaction;
        setTransactions((prev) =>
          prev.map((transaction) =>
            transaction._id === currentEditId ? updatedTransaction : transaction
          )
        );
      } else {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/addtransaction`,
          newTransaction
        );
        const addedTransaction = response.data.transaction;
        setTransactions((prev) => [...prev, addedTransaction]);
      }
      setIsModalOpen(false);
      setNewTransaction({ title: "", amount: "", date: "" });
      window.location.reload();
    } catch (error) {
      console.error("Error submitting transaction:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Expense Tracker</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add
        </Button>
      </div>

      {/* Monthly Expense Chart */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Monthly Spending Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalAmount" fill="#8884d8" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Transaction Cards */}
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <motion.div
            key={transaction._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="relative group hover:shadow-xl hover:scale-105 transition-transform duration-300">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">{transaction.title}</h2>
                    <p className="text-gray-600">{transaction.amount}</p>
                    <p className="text-gray-500 text-sm">
                      {format(parseISO(transaction.date), "eeee, MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="absolute top-2 right-2 hidden group-hover:flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(transaction._id)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(transaction._id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Modal for Add/Edit Transaction */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input name="title" value={newTransaction.title} onChange={handleInputChange} />
              {formErrors.title && <p className="text-red-500 text-sm">{formErrors.title}</p>}
            </div>
            <div>
              <Label>Amount</Label>
              <Input name="amount" type="number" value={newTransaction.amount} onChange={handleInputChange} />
              {formErrors.amount && <p className="text-red-500 text-sm">{formErrors.amount}</p>}
            </div>
            <div>
              <Label>Date</Label>
              <Input name="date" type="date" value={newTransaction.date} onChange={handleInputChange} />
              {formErrors.date && <p className="text-red-500 text-sm">{formErrors.date}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>{isEditMode ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;