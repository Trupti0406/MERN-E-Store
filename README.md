# Mern E-Store

**E-Store is a Fully-Functional MERN application with user Authentication i.e. sign-in & Signup functionality, a fully functional cart, order history, payment integration, product screen, shipping screen, and other functionalities such as searching, sorting pagination, and many more.**

<hr>

## How to run this project on your local system?

1. Go to the **"frontend"** folder, open the frontend folder in an integrated terminal and run the command **`npm install`** to install all the dependencies.

2. Now to run the fronted on your local system, run the command **`npm start`**. Your app will now be running on localhost:3000

3. Now go to the **"backend"** folder and open it in another integrated terminal, and run the command **`npm install`** again to install the backend dependencies.

4. In the backend folder's root directory create a **.env** file, and create 3 environment variables like shown below:

   - **JWT_SECRET** = (Generate or type out a random string of characters)
   - **PAYPAL_CLIENT_ID** = (Generate a Paypal client ID by visiting this link: https://developer.paypal.com/home)
   - **MONGODB_URI** = (Paste the MongoDB database connection link here. )

5. And run **`node server.js`** in the same backend terminal.
