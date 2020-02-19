  //will return an aray of appointments for the given day
  export function getAppointmentsForDay(state, day){
    const filteredDays = state.days.filter(day1 => day1.name === day);
    if(filteredDays.length === 0){
      return [];
    }

    let dayAppointments = filteredDays[0].appointments;
    if(dayAppointments.length === 0 ){
      return [];
    }

    let appointments = Object.values(state.appointments);
    let appoint = [];
    
    for(const i in appointments){
      if(dayAppointments.includes(appointments[i].id)){
        appoint.push(appointments[i]);
      }
    }
    return appoint;
  }

  // export function getInterviewersForDay(state, day){

  //   const filteredDay = state.days.filter(day1 => day1.name === day);

  //   if()
  //   return filteredDay[0].interviewers;
    

  // }

  export function getInterview(state, interview){

    if(!interview){
      return null;
    }

    let interviewObj = {};
    interviewObj['student'] = interview.student;
    let interviewerID = interview.interviewer;
    let interviewers = Object.values(state.interviewers);
    
    for(const i of interviewers){
      if(i.id === interviewerID){
        interviewObj['interviewer'] = i;
      }
    }
    return interviewObj;
  
  }

