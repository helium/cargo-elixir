import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import MapScreen from "./pages/MapScreen"

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

class App extends React.Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={MapScreen}/>
        <Route path="/login" component={Login}/>
      </Router>
    )
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById("react-app")
)
