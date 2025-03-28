import React, { useEffect, useState } from "react";
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppBarComponent from "./AppBarComponent";

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Get token from URL first
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (token) {
            localStorage.setItem("token", token);

            // Remove token from URL without reloading
            window.history.replaceState({}, document.title, window.location.pathname);
        } else {
            // If no token found, check localStorage
            const storedToken = localStorage.getItem("token");
            if (!storedToken) {
                console.error("No token found. Redirecting to login...");
                navigate("/"); // Redirect to login if token is missing
                return;
            }
        }

        // Fetch user details
        fetch("http://localhost:5000/me", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => response.json())
        .then(user => {
            localStorage.setItem("user", JSON.stringify(user));
        })
        .catch(error => {
            console.error("Error fetching user details:", error);
            navigate("/"); // Redirect to login on error
        });

        // Fetch invoices
        fetch("http://localhost:5000/invoices", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => response.json())
        .then(data => setInvoices(data))
        .catch(error => console.error("Error fetching invoices:", error));
        
    }, [navigate]);

    const handleSendInvoiceReminder = (id,recipient,amount,dueDate,status) => {
        console.log(JSON.stringify({
            invoiceId: id,
            recipient: recipient,
            amount: amount,
            dueDate: dueDate,
            status: status }));
        fetch(`http://localhost:5000/send-invoice-reminder`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                invoiceId: id,
                recipient: recipient,
                amount: amount,
                dueDate: dueDate,
                status: status })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`#${id} - Invoice Due Reminder sent via Email successfully!`);
            } else {
                alert("Failed to send invoice reminder for - #" + id);
            }
        })
        .catch(error => console.error("Error sending the invoice reminder:", error));
    };

    return (
        <>
            <AppBarComponent />
            <Container maxWidth="md" sx={{ marginTop: 4 }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Invoice Id</strong></TableCell>
                                <TableCell><strong>Recipient Name</strong></TableCell>
                                <TableCell><strong>Amount Due($)</strong></TableCell>
                                <TableCell><strong>Due Date</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Action Button</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell>{invoice.id}</TableCell>
                                    <TableCell>{invoice.recipient}</TableCell>
                                    <TableCell>{invoice.amount}</TableCell>
                                    <TableCell>{invoice.dueDate}</TableCell>
                                    <TableCell> <span 
                                    style={{ 
                                        color: invoice.status === "paid" ? "green" :"red", 
                                    }}>
                                    {invoice.status}
                                </span></TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleSendInvoiceReminder(
                                                invoice.id,
                                                invoice.recipient,
                                                invoice.amount,
                                                invoice.dueDate,
                                                invoice.status
                                            )}
                                        >
                                            Send Reminder
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </>
    );
    
};

export default Invoices;
