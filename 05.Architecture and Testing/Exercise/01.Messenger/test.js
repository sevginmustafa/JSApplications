const { chromium } = require('playwright-chromium');
const { expect } = require('chai');

const mockData = {
    "-LxHVtajG3N1sU714pVj": {
        "author": "Spami",
        "content": "Hello, are you there?"
    },
    "-LxIDxC-GotWtf4eHwV8": {
        "author": "Garry",
        "content": "Yep, whats up :?"
    },
    "-LxIDxPfhsNipDrOQ5g_": {
        "author": "Spami",
        "content": "How are you? Long time no see? :)"
    },
    "-LxIE-dM_msaz1O9MouM": {
        "author": "George",
        "content": "Hello, guys! :))"
    },
    "-LxLgX_nOIiuvbwmxt8w": {
        "author": "Spami",
        "content": "Hello, George nice to see you! :)))"
    }
};

function json(data) {
    return {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mockData)
    };
}

describe('Tests', async function () {
    this.timeout(60000);

    let page, browser;

    before(async () => {
        browser = await chromium.launch();
    });

    after(async () => {
        await browser.close();
    });

    this.beforeEach(async () => {
        page = await browser.newPage();
    });

    this.afterEach(async () => {
        await page.close();
    });

    it('loads and displays all messages', async () => {
        await page.route('**/jsonstore/messenger*', (route) => {
            route.fulfill(json(mockData));
        });

        await page.goto('http://localhost:5500');

        await page.click('text=Refresh');

        const value = await page.inputValue('textarea');

        const array = value.split('\n');

        expect(array[0]).to.contains('Spami');
        expect(array[1]).to.contains('Garry');
        expect(array[2]).to.contains('Spami');
        expect(array[3]).to.contains('George');
        expect(array[4]).to.contains('Spami');
    });

    it('can send message', async () => {
        await page.goto('http://localhost:5500');

        await page.fill('#author', 'Author');
        await page.fill('#content', 'Content');

        const [request] = await Promise.all([
            page.waitForRequest(request => request.method() == 'POST'),
            page.click('text=Send')
        ]);

        const data = JSON.parse(request.postData());
        expect(data.author).to.equal('Author');
        expect(data.content).to.equal('Content');
    });
});