const assert = require('assert');
const tqdm = require('../src/');
const {
	sleepFor,
	range,
	infiniteGenerator,
	asyncInfiniteGenerator,
	createMockRender
} = require('./utils');

(async () => {
	{
		console.log('\x1b[36m%s\x1b[0m', "TEST CASE: array");
		const mock = createMockRender();

		for (const _ of tqdm(range(10), { render: mock.render })) {
			await sleepFor(100);
			assert(mock.context.n <= _, JSON.stringify([mock.context, _]));
		}

		assert(mock.context.elapsed >= 10 * 100, JSON.stringify([mock.context]));
		assert(mock.context.total === 10, JSON.stringify([mock.context]));

		console.log('\x1b[32m%s\x1b[0m', "\t Passed.");
	}
	{
		console.log('\x1b[36m%s\x1b[0m', "TEST CASE: infinite generator");
		const mock = createMockRender();

		for (const _ of tqdm(infiniteGenerator(), { render: mock.render, total: 10 })) {
			await sleepFor(100);
			assert(mock.context.n <= _, JSON.stringify([mock.context, _]));
		}

		assert(mock.context.elapsed >= 10 * 100, JSON.stringify([mock.context]));
		assert(mock.context.total === 10, JSON.stringify([mock.context]));
		console.log('\x1b[32m%s\x1b[0m', "\t Passed.");
	}
	{
		console.log('\x1b[36m%s\x1b[0m', "TEST CASE: async infinite generator");
		const mock = createMockRender();

		for await (const _ of tqdm(asyncInfiniteGenerator(), { render: mock.render, total: 10 })) {
			await sleepFor(100);
			assert(mock.context.n <= _, JSON.stringify([mock.context, _]));
		}

		assert(mock.context.elapsed >= 10 * 100, JSON.stringify([mock.context]));
		assert(mock.context.total === 10, JSON.stringify([mock.context]));
		console.log('\x1b[32m%s\x1b[0m', "\t Passed.");
	}
})();