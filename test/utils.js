async function sleepFor(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}

function range(N) {
    return [...[...Array(N).keys()]];
}

function* infiniteGenerator() {
    let i = 0;
    while (true)
        yield i++;
}

async function* asyncInfiniteGenerator() {
    let i = 0;
    while (true)
        yield i++;
}

function createMockRender() {
    const res = {
        context: { n: 0, total: 0, elapsed: 0 },
        render: (n, total, elapsed, sameLine) => {
            res.context = {
                ...res.context,
                n, total, elapsed
            };
        }
    };

    return res;
}

module.exports = {
    createMockRender,
    sleepFor,
    range,
    infiniteGenerator,
    asyncInfiniteGenerator
}