import {fetcher} from '../fetcher';
import useSWRMutation from 'swr/dist/mutation';
import {Methods} from '../typings';
import Endpoint from '../Endpoint';
import {omit} from 'lodash';
import {
  Error,
  ParamsCreateAccount,
  ParamsForgotPassword,
  ParamsGetStatus,
  ParamsLogin,
  ParamsUpdate,
  ParamsUpdatePassword,
  ParamsUploadAvatar,
  ParamsVerifyOTP,
  ParamsVerifyPhone,
  ResponseAuth,
} from './typings';

export const useVerifyPhoneNumber = () => {
  return useSWRMutation<ResponseAuth, Error, string, ParamsVerifyPhone>(
    `${Endpoint.Auth.VERIFY_PHONE_NUMBER}`,
    (url: string, {arg}: {arg: ParamsVerifyPhone}) => {
      return fetcher(url, Methods.POST, arg);
    },
  );
};
export const useCreateAccount = () => {
  const {trigger} = useSWRMutation<
    ResponseAuth,
    Error,
    string,
    ParamsCreateAccount
  >(
    `${Endpoint.Auth.COMMON}`,
    (url: string, {arg}: {arg: ParamsCreateAccount}) => {
      return fetcher(url, Methods.POST, arg);
    },
  );
  return {
    triggerCreateAccount: trigger,
  };
};

export const useVerifyOtp = () => {
  const {trigger} = useSWRMutation<
    ResponseAuth,
    Error,
    string,
    ParamsVerifyOTP
  >(
    `${Endpoint.Auth.VERIFY_OTP}`,
    (url: string, {arg}: {arg: ParamsVerifyOTP}) => {
      return fetcher(url, Methods.POST, arg);
    },
  );
  return {triggerVerifyOtp: trigger};
};

export const useLogin = () => {
  const {trigger, error} = useSWRMutation<
    ResponseAuth,
    Error,
    string,
    ParamsLogin
  >(`${Endpoint.Auth.LOGIN}`, (url: string, {arg}: {arg: ParamsLogin}) => {
    return fetcher(url, Methods.POST, arg);
  });
  return {triggerLogin: trigger, error};
};

export const useLogout = () => {
  const {trigger} = useSWRMutation<ResponseAuth, Error, string>(
    `${Endpoint.Auth.LOGOUT}`,
    (url: string) => {
      return fetcher(`${url}`, Methods.POST);
    },
  );
  return {triggerLogout: trigger};
};

export const useForgotPassword = () => {
  const {trigger} = useSWRMutation<
    ResponseAuth,
    Error,
    string,
    ParamsForgotPassword
  >(
    `${Endpoint.Auth.FORGOT_PASSWORD}`,
    (url: string, {arg}: {arg: ParamsForgotPassword}) => {
      return fetcher(url, Methods.POST, arg);
    },
  );
  return {triggerForgotPassword: trigger};
};

export const useUpdatePassword = () => {
  const {trigger} = useSWRMutation<
    ResponseAuth,
    Error,
    string,
    ParamsUpdatePassword
  >(
    `${Endpoint.Auth.COMMON}`,
    (url: string, {arg}: {arg: ParamsUpdatePassword}) => {
      return fetcher(
        `${url}/${arg.userId}/new-password`,
        Methods.POST,
        omit(arg, 'userId'),
      );
    },
  );
  return {triggerUpdatePassword: trigger};
};

export const useUpdate = () => {
  const {trigger} = useSWRMutation<ResponseAuth, Error, string, ParamsUpdate>(
    `${Endpoint.Auth.COMMON}`,
    (url: string, {arg}: {arg: ParamsUpdate}) => {
      return fetcher(
        `${url}/${arg.userId}/update-information`,
        Methods.POST,
        omit(arg, 'userId'),
      );
    },
  );
  return {triggerUpdate: trigger};
};

export const useUploadAvatar = () => {
  const {trigger} = useSWRMutation<
    ResponseAuth,
    Error,
    string,
    ParamsUploadAvatar
  >(
    `${Endpoint.Auth.COMMON}`,
    (url: string, {arg}: {arg: ParamsUploadAvatar}) => {
      return fetcher(
        `${url}/${arg.userId}/update-avatar`,
        Methods.POST,
        omit(arg, 'userId'),
      );
    },
  );
  return {triggerUploadAvatar: trigger};
};

export const useGetStatus = () => {
  const {trigger} = useSWRMutation<ResponseAuth, any, string>(
    Endpoint.Auth.COMMON,
    (url: string, {arg}: {arg: ParamsGetStatus}) => {
      return fetcher(`${url}/${arg.userId}/get-status`, Methods.GET);
    },
  );
  return {
    triggerGetStatus: trigger,
  };
};

export const useSendSMS = () => {
  const {trigger} = useSWRMutation<
    ResponseAuth,
    Error,
    string,
    ParamsVerifyPhone
  >(
    `${Endpoint.Auth.SEND_SMS}`,
    (url: string, {arg}: {arg: ParamsVerifyPhone}) => {
      return fetcher(url, Methods.POST, arg);
    },
  );
  return {
    triggerSendSMS: trigger,
  };
};
