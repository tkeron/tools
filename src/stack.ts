
export interface Stack<T> {
    pop: () => T;
    push: (item: T) => void;
    readonly length: number;
    current: T | null;
}

export const getLIFO = <T>(): Stack<T> => {

    const _stack: T[] = [];


    const stack = <Stack<T>>{
        pop: () => _stack.pop(),
        push: (item) => _stack.push(item),
        length: 0,
        current: <T><unknown>null
    };

    Object.defineProperty(stack, "current", {
        get: () => _stack.length ? _stack[_stack.length - 1] : null,
        set: (value) => {
            if (_stack.length) _stack[_stack.length - 1] = value;
        }
    });

    Object.defineProperty(stack, "length", {
        get: () => _stack.length,
    });


    return stack;


};

export const getFIFO = <T>(): Stack<T> => {

    const _stack: T[] = [];
    const stack = <Stack<T>>{
        pop: () => _stack.shift(),
        push: (item) => _stack.push(item),
        length: 0,
        current: <T><unknown>null
    };

    Object.defineProperty(stack, "current", {
        get: () => _stack.length ? _stack[0] : null,
        set: (value) => {
            if (_stack.length) _stack[0] = value;
        }
    });

    Object.defineProperty(stack, "length", {
        get: () => _stack.length,
    });

    return stack;

}
