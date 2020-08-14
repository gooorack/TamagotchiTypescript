import { IRandomNumber } from './consts/IRandomNumber';


    ///  <summary>
    ///  Basic random number generator
    ///  </summary>
    export class TamagotchiRandom implements IRandomNumber {

        public constructor() {

        }

        //rnd: Random;

        public getint(): number {
            let min = 0;
            let max = 20;
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
    }
    export class TestRandom implements IRandomNumber {

        public constructor(desiredoutput: number) {
           this.output = desiredoutput;
        }
        getint(): number {
            return this.output;
        }

        //let output;
        public output: number;

    };


    export function AddMinutes(startdate: Date, minutes: number):Date {
        var MS_PER_MINUTE = 60000;
       
        var aMinuteAgo = new Date(Date.now() + (MS_PER_MINUTE * minutes));
        return aMinuteAgo;
    };

    export function AddSeconds(startdate: Date, seconds: number): Date {
        var aMinuteAgo = new Date(Date.now() + (1000 * seconds));
        return aMinuteAgo;
    };