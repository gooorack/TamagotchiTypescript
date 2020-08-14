import { GameEvents } from '../GameEvents';
import { GameConsts } from '../GameConsts';
import { GameStrings } from './consts/GameStrings';
import { GameCommands } from '../GameCommands';
import { StringBuilder } from '../StringBuilder';
import { Lifecycle } from '../Lifecycle';
import { TamagotchiRandom, AddMinutes, AddSeconds } from '../TamagotchiRandom'; 
import { IRandomNumber } from '../IRandomNumber';

    ///  <summary>
    ///  Basic Tamagotchi class
    ///  </summary>
export module Tamagotchi {


    export class Tamagotchi {

        public constructor(createdtime: Date) {


            this.random = new TamagotchiRandom();
            //  Set starting characteristics
            this.status = Lifecycle.egg;
            this.birthdate = createdtime;
            //  Tamagotchi starts off at max stats
            this.hungrymeter = GameConsts.HUNGRYMAX;
            this.happymeter = GameConsts.HAPPYMAX;
            this.health = GameConsts.HEALTHMAX;
            this.poocounter = 0;
            this.sleep = false;
            this.alive = true;
            this.Weight = GameConsts.STARTWEIGHT;
            //  Life timers
            this.awake_time = createdtime;
            this.last_evolution = createdtime;
            this.LastFedTime = createdtime;
            this.previousgameloop = createdtime;
        }



        //  constructor
        random: IRandomNumber;// = new TamagotchiRandom();

        //  Tamagotchi
        name: string;

        status: Lifecycle;

        birthdate: Date;

        Weight: number;

        previousgameloop: Date;

        //  Last time GameLoop was processed
        //  Evolution
        last_evolution: Date;

        //  Sleep behaviour
        puttobedtime: Date;

        //  when the tamagotchi went ot bed
        awake_time: Date;

        //  how long the Tamagotchi stays awake for before going to bed
        sleep: boolean;

        //  current sleep status
        //  Feeding Behaviour
        hungrymeter: number;

        //  How hungry the tamagotchi is
        LastFedTime: Date;

        //  when the tamagotchi was fed last
        //  Poo behvaiour
        poocounter: number;

        //  Happy Behaviour
        happymeter: number;

        //  Health
        health: number;

        alive: boolean;

        //  alive or dead
        Age(): Date {
            let age: Date = new Date(Date.now() - this.birthdate.getTime());
            //return age;
            return age;
        }

        Die() {
            this.alive = false;
            console.log("Your Tamagotchi died");
        }

        Medicine(): string {
            this.health = GameConsts.HEALTHMAX;
            return "Your Tamagotchi now has full health";
        }

        Evolve(timestamp: Date): string {
            this.last_evolution = timestamp;
            let message: string = "";
            switch (this.status) {
                case Lifecycle.egg:
                    message = (this.name + " has evolved into an infant");
                    this.status = Lifecycle.infant;
                    break;
                case Lifecycle.infant:
                    message = (this.name + " has evolved into an teen");
                    this.status = Lifecycle.teen;
                    break;
                case Lifecycle.teen:
                    message = (this.name + " has evolved into an adult");
                    this.status = Lifecycle.adult;
                    break;
                case Lifecycle.adult:
                    message = (this.name + " has evolved into an elderly");
                    this.status = Lifecycle.elderly;
                    break;
                case Lifecycle.elderly:
                    message = (this.name + " has died");
                    this.Die();
                    break;
            }

            return message;
        }

        GameLoop(current: Date) {
            //  RUN GAME LOOP before processing CLI - This should catch the game up to date.
            let sb: StringBuilder = new StringBuilder();




            //  10 second blocks
            while ((current.valueOf() - this.previousgameloop.valueOf()) > GameConsts.GAMELOOPSECONDS) {

                sb.Clear();

                //  Generate Random Event - only 1 per loop
                let EventID: number = this.random.getint();

                //  Death
                if (!this.alive) {
                    this.previousgameloop = current;
                    console.log("Your Tamagotchi is dead");
                }

                //  Happyness degredation
                if ((EventID == GameEvents.HappynessDrop)) {
                    if ((this.happymeter > 0)) {
                        this.happymeter--;
                    }

                }

                //  Hunger
                if (!this.sleep) {
                    let how_long_sincelast_fed = (this.previousgameloop.valueOf() - this.LastFedTime.valueOf());
                    if ((how_long_sincelast_fed > (GameConsts.HUNGRYMINUTES * 60))) {
                        if ((EventID == GameEvents.Event_Hunger)) {
                            if ((this.hungrymeter > 0)) {
                                this.hungrymeter--;
                            }

                            sb.Append((this.name + GameStrings.GotHungry));
                        }

                    }

                    if ((this.hungrymeter < GameConsts.HUNGRYHEALTHLEVEL)) {
                        sb.Append((this.name + " is hungry:"));
                        //  When Hungry - randomly decrease health
                        if ((EventID == GameEvents.HealthDrop_Hunger)) {
                            this.health--;
                            if ((this.health == 0)) {
                                this.Die();
                            }

                            sb.Append((this.name + " lost health due to hunger"));
                        }

                    }

                }

                //  Evolution Behaviour
                let time_since_evolution = (this.previousgameloop.valueOf() - this.last_evolution.valueOf());
                if ((time_since_evolution > (GameConsts.EVOLVETIMERMIUTES * 60))) {
                    this.Evolve(this.previousgameloop);
                }

                //  POO Behaviour
                if (!this.sleep) {
                    if (((this.status != Lifecycle.egg)
                        && (EventID == GameEvents.Event_Poo))) {
                        this.poocounter++;
                        sb.Append((this.name + " did a poo"));
                    }

                    if ((this.poocounter > GameConsts.POOUNHEALTHY)) {
                        if ((EventID == GameEvents.HealthDrop_Poo)) {
                            if ((this.health > 0)) {
                                sb.Append((this.name + " lost health due to too much POO"));
                                this.health--;
                                if ((this.health == 0)) {
                                    this.Die();
                                }

                            }

                        }

                    }

                }

                //  Sleep Behaviour
                if (this.sleep) {
                    let how_long_asleep = (this.previousgameloop.valueOf() - this.puttobedtime.valueOf());
                    if ((how_long_asleep > (GameConsts.SLEEPMINUTESMAX * 60))) {
                        this.sleep = false;
                        this.awake_time = this.previousgameloop;
                        sb.Append((this.name + " woke up"));
                    }
                    else {
                        // sb.Append(name + " is asleep\n");
                    }

                }
                else {
                    //  not asleep - should it fall asleep
                    let how_long_awake = (this.previousgameloop.valueOf() - this.awake_time.valueOf());
                    if ((how_long_awake > (GameConsts.SLEEPYMINUTESTIME * 60))) {
                        //  tamoagotchi is a bit sleepy
                        if ((EventID == GameEvents.Event_Sleep)) {
                            this.Bed(this.previousgameloop);
                            sb.Append((this.name + " went to sleep"));
                        }

                    }

                }

                //  Report
                let report: string = sb.ToString();
                if ((report != "")) {
                    console.log(report);
                }

                //  Increment Time
                this.previousgameloop = AddSeconds(this.previousgameloop, GameConsts.GAMELOOPSECONDS);
            }

        }

