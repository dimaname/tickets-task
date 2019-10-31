export const resolveAfterDelay = function <T>(result: T, time: number = 0): Promise<T> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(result)
        }, time)
    });

};

export const rejectAfterDelay = function (result: unknown, time: number = 0): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject()
        }, time)
    });

};
