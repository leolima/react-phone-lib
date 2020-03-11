# React Phone Lib

Encapsuling libphonenumber in React.js.

https://github.com/google/libphonenumber

## Installation

    $ yarn add react-phone-lib


or

    $ npm install react-phone-lib


## Usage


    ```
    handleChangeNumber = val => this.setState({ phone: val });

    handleOnBlur = () => console.log("onBlur called");

    handleOnFocus = () => console.log("onFocus called");

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
    ```


## Development

### Build

    $ yarn build

### Running on localhost

    $ cd demo && yarn start


## Properties

| property | propType  | required | deafult | description
| ------- | -------- | -------- | ------ | ----------- |
| debug | bool | - | false | shows a console log with the current state after each key pressed
| onBlur | func | - | null | execute a callback function when the event onBlur occurs on phone input
| onFocus | func | - | null | execute a callback function when the event onFocus occurs on phone input
| onChange | func | - | null | execute a callback function when the event onChange occurs on phone input
| callBack | fucn | - | null | execute a callback function passing the actual state when 'onBlur, onFocus and onChange' events occurs
| label | string | - | null | set the label
| value | string | - | '' | set the input value
| inputId | string | - | null | set the input ID
| format | string | - | 'INTERNATIONAL' | controls how the input value will be formatted: <br /> E164: "+5511999999999" <br /> INTERNATIONAL: "+55 11 99999-9999" <br /> NATIONAL: "(11) 99999-9999" <br /> RFC3966: "(11) 99999-9999"
| language | string | - | 'pt' | set the language to translate country labels <br /> current available languages: <br /> ['de', 'el', 'en', 'es', 'fi', 'fr', 'it', 'nb', 'pl', 'pt', 'ru', 'sv', 'vi']
| autoFormat | bool | - | true | enables the auto formatting
| defaultCountry | string | - | 'BR' | set the initial country
| inputClass | string | - | null | set a class css for the number field
| selectClass | string | - | null | set a class css for the select field
| containerClass | string | - | null | set a class css for the container div

<br />
<br />

![Demonstration](https://raw.githubusercontent.com/leolima/react-phone-lib/master/demo/src/img/demo.gif)

