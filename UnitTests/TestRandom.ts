import assert = require('assert');
import { IRandomNumber } from '../IRandomNumber';


    ///  <summary>
    ///  MOCKS THE random number generator.... lets you mock the random number generator and ensure you get the event you want. 
    ///  </summary>


    export class TestRandom implements IRandomNumber {

        public constructor(desiredoutput: number) {
            this.output = desiredoutput;
        }
        getint(): number {
            return this.output;
        }

        public output: number;

    };
