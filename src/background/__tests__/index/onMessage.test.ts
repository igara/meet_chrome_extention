export {};

describe('background/index/onMessage', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('Background_MeetMeeting拾ったときの確認', async () => {
    // @ts-ignore
    global.chrome = {
      tabs: {
        // @ts-ignore
        onUpdated: {
          addListener: jest.fn(),
        },
      },
      runtime: {
        // @ts-ignore
        onMessage: {
          addListener: jest.fn(),
        },
      },
    };

    jest.doMock('@src/background/models/dexie', () => ({
      IndexDB: {
        comments: {
          put: (arg: any) => {
            expect({
              meet_url: 'https://meet.google.com/xxxxx',
              meet_title: 'hoge',
              created: '2020/12/31 23:59:59',
              comment: 'fuga 23:59',
              modified: '2021/01/01 00:00:00',
            }).toStrictEqual(arg);
          },
        },
      },
    }));
    const mockDate = new Date('2021-01-01T00:00:00');
    // @ts-ignore
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    const Index = await require('@src/background/index');

    const meetURL = 'https://meet.google.com/xxxxx';
    const created = '2020/12/31 23:59:59';

    // @ts-ignore
    Index.onMessage(
      {
        event: 'Background_MeetMeeting',
        meetURL,
        meetTitle: 'hoge',
        comments: 'fuga 23:59',
        created,
      },
      null,
      () => {},
    );
  });

  test('日付の10月以降の月の0埋め確認', async () => {
    // @ts-ignore
    global.chrome = {
      tabs: {
        // @ts-ignore
        onUpdated: {
          addListener: jest.fn(),
        },
      },
      runtime: {
        // @ts-ignore
        onMessage: {
          addListener: jest.fn(),
        },
      },
    };

    jest.doMock('@src/background/models/dexie', () => ({
      IndexDB: {
        comments: {
          put: (arg: any) => {
            expect({
              meet_url: 'https://meet.google.com/xxxxx',
              meet_title: 'hoge',
              created: '2020/12/31 23:59:59',
              comment: 'fuga 23:59',
              modified: '2021/10/01 00:00:00',
            }).toStrictEqual(arg);
          },
        },
      },
    }));
    const mockDate = new Date('2021-10-01T00:00:00');
    // @ts-ignore
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    const Index = await require('@src/background/index');

    const meetURL = 'https://meet.google.com/xxxxx';
    const created = '2020/12/31 23:59:59';

    // @ts-ignore
    Index.onMessage(
      {
        event: 'Background_MeetMeeting',
        meetURL,
        meetTitle: 'hoge',
        comments: 'fuga 23:59',
        created,
      },
      null,
      () => {},
    );
  });
});
