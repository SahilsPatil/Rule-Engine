# Rule Engine with AST

![image](https://github.com/user-attachments/assets/1fc03d20-8c90-4cd1-917d-142c248012ec)


A **Rule Engine** designed to dynamically create, combine, and evaluate rules using **Abstract Syntax Trees (AST)**. This project enables efficient rule creation with conditions based on user attributes, combines multiple rules, and evaluates them through an intuitive UI and backend APIs.

---

## Features
- **Dynamic Rule Creation**: Create rules with conditions such as age, department, salary, and more.
- **Rule Combination**: Combine multiple rules into a single AST to minimize redundant checks.
- **AST Evaluation**: Evaluate rules with user attributes and get immediate results.
- **Persistent Storage**: Store and retrieve rules from MongoDB.
- **REST API**: Endpoints for creating, combining, and evaluating rules.
- **Frontend**: Manage and display rules through an interactive UI.

---

## Table of Contents
- [Installation](#installation)
- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)
- [Environment Variables](#environment-variables)
- [Usage Guide](#usage-guide)
  - [Adding Simple Rules](#adding-simple-rules)
  - [Adding Nested Rules](#adding-nested-rules)
  - [Combining Rules](#combining-rules)
  - [Evaluating Rules](#evaluating-rules)

---

## Installation

To run this project locally, you need to set up both the frontend and backend servers.

### Prerequisites
Make sure you have the following installed:
- **Node.js** (v14+)
- **MongoDB** (local instance or MongoDB Atlas)
- **npm** (Node Package Manager)

### Clone the Repository
```bash
git clone https://github.com/yourusername/rule-engine-mern.git
cd rule-engine-mern
```

### Frontend Setup
The frontend is built using React. To start the frontend server:

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```
This will launch the frontend at http://localhost:5173.



### Backend Setup
The backend is powered by Node.js and Express. It handles the rule creation, combination, and evaluation logic.

1. Navigate to the backend folder:

```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
nodemon index.js
```
The backend will run on http://localhost:5000.




### Environment Variables
You need to configure environment variables for the backend. Create a .env file in the backend directory with the following:

```bash
MONGO_URI=your_mongodb_connection_string
PORT=5000
```
Replace your_mongodb_connection_string with your MongoDB connection URI.



## Usage Guide

This guide walks you through how to add rules, combine them, and evaluate results using both the UI and backend API.

### Adding Simple Rules

You can create multiple rules based on user attributes like age, department, salary, etc. Below are some examples of rules that you can add using the rule creation form in the frontend.

1. **Rule 1**: ```age > 30```
2. **Rule 2**: ```department == 'Sales'```
3. **Rule 3**: ```salary > 50000```
4. **Rule 4**: ```experience > 5```
5. **Rule 5**: ```age < 25 AND department == 'Marketing```
6. **Rule 6**: ```(salary > 30000 AND experience > 2) OR department == 'HR'```

#### Steps to Add Rules:
1. Go to the **Rule Creation** form in the frontend.
2. Input the rule in the form field.
3. Click **Submit** to save the rule.
4. Repeat the process to add multiple rules as listed above.

Once saved, each rule will be assigned a unique ID that can be used for combining and evaluating rules.

---

### Adding Nested Rules

- To create more complex, nested rules, you have use parentheses `()` to group whole rule.
  
  Example:
  ```bash
  ((age > 30 AND department == 'Sales') OR (age < 25 AND department == 'Marketing'))
  ```
This allows for more advanced rule combinations where multiple conditions are grouped together.


### Combining Rules

You can combine multiple rules into a single Abstract Syntax Tree (AST) using their unique IDs. This is useful when you want to create a more complex rule from simpler ones.

#### Steps to Combine Rules:
1. Collect the **IDs** of the rules you want to combine. These IDs are available in the rule list after you've added the rules.
2. Go to the **Combine Rules** form in the frontend or make a `POST` request to the backend endpoint `/api/rules/combine`.
3. Enter the **comma-separated rule IDs** into the input box.

   Example input:
   ```bash
   ruleId1, ruleId2, ruleId3
   ```

4. The backend will process these rule IDs, combine them, and create a new combined rule. This combined rule will also have its own unique ID, which can be used for further combinations or evaluation.

   Example Combined Rule:

  ```bash
  (age > 30 AND department == 'Sales') AND salary > 50000
  ```


### Evaluating Rules

To evaluate a rule, you need to provide the **ID** of the rule you want to evaluate and the **attributes** (data) against which the rule will be checked.

#### Steps to Evaluate a Rule:
1. Go to the **Evaluate Rule** form in the frontend.
2. Enter the **ID of the rule** you want to evaluate in the "Rule ID" field.
3. In the **Attributes** input box, provide user data in JSON format.

   Example attributes:
   ```json
   {
     "age": 35,
     "department": "Sales",
     "salary": 60000,
     "experience": 4
   }
   ```
4. Click Evaluate to check if the rule holds true based on the input data. The result will either be true or false.



### Example Evaluation Test Cases

Here are some sample rules, attribute data, and the expected output for each case to help you understand the evaluation process.

---

#### **Test Case 1:**
- **Rule**: `age > 30`
- **Attributes**:
  ```json
  {
    "age": 35
  }
  ```
**Expected Output**: true (because 35 is greater than 30)

#### **Test Case 2:**
- **Rule**: `salary > 50000`
- **Attributes**:
  ```json
  {
  "salary": 40000
  }
  ```
**Expected Output**: false (because 40000 is less than 50000)


#### **Test Case 3:**
- **Rule**: `((age > 30 AND department == 'Sales') OR (age < 25 AND department == 'Marketing'))`
- **Attributes**:
  ```json
  {
  "age": 24,
  "department": "Marketing"
  }
  ```
**Expected Output**: true (because the person is under 25 and in the Marketing department)


#### **Test Case 4:**
- **Rule**: `experience > 5
`
- **Attributes**:
  ```json
  {
  "experience": 3
  }
  ```
**Expected Output**: false (because the experience is less than 5)



#### **Test Case 5:**
- **Rule**: `((salary > 30000 AND experience > 2) OR department == 'HR')`
- **Attributes**:
  ```json
  {
  "salary": 32000,
  "experience": 4,
  "department": "Finance"
  }
  ```
**Expected Output**: true (because salary is greater than 30000 and experience is more than 2)




#### **Test Case 6:**
- **Rule**: `(age > 30 AND department == 'Sales') AND salary > 50000`
- **Attributes**:
  ```json
  {
  "age": 32,
  "department": "Sales",
  "salary": 60000
  }
  ```
**Expected Output**: true (because all conditions are satisfied: age > 30, department == 'Sales', and salary > 50000)


**Make sure you input the Rule ID correctly when evaluating the rule in the evaluation form or API request. The evaluation results will either be true or false based on the input data.**





