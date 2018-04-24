export default class indexModel {
    constructor(ctx) {}
    getData() {
        const _promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve("得到了我的数据")
            }, 1000);
        });
        return _promise;
    }
}