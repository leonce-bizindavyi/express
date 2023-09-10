import React from 'react'
import {Link} from 'react-router-dom'

function PageNotFound() {
  return (
    <>
        <h1>404 Page Not Found !</h1>
        <h3>Go  to the Home page <Link to='/'>Home</Link> </h3>
    </>
  )
}

export default PageNotFound