import {useState,useEffect} from 'react'
import { Wallet, CalendarDays, ReceiptText, ChartPie, Pencil, Trash2,   Utensils,
  Bus,
  ShoppingCart,
  Clapperboard,
  LogOut
} from 'lucide-react';
import './App.css'
import Login from './login'
import Register from './register';

function App(){
  const [title,setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category,setCategory] = useState('');
  const [date,setDate] = useState('');
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const [editingId,setEditingId] = useState(null);

  const startEditing = (expense) => {
    setEditingId(expense._id);
    setTitle(expense.title);
    setAmount(expense.amount);
    setCategory(expense.category);
    setDate(expense.date.split("T")[0]);
    
    setShowExpenseForm(true);
  };

  const token = localStorage.getItem("token");
  const [isLoggedIn,setIsLoggedIn] = useState(!!token);

  
  const [expenses,setExpenses] = useState([]);

  

  const getExpenses = async () => {
    const token = localStorage.getItem('token');
    


    const response = await fetch("http://localhost:3000/api/expenses",{
      method : "GET",
      headers  : {
        "Authorization":`Bearer ${token}`
      }
    }
      
    );
    const data = await response.json();
    if (!response.ok) {
      console.log(data.message);
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      return;
    }
    setExpenses(data); 
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/expenses/${id}`,{
      method:"DELETE",
      headers:{
        "Authorization": `Bearer ${token}`
      }
    }
      
    );
    const data = await response.json();
    setExpenses(expenses.filter((expense) => expense._id !== id))
    console.log(data);
    
  };
  const handleUpdate = async (id,newTitle) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/expenses/${id}`,{
      method : "PATCH",
      headers : {
        "Authorization":`Bearer ${token}`,
        "content-type": "application/json"
      },
      body:JSON.stringify({
        title:newTitle
      })

    });


  }
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const response = await fetch( editingId
    ? `http://localhost:3000/api/expenses/${editingId}`
    : "http://localhost:3000/api/expenses",{
      method: editingId ? "PATCH" : "POST", 
      body:JSON.stringify({
        title:title,
        amount:amount,
        category:category,
        date:date,
      }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (editingId) {
    setExpenses(
      expenses.map((expense) =>
        expense._id === editingId ? data : expense
      )
    );
  } 
    else {
      setExpenses([...expenses, data]);
    }

    
    setEditingId(null);
    setTitle('');
    setAmount('');
    setCategory('');
    setDate('');
    setShowExpenseForm(false);
  }

  useEffect (()=>{
    if(isLoggedIn){
      getExpenses();
    }
    
  },[isLoggedIn]);
  


  if(!isLoggedIn){
    return <Login setIsLoggedIn={setIsLoggedIn} />;
  }

  const handleLogout = () => {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
  };

  const totalExpenses = expenses.reduce((total,expense) => total + Number(expense.amount),0);
  
  const now = new Date();

  const monthlyExpenses = expenses.reduce((total, expense) => {
    const expenseDate = new Date(expense.date);

    if (
      expenseDate.getMonth() === now.getMonth() &&
      expenseDate.getFullYear() === now.getFullYear()
    ) {
      return total + Number(expense.amount);
    }

    return total;
  }, 0);


  const totalTransactions = expenses.length;
    
  const totalCategories = new Set(
    expenses.map((expense) => expense.category)
  ).size;


  
  const getCategoryIcon = (category) => {
    switch (category.toLowerCase().trim()) {
      case "food":
        return <Utensils size={22} />;

      case "transport":
        return <Bus size={22} />;

      case "shopping":
        return <ShoppingCart size={22} />;

      case "bills":
        return <ReceiptText size={22} />;

      case "entertainment":
        return <Clapperboard size={22} />;

      default:
        return <Wallet size={22} />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category.toLowerCase().trim()) {
      case "food":
        return "food";

      case "transport":
        return "transport";

      case "shopping":
        return "shopping";

      case "bills":
        return "bills";

      case "entertainment":
        return "entertainment";

      default:
        return "other";
    }
  };



  return (
    <div className='app'>
        <header className="app-header">
          <div className="header-text">
            <h1>Expense Tracker</h1>
            <p>Your financial overview</p>
          </div>
             
          <button className="logout-btn" onClick={handleLogout}> <LogOut size={20} /> </button>
          
        </header>

        <main className="main-content">
          <h2 className="page-title">Dashboard Overview</h2>
          <section className="dashboard-heading">
            
            <p>Track and manage your spending</p>
              <section className='summary-cards'>
                <div className='summary-card'>
                  <p> <Wallet size={18} color="#5149e3" />   Total Expenses</p>
                  <h3>₹{totalExpenses.toLocaleString("en-IN")}</h3>
                </div>
                <div className='summary-card'>
                  <p> <CalendarDays size={18} color="#16834a" />  This Month</p>
                  <h3>  ₹{monthlyExpenses.toLocaleString("en-IN")}</h3>
                </div>
                <div className='summary-card'>
                  <p> <ReceiptText size={18} color="#b86b08" /> Total Transactions</p>
                  <h3>{totalTransactions}</h3>
                </div>
                <div className="summary-card">
                  <p> <ChartPie size={18} color="#1670b8" /> Categories</p>
                  <h3>{totalCategories}</h3>
                </div>

                
              </section>
          </section>
          
          <section className="expenses-section">

            <div className="expense-list-header">
                    <h2>My Expenses</h2>

                    <button
                      type="button"
                      className="add-expense-btn"
                      onClick={() => setShowExpenseForm(!showExpenseForm)}
                    >
                      {showExpenseForm ? "Close Form" : "+ Add Expense"}
                    </button>
                  </div>

                   {showExpenseForm && (
                      <section className='expense-form-section'>
                        <h2>Add Expense</h2>
                        <form className='expense-form' onSubmit={handleSubmit}>
                          <div className='form-group'>
                            <label>Title</label>
                            <input type='text' value={title} onChange={(e)=> setTitle(e.target.value)} placeholder='Enter Expense Title' />
                          </div>
                          <div className='form-group' >
                            <label>Amount</label>
                            <input type='number' value={amount} onChange={(e) => setAmount(e.target.value)} placeholder='Enter Amount' />
                          </div>

                          <div className="form-group">
                            <label htmlFor="expense-category">Category</label>
                            <input id="expense-category" type="text" list="category-options" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Choose or type a category" autoComplete="off" />
                             <datalist id="category-options">
                              <option value="Food" />
                              <option value="Groceries" />
                              <option value="Transport" />
                              <option value="Shopping" />
                              <option value="Bills" />
                              <option value="Entertainment" />
                              <option value="Health" />
                              <option value="Education" />
                              <option value="Travel" />
                              <option value="Other" />
                            </datalist>
                          </div>

                          <div className="form-group">
                            <label>Date</label>
                            <input type="date" value ={date} onChange={(e) => setDate(e.target.value)} />
                          </div>
                          <button type='submit' > {editingId ? "Update Expense" : "Add Expense"} </button>
                        </form>
                      </section>
                  )}

             
             
             
             <section className="expense-list">                     
                {expenses.map((expense) => (
                  <div className="expense-card" key={expense._id}>

                    <div className={`expense-category-icon ${getCategoryColor(expense.category)}`}>
                      {getCategoryIcon(expense.category)}
                    </div>

                    <div className="expense-details">
                      <h3>{expense.title}</h3>
                      <p>{expense.category}</p>
                      <p>{new Date(expense.date).toLocaleDateString()}</p>
                    </div>

                    <div className="expense-right">
                      <p className="expense-amount">
                        ₹{Number(expense.amount).toLocaleString("en-IN")}
                      </p>

                      <div className="expense-actions">
                        <button
                          type="button"
                          className="edit-btn"
                          title="Edit expense"
                          aria-label="Edit expense"
                          onClick={() => startEditing(expense)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => handleDelete(expense._id)}
                          title="Delete expense"
                          aria-label="Delete expense"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}



             </section>

            
          </section>
          

        </main>

        <footer className="app-footer">
          <p>Expense Tracker</p>
          
        </footer>
        

    </div>
    
  );
}
export default App;