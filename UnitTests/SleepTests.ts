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

export function  CanBePutToBed() {

    Setup();

    //  tama is awake
    assert.ok((this.test_tama.sleep == false));

    //  put to bed
    this.test_tama.Bed(new Date());

    //  tama is asleep
    assert.ok((this.test_tama.sleep == true));

};

        //  Cannot be put to bed until sleepy
export function  WakesUpOnItsOwn() {

    Setup();

    //  tama is awake
    assert.ok((this.test_tama.sleep == false));

    //  put to bed
    this.test_tama.Bed(new Date());

    //  tama is asleep
    assert.ok((this.test_tama.sleep == true));

    //  Move Maximum sleep minutes into the future + 1
    let InTheFuture: Date = AddMinutes(new Date(), (GameConsts.SLEEPMINUTESMAX + 1));

    //  run the game loop
    this.test_tama.GameLoop(InTheFuture);

    //  Tamagotchi should have woken up
    assert.ok((this.test_tama.sleep == false));

};

export function  WontSleepUntilSleepy() {

    Setup();

    //  tama is awake
    assert.ok((this.test_tama.sleep == false));

    //  Move into the future - but tamagotchi shouldnt be sleepy yet
    let InTheFuture: Date = AddMinutes(new Date(), (GameConsts.SLEEPYMINUTESTIME - 1));

    //  make sure sleep event occurs -
    let sleeprandom: TestRandom = new TestRandom(GameEvents.Event_Sleep);
    this.test_tama.random = sleeprandom;

    //  run the game loop
    this.test_tama.GameLoop(InTheFuture);

    //  tama is asleep
    assert.ok((this.test_tama.sleep == false));
};

export function  GoesToSleepOnOwn() {

    Setup();

    //  tama is awake
    assert.ok((this.test_tama.sleep == false));

    //  Move into the future where tama should have gone to sleep on own.
    let InTheFuture: Date = AddMinutes(new Date(), -(GameConsts.SLEEPYMINUTESTIME + 2));

    //  make sure sleep event occurs -
    let sleeprandom: TestRandom = new TestRandom(GameEvents.Event_Sleep);
    this.test_tama.random = sleeprandom;

    //  run the game loop
    this.test_tama.GameLoop(InTheFuture);

    //  tama is asleep
    assert.ok((this.test_tama.sleep == true));
};
    
