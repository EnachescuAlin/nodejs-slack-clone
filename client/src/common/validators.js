export default class Validators {
    static required = (input, message) => input &&  input.length > 0 || message;
    static minLength = (input, length, message) => input && input.length >= length || message;
    static maxLength = (input, length, message) => input && input.length <= length || message;
    static matchValue = (input, matchInput, message) => input === matchInput || message;
    static matchRegex = (input, regex, message) => regex.test(input) || message;
    static serverError = (message, inputChanged) => inputChanged ? true : message || true;
    static evaluate = (validators) => Object.keys(validators)
                                    .map(key => validators[key].filter(x => typeof x() == 'string').length == 0)
                                    .reduce((prev, curr) => prev && curr, true)
}