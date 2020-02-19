import React from 'react';
import './InterviewerList.scss';
import InterviewerListItem from 'components/InterviewerListItem';

/**
interviewers:array - an array of objects containing the information of each interviewer
interviewer:number - the id of an interviewer
setInterviewer:function - a function that accepts an interviewer id
 */


export default function InterviewerList (props){

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {
          props.interviewers.map(interview => {
            return (
              <InterviewerListItem
                key={interview.id}
                name={interview.name}
                avatar={interview.avatar}
                selected={interview.id === props.value}
                setInterviewer={() => props.onChange(interview.id)}
              />
            );
          })
        }
      </ul>
    </section>

  );

}