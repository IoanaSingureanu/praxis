// FHIMProfileContainer Reducer

const fhimProfileListReducerDefaultState = [];

export default (state = fhimProfileListReducerDefaultState, action) => {
  switch (action.type) {
    case 'ADD_PROFILE_ENTRY':
      return [
        ...state,
        action.fhimProfile
      ];
    case 'REMOVE_PROFILE_ENTRY':
      return state.filter(({ id }) => id !== action.id);
    case 'EDIT_PROFILE_ENTRY':
      return state.map((fhimProfile) => {
        if (fhimProfile.id === action.id) {
          return {
            ...fhimProfile,
            ...action.updates
          };
        } else {
          return fhimProfile;
        };
      });
    case 'SET_PROFILE_ENTRIES':
      return action.fhimProfileList;
    default:
      return state;
  }
};