        //  FEED
        Feed(timestamp: Date): string {
            if (this.sleep) {
                return (this.name + " is asleep and cant be fed");
            }

            this.LastFedTime = timestamp;
            if ((this.hungrymeter == GameConsts.HUNGRYMAX)) {
                return (this.name + " is FULL");
            }
            else {
                this.hungrymeter++;
                this.Weight = (this.Weight + GameConsts.WEIGHTINCREASE);
                return (this.name + " eats its yummy food");
            }

        }

        //  FEED
        Play(): string {
            if (this.sleep) {
                return (this.name + " is asleep");
            }

            if ((this.happymeter == GameConsts.HAPPYMAX)) {
                return "Your Pet is already completely happy";
            }
            else {
                this.happymeter++;
                return "Your pet has fun playing and increases happyness";
                //  PLAY GAME HERE
            }

        }

        //  POOP
        Clean(): string {
            if ((this.poocounter > 0)) {
                this.poocounter = 0;
                return "Poo has been cleaned up";
            }
            else {
                return "No poo to clean";
            }

        }

        //  BED
        Bed(timestamp: Date): string {
            if (this.sleep) {
                return (this.name + " is already asleep");
            }

            this.sleep = true;
            this.puttobedtime = timestamp;
            return (this.name + " is now asleep and in bed");
        }

        //  Show game status
        GetStatus(): string {
            let sb: StringBuilder = new StringBuilder();
            sb.Append(("Tamagotchi Name: " + (this.name + "")));
            sb.Append(("\nBirthdate: " + (this.birthdate.toString() + "")));
            sb.Append(("\nEvolution: " + (this.status.toString() + "")));
            sb.Append(("\nAge: " + (this.Age().getMinutes().toString() + " minutes old")));
            sb.Append(("\nHealth meter:         (" + (this.health.toString() + ("/" + (GameConsts.HEALTHMAX.toString() + ")")))));
            sb.Append(("\nHungry meter:         (" + (this.hungrymeter.toString() + ("/" + (GameConsts.HUNGRYMAX.toString() + ")")))));
            sb.Append(("\nHappy meter:         (" + (this.happymeter.toString() + ("/" + (GameConsts.HAPPYMAX.toString() + ")")))));
            sb.Append(("\nNumber of Poos:     (" + (this.poocounter.toString() + ")")));
            return sb.ToString();

        }

        //  Name
        Name(input: string): string {
            this.name = input;
            this.status = Lifecycle.egg;
            return ("Congratulation you have named your tamagotchi " + input);
        }

        //  Loose health
        Help(): string {
            let sb: StringBuilder = new StringBuilder();
            sb.Append("SUPPORT COMMANDS: ");
            sb.Append("\nFEED - Feed your Tamagotchi.");
            sb.Append("\nBed - Put your Tamagotchi to bed.");
            sb.Append("\nSTATUS - Show the status of your Tamagotchi.");
            sb.Append("\nCLEAN - Clean up your Tamagtochis poo.");
            sb.Append("\nMEDICINE - Restore health to your Tamagotchi.");
            sb.Append("\nPLAY - Play your Tamagotchi to increase happyness.");
            //  show supported commands
            return sb.ToString();

        }

        ProcessCommand(input: string): string {
            switch (input.toLowerCase()) {
                case GameCommands.FEED:
                    this.GameLoop(new Date());
                    return this.Feed(this.previousgameloop);
                    break;
                case GameCommands.HELP:
                    return this.Help();
                    break;
                case GameCommands.BED:
                    this.GameLoop(new Date());
                    return this.Bed(this.previousgameloop);
                    break;
                case GameCommands.STATUS:
                    this.GameLoop(new Date());
                    return this.GetStatus();
                    break;
                case GameCommands.CLEAN:
                    this.GameLoop(new Date());
                    return this.Clean();
                    break;
                case GameCommands.MEDICINE:
                    this.GameLoop(new Date());
                    return this.Medicine();
                    break;
                case GameCommands.PLAY:
                    this.GameLoop(new Date());
                    return this.Play();
                    break;
                case GameCommands.BLANK:
                    this.GameLoop(new Date());
                    return "";
                    break;
                default:
                    return "Command not recognised";
                    break;
            }

        }
    }
}
