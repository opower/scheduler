export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

const lookUp = {
  SET_DAY: (state, action) => {
    const { day } = action;
    return {...state, day}
  },
  SET_APPLICATION_DATA: (state, action) => {
    const { days, appointments, interviewers } = action;
    return {...state, days, appointments, interviewers}
  },
  SET_INTERVIEW: (state, action) => {
    const { interview, appointments, days} = action;
    return interview ? {...state, appointments, days} : {...state, appointments, days};
  }
}

export function reducer(state, action) {
  return lookUp[action.type](state, action);
}