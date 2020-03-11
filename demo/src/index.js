import React from "react";
import { render } from "react-dom";

import PhoneInput from "react-phone-lib";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: ""
    };
  }

  handleChangeNumber = val => {
    this.setState({ phone: val });
  };

  handleOnBlur = () => {
    console.log("onBlur called");
  };

  handleOnFocus = () => {
    console.log("onFocus called");
  };

  validateNumber = (obj) => {
    if (obj && obj.isValid) {
      console.log("The number is valid");
    }
  };

  render() {
    const { phone } = this.state;
    return (
      <div>
        <h2>React Phone lib - Demo</h2>
        <PhoneInput
          debug
          autoFormat
          value={phone}
          onChange={this.handleChangeNumber}
          onBlur={this.handleOnBlur}
          callBack={this.validateNumber}
          onFocus={this.handleOnFocus}
          format="INTERNATIONAL"
          language="es"
          label="Phone"
          inputId="phone"
          defaultCountry="ES"
          inputClass="input-class"
          selectClass="select-class"
          containerClass="container-class"
        />
      </div>
    );
  }
}

render(<App />, document.getElementById("app"));
