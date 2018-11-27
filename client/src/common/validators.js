export default class Validators {
    static required = (input, message) => input &&  input.length > 0 || message;
    static minLength = (input, length, message) => input && input.length >= length || message;
    static matchValue = (input, matchInput, message) => input === matchInput || message;
    static matchRegex = (input, regex, message) => regex.test(input) || message;
}