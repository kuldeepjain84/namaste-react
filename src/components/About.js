import React from "react";
import User from "./User";

class About extends React.Component{
    constructor(props){
        super(props);
        console.log("parent constructor")
        // all state variable store in this this.state is big object contains all state variable
    }


    
    render(){
        return(
        <div>
            <h1>About Us</h1>
            <p>This is about us page</p>
            <User name={name} location={location} />
        </div>
        );
    }
}

export default About;