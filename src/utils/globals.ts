export enum Environment {
    Prod = 'PROD',
    Dev = 'DEV'
}

export const ENVIRONMENT = (process.env.ENVIRONMENT ?? Environment.Dev).toUpperCase() as Environment;
export const IS_DEV = ENVIRONMENT === Environment.Dev
export const IS_PROD = ENVIRONMENT === Environment.Prod