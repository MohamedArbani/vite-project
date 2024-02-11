import axios from 'axios';

const APP_ID = 'WMb8rx1XtzBaeQdSPiNCEd7LQgi41Vl4tx4o7i4o';
const API_KEY = 'SLjBP1cxBzCf6H9jqhkLrk6B6unknNBeoHrbXvZ0';

export async function signup(username, email, password) {
  const url = 'https://parseapi.back4app.com/users';
  const headers = {
    'X-Parse-Application-Id': APP_ID,
    'X-Parse-REST-API-Key': API_KEY,
    'X-Parse-Revocable-Session': '1',
    'Content-Type': 'application/json'
  };
  const data = {
    username,
    email,
    password
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function login(username, password) {
  const url = 'https://parseapi.back4app.com/login';
  const headers = {
    'X-Parse-Application-Id': APP_ID,
    'X-Parse-REST-API-Key': API_KEY,
    'X-Parse-Revocable-Session': '1',
  };
  const params = {
    username,
    password
  };

  try {
    const response = await axios.get(url, { params, headers });
    return response.data;
  } catch (error) {
    throw error;
  }
}