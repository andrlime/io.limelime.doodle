/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import React, { FunctionComponent, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Q.module.css';

type Round = {
  flight: string;
  teamA: string;
  teamB: string;
  roomCode: string;
  judgeName: string;
}

type RoundProps = {rounds: Array<Round>}
type TwoRoundProps = {rounds: Array<Round>, alsoRounds: Array<Round>}

const SingleFlightTable: FunctionComponent<RoundProps> = ({rounds}) => {
  return (
    <>
      {rounds.map((item, index) => (
        <tr style={{height: "1rem"}}>
          <td key={index} style={{width:"10%"}}>A</td><td style={{width:"20%"}}>{item.teamA}</td><td style={{width:"20%"}}>{item.teamB}</td><td style={{width:"25%"}}>{item.roomCode}</td><td style={{width:"25%"}}>{item.judgeName}</td>
        </tr>
      ))}
    </>
  )
}

const DoubleFlightTable: FunctionComponent<TwoRoundProps> = ({rounds, alsoRounds}) => {
  return (
    <>
      {processed(rounds, alsoRounds).map((item, index) => (
        <tr style={{height: "1rem"}}>
          <td key={index} style={{width:"5%"}}>A</td><td style={{width:"10%"}}>{item.teamA}</td><td style={{width:"10%"}}>{item.teamB}</td><td style={{width:"12.5%"}}>{item.roomCode}</td><td style={{width:"12.5%"}}>{item.judgeName}</td>
          <td key={index} style={{width:"5%"}}>B</td><td style={{width:"10%"}}>{item.twoTeamA}</td><td style={{width:"10%"}}>{item.twoTeamB}</td><td style={{width:"12.5%"}}>{item.twoRoomCode}</td><td style={{width:"12.5%"}}>{item.twoJudgeName}</td>
        </tr>
      ))}
    </>
  )
}

const processed = (rounds: Array<Round>, roundsTwo: Array<Round>) => {
  let combinedArray = [];
  for (let index = 0; index < rounds.length; index++) {
    let ra = rounds[index];
    let rb = roundsTwo[index] || {teamA: "", teamB: "", roomCode: "", judgeName: ""};
    combinedArray.push({teamA: ra.teamA, teamB: (ra.teamB.length > 2 && ra.teamA.length > 2 ? ra.teamB : "BYE"), roomCode: ra.roomCode, judgeName: ra.judgeName,
      twoTeamA: rb.teamA, twoTeamB: rb.teamB, twoRoomCode: rb.roomCode, twoJudgeName: rb.judgeName});
  }

  return combinedArray;
}

const Home: NextPage = () => {
  const [heading, setHeading] = useState("");
  const [roundsA, setRoundsA] = useState<Array<Round>>([]);
  const [roundsB, setRoundsB] = useState<Array<Round>>([]);
  const [startTime, setStartTime] = useState("");
  const [hasFlightB, setHas] = useState(false);

  const processInput = (input: string) => {
    const REGEX = /.+/g; //matches all full lines
    const HEADER_RX = /[A-Z,a-z,0-9, ^,]+/g;
    const ROUND_RX = /[A-Za-z0-9 &-]+/g;
    const FB_RX = /Flt2/g;

    if(input.match(FB_RX)?.length != 0) {
      setHas(true);
    } else {
      setHas(false);
    }

    let [flightA, flightB]: [Array<Round>, Array<Round>] = [[], []];
    let allRounds = input.match(REGEX) || [];
    if(allRounds.length < 2) {
      setHeading("Invalid Input");
      return false;
    }

    let headerInfo = allRounds[0].match(HEADER_RX) || [];
    let header = `${headerInfo[0]} ${headerInfo[2]}`;
    let rounds = allRounds.slice(1);
    const ROUND_NO = (headerInfo[2].match(/\d+/g) || [])[0] || "0";

    for (const key in rounds) {
      let roundInfo = rounds[key].match(ROUND_RX) || [];
      let round: Round;
      if(parseInt(ROUND_NO) <= 2) {
        round = {flight: roundInfo[1], teamA: roundInfo[2], teamB: roundInfo[4], roomCode: roundInfo[6], judgeName: roundInfo[7]};
      } else {
        round = {flight: roundInfo[2], teamA: roundInfo[3], teamB: roundInfo[5], roomCode: roundInfo[7], judgeName: roundInfo[8]};
      }
      
      console.log(roundInfo);
      if(round.flight === "Flt1") {
        flightA.push(round)
      } else {
        flightB.push(round);
      }
    }

    setHeading(header);
    setRoundsA(flightA);
    setRoundsB(flightB);
  }

  const process = (time: string, value: number) => {
    if(value < 1000) {
      return `${time.charAt(0)}:${time.substring(1)}`
    } else if (value < 2400) {
      return `${time.substring(0,2)}:${time.substring(2)}`
    }
  }

  return (
    <div className={styles.everything}>
      <Head>
        <title>Tabroom Doodle</title>
        <link rel="icon" type="image/x-icon" href="/icon.png"/>
      </Head>
      
      <ol>
        How to use this tool:
        <li>From Tabroom, click "Reports". Download the "Horizonal Schematic". You will get a CSV file.</li>
        <li>Open this file in ANY TEXT EDITOR, such as Text Edit on Apple or Notepad on Windows.</li>
        <li>Copy EVERYTHING from that file into this big textbox. Control/CMD A to select everything.</li>
        <li>Type in the start time.</li>        
      </ol>

      <textarea onChange={(e) => processInput(e.target.value)} style={{width: "80vw", height: "25vh", resize: "none"}}/>
      <input value={startTime} onChange={(e) => (parseInt(e.target.value) <= 2400 && parseInt(e.target.value) >= 0) ? setStartTime(e.target.value || "") : setStartTime("")}></input> Input a numeric time. 9:00 AM should be "900". 2:00 PM can either be 0200 or 1400.
      <br/>

      <div style={{backgroundColor: "white", padding: "3rem", marginTop: "1rem", textAlign: "center"}}>
        <p style={{fontSize: "1.5rem", fontWeight: "900", margin: "0", color: "#0E397A"}}>{heading}</p>

        <div style={{display: "flex", flexDirection: "row", width: "80vw"}}>
          <table className={styles.table}>
            {hasFlightB ? (<>
              <tr style={{height: "1rem"}}><td style={{width:"50%"}} colSpan={5}>Flight A starts at {process(`${startTime}`, parseInt(startTime))}</td><td style={{width:"50%"}} colSpan={5}>Flight B starts at {process(`${parseInt(startTime)+100}`, parseInt(startTime)+100)}</td></tr>
              <tr style={{height: "1rem"}}><td style={{width:"5%"}}>Flight</td><td style={{width:"10%"}}>Team A</td><td style={{width:"10%"}}>Team B</td><td style={{width:"12.5%"}}>Room Code</td><td style={{width:"12.5%"}}>Judge Name</td><td style={{width:"5%"}}>Flight</td><td style={{width:"10%"}}>Team A</td><td style={{width:"10%"}}>Team B</td><td style={{width:"12.5%"}}>Room Code</td><td style={{width:"12.5%"}}>Judge Name</td></tr>
              <DoubleFlightTable rounds={roundsA} alsoRounds={roundsB}/>
            </>) : (<>
              <tr style={{height: "1rem"}}><td style={{width:"10%"}}>Flight</td><td style={{width:"20%"}}>Team A</td><td style={{width:"20%"}}>Team B</td><td style={{width:"25%"}}>Room Code</td><td style={{width:"25%"}}>Judge Name</td></tr>
              <SingleFlightTable rounds={roundsA}/>
            </>)}
          </table>
        </div>
      </div>

      <br/><br/><br/><br/><br/>
      
    </div>
  );
};

export default Home;