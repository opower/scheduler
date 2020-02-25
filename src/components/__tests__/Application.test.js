import React from "react";
import { render, waitForElement } from "@testing-library/react";
import Application from "components/Application";
import { act } from 'react-dom/test-utils';

describe('Application', () => {

  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    act(()=> {
        const { getByText } = render(<Application />);
        return waitForElement(() => getByText("Monday")).then(() => {
        fireEvent.click(getByText("Tuesday"));
        expect(getByText("Leopold Silvers")).toBeInTheDocument();
      });

    })
  
  });

});