export const log = (type: string) => console.log.bind(console, type);

export enum PageLoadStatus {
  Initialised = 1,
  Ready = 2,
  Loaded = 4,
  ValidEmptyDataSet = 16,
  Loading = 256,
  InsufficientPrivileges = 1024,
  Error = 2048,
  RequiredDataMissing = 4096,
}

export const isValidLoadedStatus = (status: PageLoadStatus) => {
  return status <= PageLoadStatus.Loaded && (PageLoadStatus.Loaded === PageLoadStatus.Loaded);
};

export const isReadyStatus = (status: PageLoadStatus) => {
  return status & PageLoadStatus.Ready;
};
