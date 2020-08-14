import assert = require('assert');
import { Tamagotchi } from '../src/Tamagotchi';
import { GameConsts } from '../GameConsts';
import { GameEvents } from '../GameEvents';


import { Lifecycle } from '../Lifecycle';
import { TestRandom, AddMinutes } from '../TamagotchiRandom'; 


///  <summary>
///  Tests for Tamagotchi evolution and life cycle
///  </summary>

let test_tama: Tamagotchi.Tamagotchi;
let TamagotchiName: string = "TEST";



function Setup() {

    //TestContext.WriteLine("Create Test Tamagotchi called TEST ");
    this.test_tama = new Tamagotchi.Tamagotchi(new Date());
    this.test_tama.Name(TamagotchiName);
};

export function HappynessDecreasesOverTime() {

    Setup();


    //  Startr happy
    assert.ok((this.test_tama.happymeter == GameConsts.HAPPYMAX));

    //  Trigger Happyness drop
    let happylossrandom: TestRandom = new TestRandom(GameEvents.HappynessDrop);
    this.test_tama.random = happylossrandom;

    //  Run gameloop
    let future: Date = AddMinutes(new Date(), 1);
    this.test_tama.GameLoop(future);

    //  Happyness should have dropped
    assert.ok((this.test_tama.happymeter < GameConsts.HAPPYMAX));

};

export function PLayingIncreasesHappyness() {

    Setup();

    //  Startb Happy
    assert.ok((this.test_tama.happymeter == GameConsts.HAPPYMAX));

    //  Drop Happyness
    let happylossrandom: TestRandom = new TestRandom(GameEvents.HappynessDrop);
    this.test_tama.random = happylossrandom;
    let future: Date = AddMinutes(new Date(), 1);
    this.test_tama.GameLoop(future);
    assert.ok((this.test_tama.happymeter < GameConsts.HAPPYMAX));

    //  Play
    for (let i: number = 0; (i< (GameConsts.HAPPYMAX + 1)); i++) {
        this.test_tama.Play();
    }


    //  Happyness should be full
    assert.ok((this.test_tama.happymeter == GameConsts.HAPPYMAX));

};

export function  CannotPlayWhenAsleep() {

    Setup();

    //  Put to sleep
    assert.ok((this.test_tama.happymeter == GameConsts.HAPPYMAX));
    this.test_tama.Bed(new Date());
    assert.ok((this.test_tama.sleep == true));

    //  Try and play - should not be able to
    let output: string = this.test_tama.Play();
    assert.ok((output == "TEST is asleep"));

};
    
