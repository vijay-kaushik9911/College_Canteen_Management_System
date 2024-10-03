const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose')
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./Models/user');
const Item = require('./Models/item');
const Cart = require('./Models/cart');
const { isLoggedIn } = require('./middlewear');


app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))


const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

mongoose
  .connect("mongodb://127.0.0.1:27017/CollegeCanteen")
  .then(() => {
    console.log("Successfully connected to MONGO");
  })
  .catch((err) => {
    console.log("ERRORR!!!", err);
  });


app.get('/',(req,res) => {
    res.redirect('/login');
})

app.get('/home',isLoggedIn,(req,res) => {
    res.render('home');
})

app.get('/register',(req,res) =>{
    res.render('register');
})

app.post('/register',async(req,res,next) => {
    try {
        console.log(req.body)
        const { email, username, password , fullName } = req.body;  

        const user = new User({
            _id: username, 
            fullName: fullName,
            email: email
        });
        
        console.log("User to be registered : ",user)

        const registeredUser = await User.register(user, password);  
        req.login(registeredUser, err => {  
            if (err) return next(err);  
            req.flash('success', 'Welcome to the College Canteen!');  
            res.redirect('/home');  
        });
    } catch (e) {
        if (e.code === 11000) {
            req.flash('error', 'Username or email already exists');
            console.log(e);
        } else {
            req.flash('error', e.message);
        } 
        res.redirect('/register');  
    }
})

app.get('/login', (req, res) => {
    res.render('login');
})  

app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back!');
    res.redirect('/home');
})

app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/login');
    });
});

app.get('/menu', isLoggedIn,async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch menu items
        const items = await Item.find({});
        items.forEach(item => {
            item.image = `/itemimages/${item.image}`;
          });
        // Fetch cart data
        const cart = await Cart.findOne({ user: userId });

        // Create a map of item quantities in the cart
        const cartItemQuantities = cart ? cart.items.reduce((acc, curr) => {
            acc[curr.item] = curr.quantity;
            return acc;
        }, {}) : {};

        res.render('menu', { items, cartItemQuantities });
    } catch (error) {
        req.flash('error', `An error occurred while fetching the menu. Error: ${error.message}`);
        res.redirect('/home');
    }
});



app.get('/cart', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId }).populate('items.item');
        res.render('cart', { cart });
    } catch (e) {
        console.error(e);
        req.flash('error', 'An error occurred while fetching the cart.');
        res.redirect('/menu');
    }
});

app.post('/cart', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id; 
        const cartItems = req.body.items; 

        const newItems = Object.keys(cartItems)
            .map(itemId => ({
                item: itemId,  
                quantity: parseInt(cartItems[itemId], 10)
            }))
            .filter(item => item.quantity > 0);
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            
            cart = new Cart({ user: userId, items: newItems });
        } else {
            // Remove items from the cart that are not present in newItems
            cart.items = cart.items.filter(existingItem => 
                newItems.some(newItem => newItem.item === existingItem.item)
            );

            // Update existing items
            cart.items.forEach(existingItem => {
                const newItem = newItems.find(item => item.item === existingItem.item);
                if (newItem) {
                    existingItem.quantity = newItem.quantity;
                }
            });

            // Add new items that are not in the cart
            newItems.forEach(newItem => {
                if (!cart.items.some(item => item.item === newItem.item)) {
                    cart.items.push(newItem);
                }
            });
        }

        // Save the cart
        await cart.save();

        req.flash('success', 'Cart updated successfully!');
        res.redirect('/cart');
    } catch (error) {
        req.flash('error', `An error occurred while updating the cart. Error: ${error.message}`);
        res.redirect('/menu');
    }
});

app.post('/checkout', isLoggedIn, (req,res) => {
    try{
        req.flash('success','paid')
        res.redirect('/paid'); 
    }
    catch(e){
        console.log(e);
    }
});

app.get('/paid', (req,res) => {
    res.render('paid');
})

app.listen(3000,() => {
    console.log("Listening on PORT 3000");
})