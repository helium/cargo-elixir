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
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: 400,
    padding: 40,
    borderRadius: 10,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50% , -50%)',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  formRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
        boxSizing: 'border-box',

  },

  forminput: {
    height: '20px',
    width: '100%',
    fontSize: 15,
    padding: 8,
    border: 'none',
    background: '#f1f1f1',
    borderRadius: 3,
   
},

button: {
  padding: '6px 12px',
  color: 'white',
  background: '#38A2FF',
  borderRadius: 999,
  margin: 10,
  fontSize: 16,
  fontWeight: 500,
  width: '45%',
  border: 'none'
},



buttonsecondary: {
  padding: '6px 12px',
  color: '#38A2FF',
  background: 'white',
  borderRadius: 999,
  margin: 10,
  fontSize: 16,
  fontWeight: 500,
  width: '45%',
  border: '1px solid #38A2FF',
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
      body: JSON.stringify({
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        company_name: this.state.companyName,
        email: this.state.email,
        developer: this.state.developer,
      })
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
          <form style={{ marginTop: 30 }} onSubmit={this.onSubmit}>
            <div style={styles.formRow}>
              <input name="firstName" style={{...styles.forminput, marginRight: 10}}   onChange={this.onChange} value={firstName} placeholder="First Name" required/>
              <input name="lastName" style={styles.forminput}   onChange={this.onChange} value={lastName} placeholder="Last Name" required/>

            </div>
          
            <div style={styles.formRow}>
              <input style={styles.forminput} name="companyName" onChange={this.onChange} value={companyName} placeholder="Company Name" required/>
            </div>
            <div style={styles.formRow}>
              <input name="email" style={styles.forminput} className="forminput" type="email" onChange={this.onChange} value={email} placeholder="Email" required/>
            </div>
            <div style={styles.formRow}>
              <input type="checkbox" style={{marginLeft: 0, marginRight: 10}} name="developer" onChange={() => this.setState({ developer: !developer })} checked={developer} />
              <label style={{ fontSize: 14 }}>I am a Developer</label>
            </div>
            <div style={{...styles.formRow, paddingTop: 10 }}>
              <input type="submit" style={styles.button} value="Submit" />
              <input type="submit" style={styles.buttonsecondary} value="Cancel" onClick={this.onCancel} />
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default SignUp
