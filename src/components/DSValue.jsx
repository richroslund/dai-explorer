import React from 'react';
import web3 from '../web3';
import AnimatedNumber from '../AnimatedNumber';
import { formatNumber, copyToClipboard } from '../helpers';

var dsvalue = require('../abi/dsvalue');

class DSValue extends React.Component {

  state = {
    value: null,
    valid: null
  }

  componentWillMount() {
    this.v = web3.eth.contract(dsvalue.abi).at(this.props.address);
    this.filter = this.v.LogNote({}, (e,r) => {
      this.update();
    })
    this.update();
  }

  componentWillUnmount() {
    this.filter.stopWatching();
  }

  update = () => {
    this.v.peek((error, res) => {
      if (!error) {
        this.setState({
          value: res[0],
          valid: res[1]
        })
      }
    });
  }

  render() {
    return(
      <p>
        <span className={ `label label-${typeof this.state.valid === 'boolean' ? (this.state.valid ? 'success' : 'danger') : 'warning'}` }>
          { typeof this.state.valid === 'boolean' ? (this.state.valid ? 'VALID' : 'INVALID') : 'N/A' }
        </span>
        &nbsp;
        <strong>
          <AnimatedNumber
            value={ web3.toBigNumber(this.state.value) }
            title={ formatNumber(this.state.value) }
            formatValue={ n => formatNumber(n, 3) }
            className="printedNumber"
            onClick = { copyToClipboard } />
        </strong>
      </p>
    );
  }
}

export default DSValue;
