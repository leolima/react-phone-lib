import React from "react";
import libPhone from "google-libphonenumber";
import codes from "./codes/countryCodes.json";
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
          if (onChange !== null && typeof onChange === 'function') {
            if (autoFormat && format && this.state.number[format]) {
              onChange(this.state.number[format]);
            } else {
              onChange(phone);
            }
          }
          this.sendCallBack();
          if (debug) {
            console.log("state", this.state);
          }
        }
      );
    } catch (err) {
      this.setState({ number: null });
      if (onChange !== null && typeof onChange === 'function') {
        onChange(phone);
        this.sendCallBack();
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

  sendCallBack = () => {
    const { callBack } = this.props;
    if (callBack !== null && typeof callBack === 'function') {
      callBack(this.state.number);
    }
  };

  handleOnBlur = () => {
    const { onBlur } = this.props;
    if (onBlur !== null && typeof onBlur === 'function') {
      onBlur();
    }
    this.sendCallBack();
  };
  handleOnFocus = () => {
    const { onFocus } = this.props;
    if (onFocus !== null && typeof onFocus === 'function') {
      onFocus();
    }
    this.sendCallBack();
  };

  render() {
    const {
      value,
      label,
      selectClass,
      inputId,
      containerClass,
      inputClass
    } = this.props;
    const { countries, regionCode } = this.state;

    return (
      <div className={`iti__container ${containerClass}`}>
        {label && <label htmlFor={inputId}>{label}</label>}

        {Object.keys(countries).length > 0 && (
          <div class="iti__flag_container">
            <span className={`iti__flag iti__${`${regionCode}`.toLowerCase()}`} />
            <select
              aria-label={countries.country}
              className={`${selectClass}`}
              onChange={this.handleSelect}
              value={`${regionCode}`.toUpperCase()}
            >
              {Object.keys(countries).map(k => {
                if (k !== "ext" && k !== "country" && k !== "phone") {
                  return <option value={k}>{countries[k]}</option>;
                }
              })}
            </select>
          </div>
        )}

        <input
          id={inputId}
          value={value}
          type="text"
          onChange={this.handleChange}
          onBlur={this.handleOnBlur}
          onFocus={this.handleOnFocus}
          className={inputClass}
        />
      </div>
    );
  }
}

PhoneInput.propTypes = {
  debug: PropTypes.bool,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onChange: PropTypes.func,
  callBack: PropTypes.func,
  label: PropTypes.string,
  value: PropTypes.string,
  inputId: PropTypes.string,
  format: PropTypes.string,
  language: PropTypes.string,
  autoFormat: PropTypes.bool,
  defaultCountry: PropTypes.string,
  inputClass: PropTypes.string,
  selectClass: PropTypes.string,
  containerClass: PropTypes.string
};

PhoneInput.defaultProps = {
  debug: false,
  onBlur: null,
  onFocus: null,
  onChange: null,
  callBack: null,
  label: null,
  value: "",
  inputId: null,
  format: "INTERNATIONAL",
  language: "pt",
  autoFormat: true,
  defaultCountry: "BR",
  inputClass: "",
  selectClass: "",
  containerClass: ""
};

export default PhoneInput;
