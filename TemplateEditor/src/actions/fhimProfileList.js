import uuid from 'uuid';
import database from '../firebase/firebase';
import moment from 'moment';

// ADD_PROFILE_ENTRY
export const addFHIMProfile = (fhimProfile) => ({
  type: 'ADD_PROFILE_ENTRY',
  fhimProfile
});

export const startAddFHIMProfile = (fhimProfileData = {}) => {
  return (dispatch, getState) => {
    const uid = getState().auth.uid;
    const now = new Date().getTime();
  
    const {
      patientID = '',
      profileID = '',
      profileUsage = '',
      createdAt = new Date().getTime()
    } = fhimProfileData;
    const fhimProfile = { patientID, profileID, profileUsage,createdAt};

    return database.ref(`users/${uid}/fhimProfileList`).push(fhimProfile).then((ref) => {
      dispatch(addFHIMProfile({
        id: ref.key,
        ...fhimProfile
      }));
    });
  };
};

// REMOVE_PROFILE_ENTRY
export const removeFHIMProfile = ({ id } = {}) => ({
  type: 'REMOVE_PROFILE_ENTRY',
  id
});

export const startRemoveFHIMProfile = ({ id } = {}) => {
  return (dispatch, getState) => {
    const uid = getState().auth.uid;
    return database.ref(`users/${uid}/fhimProfileList/${id}`).remove().then(() => {
      dispatch(removeFHIMProfile({ id }));
    });
  };
};

// EDIT_PROFILE_ENTRY
export const editFHIMProfile = (id, updates) => ({
  type: 'EDIT_PROFILE_ENTRY',
  id,
  updates
});

export const startEditFHIMProfile = (id, updates) => {
  return (dispatch, getState) => {
    const uid = getState().auth.uid;
    return database.ref(`users/${uid}/fhimProfileList/${id}`).update(updates).then(() => {
      dispatch(editFHIMProfile(id, updates));
    });
  };
};

// SET_PROFILE_ENTRIES
export const setFHIMProfileList = (fhimProfileList) => ({
  type: 'SET_PROFILE_ENTRIES',
  fhimProfileList
});

export const initFHIMProfileList = () => {
  return (dispatch, getState) => {
    const uid = getState().auth.uid;
    return database.ref(`users/${uid}/fhimProfileList`).once('value').then((snapshot) => {
      const fhimProfileList = [];
/*
      snapshot.forEach((childSnapshot) => {
        fhimProfileList.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
*/
      dispatch(setFHIMProfileList(fhimProfileList));
    });
  };
};


export const loadFHIMProfileList = () => {
  return (dispatch, getState) => {
    const uid = getState().auth.uid;
    return database.ref(`users/${uid}/fhimProfileList`).once('value').then((snapshot) => {
      const fhimProfileList = [];
      snapshot.forEach((childSnapshot) => {
        fhimProfileList.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      dispatch(setFHIMProfileList(fhimProfileList));
    });
  };
};
