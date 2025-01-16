import { IdType } from "../model/id";
import { UiState } from "../stores/ui";

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

type PluralityStrings = {
  singular: string;
  plurality: string;
};

const getStringOrPlurality = (objectType: string | string[] | PluralityStrings): PluralityStrings => {
  if (typeof objectType === 'string') {
    if (objectType.endsWith('s')) {
      return { singular: objectType.slice(0, -1), plurality: objectType };
    } else {
      return { singular: objectType, plurality: `${objectType}s` };
    }
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unknownType: any = objectType as unknown;
    if (unknownType.singular && unknownType.plurality) {
      return objectType as PluralityStrings;
    }
    const arrayType = objectType as string[];
    return { singular: arrayType[0], plurality: arrayType[1] };
  }
};

export const footerEffectHelper = (id: IdType|null|undefined|string, objectType: string | string[] | PluralityStrings, uiState: UiState) => {
  const { setFooterLinks, setTitle } = uiState;
  const labelStrings = getStringOrPlurality(objectType);
  const updatedLinks = [{ target: '/' + labelStrings.plurality, text: `Back to ${labelStrings.plurality}` }];
  setFooterLinks(updatedLinks);

  if (typeof id === 'string') {
    const idInt = parseInt(id);
    if (idInt > 0) {
      setTitle(`Edit ${labelStrings.singular}`);
    } else {
      setTitle(`Create ${labelStrings.singular}`);
    }
  } else {
    console.log(`${labelStrings.singular} id may have changed, but is not string: `, id);
  }
};

export const getLoadStatusFromQueryList = (
    currentStatus: PageLoadStatus,
    ...statusList: string[]
  ): PageLoadStatus => {
    let updatedLoadStatus = currentStatus;
    if (statusList.includes('error')) {
      updatedLoadStatus = PageLoadStatus.Error;
    } else if (statusList.includes('pending')) {
      updatedLoadStatus = updatedLoadStatus | PageLoadStatus.Loading;
    } else if (statusList.every((status) => status === 'success')) {
      updatedLoadStatus = PageLoadStatus.Loaded;
    }
    if (currentStatus & PageLoadStatus.NotLoggedIn) {
      updatedLoadStatus = updatedLoadStatus | PageLoadStatus.NotLoggedIn;
    }
    return updatedLoadStatus;
  };
