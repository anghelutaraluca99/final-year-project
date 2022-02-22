async function GetUser() {

    let resp = await fetch('http://localhost:3000/', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
    });

    if(resp.status === 401) {
        return {error: "Unauthorised"};
    }

    if(resp.status === 200) {
        let user = await resp.json();
        return user; 
    }
}

export default GetUser;
