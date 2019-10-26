export const resolveAfterDelay = function <T>(result: T, time: number = 0): Promise<T> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(result)
        }, time)
    });

};
