import React from "react"
import ReactDOM from "react-dom"
import '../css/app.css'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import MapScreen from "./pages/MapScreen"
import StatsPage from "./pages/StatsPage"

class App extends React.Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={MapScreen}/>
        <Route exact path="/stats" component={StatsPage}/>
      </Router>
    )
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById("react-app")
)
