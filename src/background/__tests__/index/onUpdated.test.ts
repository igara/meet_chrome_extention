export {};

describe('background/index/onUpdated', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('タブのURLがないとき', async () => {
    const chromeTabsQueryMock = jest.fn();
    // @ts-ignore
    global.chrome = {
      tabs: {
        // @ts-ignore
        onUpdated: {
          addListener: jest.fn(),
        },
        query: chromeTabsQueryMock,
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
    expect(chromeTabsQueryMock).not.toBeCalled();
  });

  test('info.status === completeではないとき', async () => {
    const chromeTabsQueryMock = jest.fn();
    // @ts-ignore
    global.chrome = {
      tabs: {
        // @ts-ignore
        onUpdated: {
          addListener: jest.fn(),
        },
        query: chromeTabsQueryMock,
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
    expect(chromeTabsQueryMock).not.toBeCalled();
  });

  test('meetのURLではないとき', async () => {
    const chromeTabsQueryMock = jest.fn();
    // @ts-ignore
    global.chrome = {
      tabs: {
        // @ts-ignore
        onUpdated: {
          addListener: jest.fn(),
        },
        query: chromeTabsQueryMock,
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
    expect(chromeTabsQueryMock).not.toBeCalled();
  });

  test('chrome.tabs.queryが呼ばれる', async () => {
    const chromeTabsQueryMock = jest.fn();
    // @ts-ignore
    global.chrome = {
      tabs: {
        // @ts-ignore
        onUpdated: {
          addListener: jest.fn(),
        },
        query: chromeTabsQueryMock,
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
    expect(chromeTabsQueryMock).toBeCalled();
  });
});
