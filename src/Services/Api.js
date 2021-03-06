import Config from '@/config/AppConfig';
import apisauce from 'apisauce';
import ApiUrl from '@/constants/Api';
import {Platform} from 'react-native';

const api = apisauce.create({
  baseURL: Config.apiBaseUrl,
  headers: {
    'Cache-Control': 'no-cache',
  },
  timeout: 10000,
});

const createFormData = (avatarSource, body) => {
  const data = new FormData();

  Object.keys(body).forEach(key => {
    data.append(key, body[key])
  });

  if (avatarSource && avatarSource.uri) {
    const uriSnippet = avatarSource.uri.split('/');
    const fileName = uriSnippet[uriSnippet.length - 1];
    const file = {
      name: fileName + '.jpg',
      type: avatarSource.type,
      uri: Platform.OS === 'android' ? avatarSource.uri : avatarSource.uri.replace('file://', '')
    };
    console.log(file);
    data.append('avatar', file);
    data.append('Content-Type', avatarSource.type);
  }
  return data;
};

export const logIn = (email, password, deviceUserId, deviceType) => api.post(ApiUrl.logIn, {email, password, deviceUserId, deviceType});

export const logOut = (userToken) =>
  api.post(
    ApiUrl.logOut,
    {},
    {
      headers:
        {userToken: userToken}
    }
  );

export const register = (email, fullName, password, phoneNumber, deviceUserId, deviceType) =>
  api.post(
    ApiUrl.register,
    {
      email,
      fullName,
      password,
      phoneNumber,
      deviceUserId,
      deviceType,
    }
  );

export const _updateProfile = async (
  userToken,
  fullName, email, phoneNumber, password, gender, bloodType, language, avatarUrl, avatarSource
) => {
  return new Promise(async (resolve, reject) => {
    let body = {
      fullName,
      email,
      phoneNumber,
      password,
      gender,
      bloodType,
      language,
      avatarUrl,
    };

    let params = createFormData(avatarSource, body);

    //return api.post(ApiUrl.details, params, {headers: {'Accept': 'multipart/form-data', 'Content-Type': 'multipart/form-data', userToken}})
    fetch(Config.apiBaseUrl + ApiUrl.details, {
      method: 'POST',
      headers: {
        Accept: 'multipart/form-data',
        'Content-Type': 'multipart/form-data',
        userToken: userToken
      },
      body: params
    }).then((response) => response.json())
      .then((data) => {
      console.log('Service/Api/updateProfile', 'Success', data);
      resolve({ok: true, data: data});
    }).catch(err => {
      console.log('Service/Api/updateProfile', 'Failed', err.message);
      resolve({ok: false, data: err});
    });
  });
};

export const updateProfile = (userToken, fullName, email, phoneNumber, password,  avatarUrl) =>
  api.post(ApiUrl.details, {fullName, email, phoneNumber, password,  avatarUrl}, {headers: {userToken}});

export const getVehicleName = (userToken) => api.get(ApiUrl.getVehicleName, {}, {headers: {userToken}});

export const getDriverList = (userToken, vehicleId, geoCoder) => api.post(ApiUrl.driverList, {vehicleId, geoCoder}, {headers: {userToken}});

export const setOfferSent = (userToken, vehicleId, offerLocation, offerTime, offerGeocoder, spendingTime) =>
    api.post(ApiUrl.offerSend, {vehicleId, offerLocation, offerTime, offerGeocoder, spendingTime}, {headers: {userToken}});

export const offerAccept = (userToken, vehicleId) => api.post(ApiUrl.offerAccept, {vehicleId}, {headers: {userToken}})

export const getAllOffer = (userToken, vehicleId, offerLocation, offerTime, offerGeocoder, spendingTime) =>
    api.post(ApiUrl.getAllOffer, {vehicleId, offerLocation, offerTime, offerGeocoder, spendingTime}, {headers: {userToken}});

export const searchDoctorsByCategory = (userToken, category) => api.post(ApiUrl.searchDoctorsByCategory, {category}, {headers: {userToken}});

export const searchDoctors = (userToken, name, speciality, address) => api.post(ApiUrl.searchDoctors, {name, speciality, address}, {headers: {userToken}});

export const requestBook = (userToken, doctorId, timestamp) => api.put(ApiUrl.userDoctor + '/' + doctorId + '/booking', {timestamp}, {headers: {userToken}});

export const submitReview = (userToken, doctorId, rating, description) => api.put(ApiUrl.userDoctor + '/' + doctorId + '/review', {rating, description}, {headers: {userToken}});

export const fetchDoctorById = (userToken, doctorId) => api.get(ApiUrl.userDoctor + '/' + doctorId, {},{headers: {userToken}});

export const fetchSpecialities = (userToken) => api.get(ApiUrl.fetchSpecialities, {}, {headers: {userToken}});
