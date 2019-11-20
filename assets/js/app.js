import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Main from "./pages/main"

class Login extends React.Component {
  render() {
    return (
      <div>
        <h1>Login Page</h1>
        <Link to="/">Home</Link>
      </div>
    )
  }
}

class HelloReact extends React.Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={Main}/>
        <Route path="/login" component={Login}/>
      </Router>
    )
  }
}

ReactDOM.render(
  <HelloReact/>,
  document.getElementById("react-app")
)
