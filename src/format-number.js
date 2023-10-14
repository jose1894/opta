const decimalDirective = {
    mounted(el) {
        el.addEventListener('blur', (event) => {
            const value = event.target.value;
            const parsedValue = parseFloat(value.replace(/,/g, ''));
            const number = isNaN(parsedValue) ? 0 : parsedValue;
            const formattedValue = number.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            event.target.value = formattedValue;
        });

        el.addEventListener('input', (event) => {
            const value = event.target.value;
            const newValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
            event.target.value = newValue;
        });
    }
};

export default decimalDirective;
