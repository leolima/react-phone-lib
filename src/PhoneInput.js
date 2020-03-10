import React from "react";
import libPhone from "google-libphonenumber";
import codes from './codes/countryCodes.json';
import '../node_modules/flag-icon-css/css/flag-icon.min.css';
import "./styles/main.css";

import PropTypes from "prop-types";

// [E164, INTERNATIONAL, NATIONAL, RFC3966]
const PNF = libPhone.PhoneNumberFormat;

const PHONETYPE = {
  0: "FIXED_LINE",
  1: "MOBILE",
  2: "FIXED_LINE_OR_MOBILE",
  3: "TOLL_FREE",
  4: "PREMIUM_RATE",
  5: "SHARED_COST",
  6: "VOIP",
  7: "PERSONAL_NUMBER",
  8: "PAGER",
  9: "UAN",
  10: "VOICEMAIL",
  "-1": "UNKNOWN"
};

const phoneUtil = libPhone.PhoneNumberUtil.getInstance();

/**
 * <PhoneInput />
 * @format = ["E164", "INTERNATIONAL", "NATIONAL", "RFC3966"] default: INTERNATIONAL
 */
class PhoneInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      number: null,
      countries: {},
      codes: {},
      selectedCode: null
    };
  }

  componentDidMount() {
    this.handleChange();
    this.loadCodes();
    this.loadLanguage();
  }

  loadCodes = () => {
    const { defaultCountry } = this.props;
    try {
      if (codes) {
        this.setState({ codes });
      }
      if (defaultCountry) {
        this.setState({
          selectedCode: codes[`${defaultCountry}`.toLowerCase()],
          regionCode: defaultCountry
        });
      }
    } catch (err) {
      console.error("phone-input-lib: error on load codes");
    }
  };

  loadLanguage = () => {
    const { language } = this.props;
    if (language) {
      try {
        const data = require(`./locale/${language}.json`);
        if (data) {
          this.setState({ countries: data });
        }
      } catch (err) {
        console.error("phone-input-lib: Language not supported yet");
      }
    }
  };

  handleChange = e => {
    const phone = e && e.target && e.target.value;
    const { regionCode, onChange, autoFormat, format, debug } = this.props;
    const { selectedCode } = this.state;

    try {
      let phoneToProcess = phone || "";
      if (format !== "INTERNATIONAL") {
        if (`${phone}`.includes("+")) {
          phoneToProcess = phone;
        } else {
          phoneToProcess = `+${selectedCode || ""}${phoneToProcess.substr(
            (selectedCode || "").length + 1
          )}`;
        }
      }

      const parsedPhone = phoneUtil.parse(phoneToProcess);
      const regionCodeActual =
        phoneUtil.getRegionCodeForNumber(parsedPhone) || regionCode;

      this.setState(
        {
          selectedCode: parsedPhone.getCountryCode(),
          regionCode: regionCodeActual,
          number: {
            countryCode: parsedPhone.getCountryCode(),
            nationalNumber: parsedPhone.getNationalNumber(),
            countryCodeSource: parsedPhone.getCountryCodeSource(),
            rawInput: parsedPhone.getRawInput(),
            isValid: phoneUtil.isValidNumber(parsedPhone),
            regionCode: regionCodeActual,
            numbeType: PHONETYPE[phoneUtil.getNumberType(parsedPhone)],
            E164: phoneUtil.format(parsedPhone, PNF.E164),
            originalFormat: phoneUtil.formatInOriginalFormat(
              parsedPhone,
              regionCodeActual
            ),
            NATIONAL: phoneUtil.format(parsedPhone, PNF.NATIONAL),
            INTERNATIONAL: phoneUtil.format(parsedPhone, PNF.INTERNATIONAL),
            internationalOutFormat: phoneUtil.formatOutOfCountryCallingNumber(
              parsedPhone,
              regionCodeActual
            ),
            RFC3966: phoneUtil.formatOutOfCountryCallingNumber(
              parsedPhone,
              regionCodeActual
            )
          }
        },
        () => {
          if (onChange) {
            if (autoFormat && format && this.state.number[format]) {
              onChange(this.state.number[format]);
            } else {
              onChange(phone);
            }
          }
          if (debug) {
            console.log("state", this.state);
          }
        }
      );
    } catch (err) {
      this.setState({ number: null });
      if (onChange) {
        onChange(phone);
      }
    }
  };

  handleSelect = e => {
    const { codes } = this.state;
    this.setState({
      selectedCode: codes[`${e.target.value}`.toLowerCase()],
      regionCode: `${e.target.value}`.toUpperCase()
    });
  };

  render() {
    const styles = this.props.styles || {};
    const { value, label, selectClass } = this.props;
    const { countries, regionCode } = this.state;

    return (
      <div className="iti__container" ref={this.containerRef}>
        {label && <label style={styles.label}>{label}</label>}
        
        {Object.keys(countries).length > 0 && (
          <select
            aria-label={countries.country}
            className={`${selectClass} flag-icon flag-icon-${`${regionCode}`.toLowerCase()}`}
            onChange={this.handleSelect}
            value={`${regionCode}`.toUpperCase()}
          >
            {Object.keys(countries).map(k => {
              if (k !== "ext" && k !== "country" && k !== "phone") {
                return (
                  <option
                    value={k}
                  >
                    {countries[k]}
                  </option>
                );
              }
            })}
          </select>
        )}

        <input
          value={value}
          type="text"
          style={styles.input}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}


PhoneInput.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  styles: PropTypes.object,
  defaultCountry: PropTypes.string,
  autoFormat: PropTypes.bool,
  debug: PropTypes.bool,
  language: PropTypes.string,
  format: PropTypes.string,
  selectClass: PropTypes.string
};

PhoneInput.defaultProps = {
  debug: false,
  selectClass: "",
  language: "pt",
  autoFormat: true,
  format: "INTERNATIONAL",
  label: null,
  value: "",
  defaultCountry: "BR",
  styles: {
    label: {
      color: "green"
    },
    input: {
      background: "#f1f1f1",
      border: "1px solid #aaa"
    }
  }
};

export default PhoneInput;
