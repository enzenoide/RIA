export function squareFor(array: Array<number>): Array<number> {
    const result: Array<number> = [];
    for (let item of array) {
        result.push(item * item);
    }
    return result;
}

export function squareForEach(array: Array<number>): Array<number> {
    const result: Array<number> = [];
    array.forEach((item) => {
        result.push(item * item);
    });
    return result;
} 
