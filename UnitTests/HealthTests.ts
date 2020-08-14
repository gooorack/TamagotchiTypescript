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

export function HealthHitsZeroshouldDie_Poo() {

    Setup();

    //  Start healthy
    assert.ok((this.test_tama.health == GameConsts.HEALTHMAX));
    assert.ok((this.test_tama.alive == true));

    //  Trigger unhealthly level of poo
    this.test_tama.poocounter = (GameConsts.POOUNHEALTHY + 1);
    //  Trigger random event
    let poorandom: TestRandom = new TestRandom(GameEvents.HealthDrop_Poo);
    this.test_tama.random = poorandom;

    //  Run gameloop
    let future: Date = AddMinutes(new Date(), 10);
    this.test_tama.GameLoop(future);

    //  Should die
    assert.ok((this.test_tama.health == 0));
    assert.ok((this.test_tama.alive == false));
};

export function HealthHitsZeroshouldDie_Hunger() {
    Setup();


    //  start healthy
    assert.ok((this.test_tama.health == GameConsts.HEALTHMAX));
    assert.ok((this.test_tama.alive == true));

    //  trigger dangerous hunger
    this.test_tama.hungrymeter = (GameConsts.HUNGRYHEALTHLEVEL - 1);

    //  hunger health loss random event triger
    let hungerrandom: TestRandom = new TestRandom(GameEvents.HealthDrop_Hunger);
    this.test_tama.random = hungerrandom;

    //  Run gameloop
    let future: Date = AddMinutes(new Date(), 10);
    this.test_tama.GameLoop(future);

    //  Health loss
    assert.ok((this.test_tama.health == 0));
    assert.ok((this.test_tama.alive == false));

};

export function RestoreHealth() {

    Setup();

    //  start at full health
    assert.ok((this.test_tama.health == GameConsts.HEALTHMAX));
    assert.ok((this.test_tama.alive == true));

    //  Loose health
    this.test_tama.hungrymeter = (GameConsts.HUNGRYHEALTHLEVEL - 1);
    let hungerrandom: TestRandom = new TestRandom(GameEvents.HealthDrop_Hunger);
    this.test_tama.random = hungerrandom;
    let future: Date = AddMinutes(new Date(), 0.5);

    this.test_tama.GameLoop(future);
    assert.ok((this.test_tama.health < GameConsts.HEALTHMAX));

    assert.ok((this.test_tama.alive == true));

    //  Now restore Health

    this.test_tama.Medicine();
    assert.ok((this.test_tama.health == GameConsts.HEALTHMAX));

};
    
