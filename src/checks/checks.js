const Comparison = {
    EQUALS: 0,
    LESS_THAN: 1,
    MORE_THAN: 2,
    BETWEEN: 3,
};

const check = (component, value, comparison) => {
    return new Promise((resolve, reject) => {
        if (typeof comparison !== 'number')
            reject(Error('Must pass a number in "comparison" argument.'));

        if (!component || !value)
            reject(Error('Invalid component or value argument.'));

        switch (comparison) {
            case Comparison.EQUALS: {
                if (component === value) resolve('Component check passed.');
                else reject(Error(`Component does not equal ${value}.`));
                break;
            }
            case Comparison.LESS_THAN: {
                if (component < value) resolve('Component check passed.');
                else reject(Error(`Component not less than ${value}.`));
                break;
            }
            case Comparison.MORE_THAN: {
                if (component > value) resolve('Component check passed.');
                else reject(Error(`Component not more than ${value}.`));
                break;
            }
            case Comparison.BETWEEN: {
                if (!value.length || value.length !== 2)
                    reject(Error('Invalid number of values.'));
                else if (value[0] <= component && component <= value[1])
                    resolve('Component check passed.');
                else if (value[0] <= component)
                    reject(Error(`Component above maximum value ${value[1]}.`));
                else
                    reject(
                        Error(`Component lower than minimum value ${value[0]}.`)
                    );
                break;
            }
            default: {
                reject(Error('Invalid comparison argument.'));
            }
        }
    });
};

module.exports = {
    Comparison,
    check,
};
