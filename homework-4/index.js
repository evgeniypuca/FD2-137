// class Validator {
//     constructor (arrValidators, modification = {mode: 'single'}) {
//         this.validators = arrValidators;
//         this.modification = modification;
//         this.enabled = true;
//     }
//     enable() {
//         this.enabled = true;
//     }
//     disable() {
//         this.enabled = false;
//     }
//     toggle(value) {
//         if (value !== undefined) {
//             this.enabled = value;
//         } else {
//             this.enabled = !this.enabled;
//         }
//     }

//     validate(value) {
//         if (!this.enabled) {
//             return null;
//         }
//         let result = {};

//         for (let elem of this.validators) {
//             if (elem(value) !== null) {
//                 result = { ...result, ...elem(value) };
//                 if (this.modification.mode === 'single') {
//                     break;
//                 }
//             }
//         }

//         if (Object.keys(result).length === 0) {
//             return null;
//         } else {
//             return result;
//         }
//     } 
// }
//---------------------------------------------------------

class Validator {
    #enabled = true;
    

    constructor(functions, modification = { mode: 'single' }) {
        this.modification = modification;
        this.arrFunctions = functions;
     }
    get enabled() {
        return this.#enabled;
    }

    enable() {
        this.#enabled = true;
    }
    disable() {
        this.#enabled = false;
    }
    toggle(stat = !this.#enabled) {
        this.#enabled = stat;
    }
 

    validate(value) {
        if (this.enable === false) {
            return null;
        }

        switch (this.modification.mode) {
            case 'multi':return this.multifunction(value);
            
            case 'single':return this.singlefunction(value);

            default:
        }
    }
    singlefunction (value) {
        for (let elem of this.arrFunctions){
            if (elem(value)){
                return elem(value);
            }
            return null;   
        }
    }
    multifunction(value) {
       const errors = this.arrFunctions.reduce((acc, elem) => {
            if (elem(value)){
                acc.push(elem(value));
            } return acc;
       }, []);
       return errors.length ? Object.assign({}, ...errors) : null;
    }
}


const required = (value) => {
    return Boolean(value) ? null : { required: true };
};
const minLength = (minLength) => {
    return (value) => {
        return String(value).length >= minLength ? null : { minLength: true };
    };
};
const maxLength = (maxLength) => {
    return (value) => {
        return String(value).length <= maxLength ? null : { maxLength: true };
    };
};
const min = (min) => {
    return (value) => {
        return value >= min ? null : { min: true };
    };
};
const max = (max) => {
    return (value) => {
        return value <= max ? null : { max: true };
    };
};

const validator = new Validator([
    required,
    minLength(5),
    maxLength(25),
]);

console.log(validator.validate('test')); // {minLength: true}
console.log(validator.validate('')); // {required: true}
console.log(validator.validate('successful')); // null

const multiValidator = new Validator([
    required,
    minLength(5),
    maxLength(25),
    min('111110'),
    max('111113')
], { mode: 'multi' });

console.log(multiValidator.validate(null));

