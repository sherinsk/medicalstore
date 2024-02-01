var express=require('express')
const bodyParser = require('body-parser');
const mongoose=require('mongoose')
const paginate=require('express-paginate')
const session=require('express-session')
const PORT=process.env.PORT || 3000;
mongoose.connect('mongodb+srv://sherinsk007:yNZGXhfhU0MJahvp@cluster0.1vvjouq.mongodb.net/?retryWrites=true&w=majority')

app=express()


app.set('views','./views')
app.set('view engine','pug')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(paginate.middleware(4,50))

app.use(session({secret:'mashupstack',resave:false,saveUninitialized:true,cookie:{maxAge:24*60*60*1000}}))

const authenticate=(req,res,next)=>{
	if(req.session.email)
	{
		next()
	}
	else
	{
		res.redirect('/login')
	}
}

const authenticate1=(req,res,next)=>{
	if(!(req.session.email))
	{
		next()
	}
	else
	{
		res.redirect('/user/dashboard')
	}
}

users=require('./routes/medicine.js')
user=require('./models/auth_user.js')


app.use('/user',authenticate,users)




app.get('/login',authenticate1,(req,res)=>{
	lerrors=[]
	res.render('login',{lerrors})})


app.get('/signup',authenticate1,(req,res)=>{
	errors=[]
	email=''
	pwd1=''
	pwd2=''
	res.render('signup',{errors,email,pwd1,pwd2})})



app.post('/signup',async(req,res)=>{

	email=req.body.email
	pwd1=req.body.pwd1
	pwd2=req.body.pwd2

	errors=[]

	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	const existuser=await user.find({email:email})

	if(existuser.length>0)
	{
		errors.push('User already exists')
	}
	if(!(emailRegex.test(email)))
	{
		errors.push('Enter a valid email address')
	}
	if(pwd1.length<8)
	{
		errors.push('passwords must be atleast 8 characters long')
	}
	if(pwd1!==pwd2)
	{
		errors.push('password do not match')
	}

	if(errors.length>0)
	{
		res.render('signup',{errors,email,pwd1,pwd2})
	}
	else
	{
		msg=new user({email:email,password:pwd1})
		msg.save()
		res.redirect('/login')
		
	}

})


app.post('/login',async(req,res)=>{
	email=req.body.email
	pwd=req.body.password
	lerrors=[]
	const luser=await user.find({$and:[{email:email},{password:pwd}]})

	if(luser.length==1)
	{
		req.session.email=email;
		console.log(email)
		res.redirect('/user/dashboard')
	}
	else
	{
		lerrors.push('Invalid')

		res.render('login',{lerrors})
	}


})


app.get('/logout',(req,res)=>{
	req.session.destroy(()=>{
		res.redirect('/login')
	})
})

app.listen(PORT,()=>{console.log('server started')})