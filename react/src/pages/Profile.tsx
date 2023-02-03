//React:
import React from "react";
import { useState, useRef, useEffect } from "react"; 

//Firebase:
import "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFirestore, Timestamp, collection, orderBy, query, where, getDoc, doc, getDocs } from "firebase/firestore";

//Web3:
import { useAddress } from '@thirdweb-dev/react';
import { fetchNFTs } from "../utils/FetchNFTs";  

//CSS:
import "./ProfileStyles.css";
import Icon from '@mdi/react'; 
import { Avatar, Image, Box, Button } from '@chakra-ui/react';
import { mdiTrophy, mdiCrown, mdiCloseThick, mdiAccountGroup, mdiAccountEdit, mdiCar } from '@mdi/js'; 

const Profile = () => {

    //Init Lib: 
    const db = getFirestore();
    const auth = getAuth(); 
    const address = useAddress(); 

    //Firebase State:
    const [username, setUsername] = useState(); 
    const [background, setBackground] = useState(); 
    const [pfp, setPfp] = useState(); 
    const [friends, setFriends] = useState([]); 
    const [wins, setWins] = useState(); 
    const [losses, setLosses] = useState(); 

    //Web3 State: 
    const [cars, setCars] = useState([]); 
    const [trophies, setTrophies] = useState([]);


    useEffect (() => {

        fetchUserData();  
       
    })

    
    const fetchUserData = async () => {

        if (auth.currentUser === undefined) {
            return; 
        }

        if (auth.currentUser) {

            const userRef = doc(db, "users", auth.currentUser.uid); 
            const userDocSnap = await getDoc(userRef); 

            if (userDocSnap.exists()) {

                //Set State:

                setUsername(userDocSnap.data().username);
                setBackground(userDocSnap.data().background);
                setPfp(userDocSnap.data().pfp); 

                setFriends(userDocSnap.data().friends); 
                setWins(userDocSnap.data().wins); 
                setLosses(userDocSnap.data().losses); 
            }
        }
    }

    return (

        <div className = "profile-wrapper">

            <div className = "profile-container">

                <div className = "profile-background-container">

                    <Image 
                        boxSize = '100%'
                        objectFit = 'cover'
                        src = {background}
                        alt = "Bg"

                        style = {{borderRadius: '1rem', opacity: '0.5'}}
                    />
                    
                    <div className = "profile-picture-container">

                        <Image 
                            boxSize = '100%' 
                            borderRadius = 'full'
                            objectFit = 'cover'
                            src = {pfp}
                            alt = "pfp"
                           
                            style = {{border: '5px solid #514f4f'}}
                        />
                    </div>
                    
                </div>

                <div className = "profile-info-container">

                    <div className = "profile-info-section">
                        
                        <Button size = "lg">
                            @{username}
                        </Button>

                        <Button size = "lg">
                            <Icon path = {mdiAccountEdit} size = {1.5} />
                            Edit Profile  
                        </Button>
                    </div>
  
                    
                    <div className = "profile-info-section">

                       
                        <Button size = "lg">
                            <Icon path = {mdiCrown} size = {1.5} />
                            {wins} Wins  
                        </Button>

                        <Button size = "lg">
                            <Icon path = {mdiCloseThick} size = {1.5} />
                            {losses} Losses 
                        </Button>


                        <Button size = "lg">
                            <Icon path = {mdiAccountGroup} size = {1.5} />
                            {friends.length} Friends
                        </Button>
                    </div>


                    <hr className = "line"></hr>

                    <div className = "profile-info-section">
                        
                        <Button size = "lg">
                            <Icon path = {mdiCar} size = {1.75} />
                            Cars
                        </Button>
                    </div>

                    <div className = "profile-info-section">
                        
                        <Button size = "lg">
                            <Icon path = {mdiTrophy} size = {1.75} />
                            Trophies
                        </Button>
                    </div>

                </div>
            
            </div>

        </div>
    )
}

export default Profile; 