//React:
import React from "react"; 
import { useState, useRef, useEffect } from "react";
import { useResolvedPath, useNavigate, useMatch, Link, Outlet } from "react-router-dom";

//Firebase:
import firebase from "firebase/app"; 
import { getStorage, ref } from "firebase/storage";   

//CSS: 
import "./PageStyles.css";

import Icon from '@mdi/react';
import { 
    mdiSteering, mdiCar, mdiCar2Plus, 
    mdiTrophy, mdiCart, mdiArrowLeft, mdiArrowRight,
    mdiCircleSmall
} from '@mdi/js';

import { SimpleGrid, Card, CardHeader, CardBody, CardFooter, Heading, Text, Button } from '@chakra-ui/react'

const Home = () => {
    
    
    const slides = [
        {url: "https://firebasestorage.googleapis.com/v0/b/crypto-racers.appspot.com/o/StarterBackgrounds%2Fmoonlight-preview-big.png?alt=media&token=f8c70bdd-707a-4113-9ac7-80f6ff2e1a5b", title: "Moonlight"},
        {url: "https://firebasestorage.googleapis.com/v0/b/crypto-racers.appspot.com/o/StarterBackgrounds%2Fneon-preiview-big.png?alt=media&token=e0e8f0d6-0c64-41a7-977f-3a3f5f9e359a", title: "Neon"},
        {url: "https://firebasestorage.googleapis.com/v0/b/crypto-racers.appspot.com/o/StarterBackgrounds%2Fsky-lines-preview-big.png?alt=media&token=4ec6bc01-d72d-4ff8-b8f3-312d22548242", title: "Sky Lines"},
        {url: "https://firebasestorage.googleapis.com/v0/b/crypto-racers.appspot.com/o/StarterBackgrounds%2Fsynthwave-preview-big.png?alt=media&token=b46a93f4-d4b3-4b0e-93d5-98184058dd04", title: "Synthwave"}
    ]; 


    function ImageSlider (props: any) {

        const [currentIndex, setCurrentIndex] = useState(0);

        useState(() => {

            const interval = setInterval(() => {
                
                setCurrentIndex(currentIndex => (currentIndex === 3 ? 0 : (currentIndex === 0 ? 3 : currentIndex + 1)));

            }, 5000); //every 10 sec

            return () => clearInterval(interval);
        })

        return (
            
            <div className = "slide">
                <h1>{props[currentIndex].title}</h1>

                <img src = {props[currentIndex].url}/>
            </div>   
        );
    }

    return (

        <div className = "home-wrapper">

            <div className = "home-header-container">

                <Icon path = {mdiSteering} size = {3} color = 'white'/>
                <h1> Crypto Racers </h1>
                <Icon path = {mdiSteering} size = {3} color = 'white' />
            </div>


            <div className = "home-card-container">

                <Card align = 'center' size = 'lg' 
                    className = 'home-card' style = {{backgroundColor: '#2d2d2d', color: 'white'}}>

                    <CardHeader>
                        <Heading size = 'xl'>Single Player</Heading>
                    </CardHeader>

                    <CardBody>
                        <Icon path = {mdiCar} size = {3}/>
                    </CardBody>

                    
                </Card>

                <Card align = 'center' size = 'lg' 
                    className = "home-card"  style = {{backgroundColor: '#2d2d2d', color: 'white'}}>

                    <CardHeader>
                        <Heading size = 'xl'>Multi Player</Heading>
                    </CardHeader>

                    <CardBody>
                        <Icon path = {mdiCar2Plus} size = {3}/>
                    </CardBody>

                    
                </Card>

                <Card align = 'center' size = 'lg' 
                    className = "home-card"  style = {{backgroundColor: '#2d2d2d', color: 'white'}}>

                    <CardHeader>
                        <Heading size = 'xl'>Leaderboards</Heading>
                    </CardHeader>

                    <CardBody>
                        <Icon path = {mdiTrophy} size = {3} />
                    </CardBody>

                    
                </Card>

                <Card align = 'center' size = 'lg' 
                    className = "home-card"  style = {{backgroundColor: '#2d2d2d', color: 'white'}}>

                    <CardHeader>
                        <Heading size = 'xl'>Marketplace</Heading>
                    </CardHeader>

                    <CardBody>
                        <Icon path = {mdiCart} size = {3} />
                    </CardBody>

                </Card>

                
            </div>

            <hr className = "line"/>

            <ImageSlider {...slides}/>
            
        </div>
    )
}

export default Home; 