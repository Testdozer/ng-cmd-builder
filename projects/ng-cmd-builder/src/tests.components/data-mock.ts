export type IDataMock<T> = {
    [P in keyof T]?: IDataMock<T[P]> | any;
};

export const dataMock = <T>(instance: IDataMock<T>): T => instance as any;
