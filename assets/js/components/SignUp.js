import React from "react"
import Logo from "../../static/images/logocargo.svg";

const styles = {
  signUp: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    zIndex: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    width: 300,
    height: 290,
    padding: 16,
    paddingTop: 0,
    marginTop: 60,
    borderRadius: 2,
  },
  formRow: {
    paddingLeft: 12,
    paddingBottom: 6,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
}

class SignUp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      firstName: "",
      lastName: "",
      companyName: "",
      email: "",
      developer: false,
    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onCancel = this.onCancel.bind(this)
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit(e) {
    e.preventDefault()

    fetch("api/signup", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.state)
    })
    .then(() => {
      console.log("Email submitted")
    })
    .catch(err => {
      console.log("Email submission error")
    })

    this.onCancel(e)
  }

  onCancel(e) {
    e.preventDefault()
    if (window.localStorage) {
      window.localStorage.setItem("seenSignUp", true)
    }
    this.props.hideSignUp()
  }

  render() {
    const { firstName, lastName, companyName, email, developer } = this.state
    return (
      <div style={styles.signUp}>
        <div style={styles.card}>
          <Logo style={{...styles.paddingBox, paddingTop: 16, paddingBottom: 16 }} />
          <p>Enter your details to discuss IoT asset tracking use cases with Helium.</p>
          <form style={{ marginTop: 16 }} onSubmit={this.onSubmit}>
            <div style={styles.formRow}>
              <input name="firstName" onChange={this.onChange} value={firstName} placeholder="First Name" required/>
            </div>
            <div style={styles.formRow}>
              <input name="lastName" onChange={this.onChange} value={lastName} placeholder="Last Name" required/>
            </div>
            <div style={styles.formRow}>
              <input name="companyName" onChange={this.onChange} value={companyName} placeholder="Company Name" required/>
            </div>
            <div style={styles.formRow}>
              <input name="email" type="email" onChange={this.onChange} value={email} placeholder="Email" required/>
            </div>
            <div style={styles.formRow}>
              <input type="checkbox" name="developer" onChange={() => this.setState({ developer: !developer })} checked={developer} />
              <label style={{ fontSize: 10 }}>I am a developer</label>
            </div>
            <div style={{...styles.formRow, paddingTop: 8 }}>
              <input type="submit" value="Submit" style={{ marginRight: 20 }} />
              <input type="submit" value="Cancel" onClick={this.onCancel} />
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default SignUp
