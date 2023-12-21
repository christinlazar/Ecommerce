

const isLogin = async(req,res,next)=>{
    try {
        if(req.session.user){
             res.redirect('/home')
        }else{
        next()
        }
       
    } catch (error) {
        console.log(error)
    }
}
const isLogout = async(req,res)=>{
    try {
       if(req.session.user){
        next()
       }else{
        res.redirect('/')
       } 
    } catch (error) {
    console.log(error)    
    }
}
module.exports = {
    isLogin,
    isLogout
}