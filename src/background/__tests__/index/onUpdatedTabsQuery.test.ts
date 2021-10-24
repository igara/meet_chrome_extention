export {};

describe('background/index/onUpdatedTabsQuery', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('タブがないとき', async () => {
    const chromeTabsSendMessageMock = jest.fn();
    // @ts-ignore
    global.chrome = {
      tabs: {
        // @ts-ignore
        onUpdated: {
          addListener: jest.fn(),
        },
        sendMessage: chromeTabsSendMessageMock,
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
    Index.onUpdatedTabsQuery([], 0);
    expect(chromeTabsSendMessageMock).not.toBeCalled();
  });

  test('タブのIDが一致しないとき', async () => {
    const chromeTabsSendMessageMock = jest.fn();
    // @ts-ignore
    global.chrome = {
      tabs: {
        // @ts-ignore
        onUpdated: {
          addListener: jest.fn(),
        },
        sendMessage: chromeTabsSendMessageMock,
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
    Index.onUpdatedTabsQuery([{ id: 1 }], 2);
    expect(chromeTabsSendMessageMock).not.toBeCalled();
  });

  test('タブのIDが一致するとき', async () => {
    const chromeTabsSendMessageMock = jest.fn();
    // @ts-ignore
    global.chrome = {
      tabs: {
        // @ts-ignore
        onUpdated: {
          addListener: jest.fn(),
        },
        sendMessage: chromeTabsSendMessageMock,
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
    Index.onUpdatedTabsQuery([{ id: 1 }], 1);
    expect(chromeTabsSendMessageMock).toBeCalled();
  });
});
