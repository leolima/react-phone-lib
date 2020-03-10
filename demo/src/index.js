import React from 'react';
import { render } from 'react-dom';

import PhoneInput from '../../dist/main';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
    }
  }

  handleChangeNumber = (val) => {
    this.setState({ phone: val });
  }

  render() {
    const { phone } = this.state;
    return (
      <div>
        <h2>React Phone lib - Demo</h2>
        <PhoneInput debug value={phone} onChange={this.handleChangeNumber} />
      </div>
    );
  }
}

render(
  <App />, 
  document.getElementById('app')
);