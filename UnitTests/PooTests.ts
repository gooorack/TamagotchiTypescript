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
export function WontPooWhenAsleep() {

    Setup();

    //  Put to sleep
    assert.ok((this.test_tama.sleep == false));
    assert.ok((this.test_tama.poocounter == 0));
    this.test_tama.Bed(new Date());
    assert.ok((this.test_tama.sleep == true));

    //  Create Poos
    let poorandom: TestRandom = new TestRandom(GameEvents.Event_Poo);
    this.test_tama.random = poorandom;

    //  Run Gameloop
    let future: Date = AddMinutes(new Date(), (GameConsts.SLEEPMINUTESMAX - 1));
    this.test_tama.GameLoop(future);

    //  tama is still asleep
    assert.ok((this.test_tama.sleep == true));

    //  should be no poos
    assert.ok((this.test_tama.poocounter == 0));
};

export function EggsDontPoo() {
    Setup();

    //  Put to sleep
    assert.ok((this.test_tama.status == Lifecycle.egg));
    assert.ok((this.test_tama.poocounter == 0));

    //  Create Poos
    let poorandom: TestRandom = new TestRandom(GameEvents.Event_Poo);
    this.test_tama.random = poorandom;

    //  5 minutes of Gameloop
    let future: Date = AddMinutes(new Date(), 2);
    this.test_tama.GameLoop(future);

    //  Should be no poos
    assert.ok((this.test_tama.status == Lifecycle.egg));
    assert.ok((this.test_tama.poocounter == 0));
};

export function AbleToCleanUpPoo() {

    Setup();

    //  Set poo counter > 0
    this.test_tama.poocounter = 2;
    assert.ok((this.test_tama.poocounter > 0));

    // CLEAN UP Poo
    this.test_tama.Clean();

    //  Should be no poo
    assert.ok((this.test_tama.poocounter == 0));
};

export function LooseHealthIfTooMuchPoo() {
    Setup();

    //  Set poo to an unhealthy level
    this.test_tama.poocounter = (GameConsts.POOUNHEALTHY + 1);
    assert.ok((this.test_tama.health == GameConsts.HEALTHMAX));
    assert.ok((this.test_tama.poocounter > GameConsts.POOUNHEALTHY));

    //  Create Poos
    let poorandom: TestRandom = new TestRandom(GameEvents.HealthDrop_Poo);
    this.test_tama.random = poorandom;

    //  1 minute of game loop
    let future: Date = AddMinutes(new Date(), 1);
    this.test_tama.GameLoop(future);

    //  Should have lost health
    assert.ok((this.test_tama.health < GameConsts.HEALTHMAX));
};
    
