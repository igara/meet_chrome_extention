export {};

describe('background/index/onUpdated', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('タブのURLがないとき', async () => {
    const chromeTabsQuery = jest.fn();
    // @ts-ignore
    global.chrome = {
      tabs: {
        // @ts-ignore
        onUpdated: {
          addListener: jest.fn(),
        },
        query: chromeTabsQuery,
      },
      runtime: {
        // @ts-ignore
        onMessage: {
          addListener: jest.fn(),
        },
      },
    };

    const Index = await require('@src/background/index');
    // @ts-ignore
    Index.onUpdated(0, {}, {});
    expect(chromeTabsQuery).not.toBeCalled();
  });

  test('info.status === completeではないとき', async () => {
    const chromeTabsQuery = jest.fn();
    // @ts-ignore
    global.chrome = {
      tabs: {
        // @ts-ignore
        onUpdated: {
          addListener: jest.fn(),
        },
        query: chromeTabsQuery,
      },
      runtime: {
        // @ts-ignore
        onMessage: {
          addListener: jest.fn(),
        },
      },
    };

    const Index = await require('@src/background/index');
    // @ts-ignore
    Index.onUpdated(0, { status: 'loading' }, { url: 'http://hoge.fuga' });
    expect(chromeTabsQuery).not.toBeCalled();
  });

  test('meetのURLではないとき', async () => {
    const chromeTabsQuery = jest.fn();
    // @ts-ignore
    global.chrome = {
      tabs: {
        // @ts-ignore
        onUpdated: {
          addListener: jest.fn(),
        },
        query: chromeTabsQuery,
      },
      runtime: {
        // @ts-ignore
        onMessage: {
          addListener: jest.fn(),
        },
      },
    };

    const Index = await require('@src/background/index');
    // @ts-ignore
    Index.onUpdated(0, { status: 'complete' }, { url: 'http://hoge.fuga' });
    expect(chromeTabsQuery).not.toBeCalled();
  });

  test('chrome.tabs.queryが呼ばれる', async () => {
    const chromeTabsQuery = jest.fn();
    // @ts-ignore
    global.chrome = {
      tabs: {
        // @ts-ignore
        onUpdated: {
          addListener: jest.fn(),
        },
        query: chromeTabsQuery,
      },
      runtime: {
        // @ts-ignore
        onMessage: {
          addListener: jest.fn(),
        },
      },
    };

    const Index = await require('@src/background/index');
    // @ts-ignore
    Index.onUpdated(0, { status: 'complete' }, { url: 'https://meet.google.com/' });
    expect(chromeTabsQuery).toBeCalled();
  });
});
