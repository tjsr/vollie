export const log = (type: string) => console.log.bind(console, type);

export const pageLoadStatusString = (status: PageLoadStatus) =>
  Object.keys(PageLoadStatus)
    .filter(key => isNaN(Number(key)))
    .filter(key => PageLoadStatus[key as keyof typeof PageLoadStatus] & status)
    .join(' | ');

export enum PageLoadStatus {
  Undefined = 0,
  Initialised = 1,
  Ready = 2,
  Loaded = 4,
  ValidEmptyDataSet = 16,
  SchemaNotLoaded = 32,
  Loading = 256,
  InsufficientPrivileges = 1024,
  Error = 2048,
  RequiredDataMissing = 4096,
  NotLoggedIn = 8192,
}

export const isValidLoadedStatus = (status: PageLoadStatus) => {
  return status <= PageLoadStatus.Loaded && (PageLoadStatus.Loaded === PageLoadStatus.Loaded);
};

export const isReadyStatus = (status: PageLoadStatus) => {
  return status & PageLoadStatus.Ready;
};
