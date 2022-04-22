const isLoggedIn = (req,res,next)=>{
  // console.log(req.session)
  if(!req.session.userId) {
    const error = 'Please Login to invest'
    res.redirect(`/login?error=${error}`)
  } else {
    next()
  }
}

const isAdmin = (req,res,next) => {
  // console.log(req.session)
  if(req.session.role !=='admin') {
    console.log(req.session);
    const error = 'You have no access'
    res.send(error)
    // res.redirect(`/login?error=${error}`)
  } else {
    next()
  }
}


module.exports = {isLoggedIn,isAdmin}