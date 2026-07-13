import React from "react";

class User extends React.Component{
    constructor(props){
        super(props);
        //console.log(this.props.name + "child constructor");
        // all state variable store in this this.state is big object contains all state variable
        this.state = {
            userInfo:{
                name: "John deo",
                location: "amd"
            }
        };
    }

    async componentDidMount(){
        //console.log("called"); return;
        // Api call
        const data = await fetch("https://api.github.com/users/kuldeepjain84");
        const response = await data.json();
        console.log(response);
        this.setState({
            userInfo : response
        });
    };

    render(){
        console.log(this.state.userInfo);
        const {name, location, avatar_url} = this.state.userInfo;
        return(
        <div className="user-card">
            <img src={avatar_url}  alt="profile" />
            <h1>{name}</h1>
            <h2>Location : {location}</h2>
            <h2>Author : @kdjain</h2>
        </div>
        );
    }
}

export default User;